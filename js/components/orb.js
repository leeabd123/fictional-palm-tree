// <tariga-orb> — iridescent liquid orb (WebGL shader with CSS fallback)
// Attributes: mode="listening" | "thinking" | "idle"  (controls palette + energy)
(function () {
  const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

  const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uEnergy;   // 0 idle .. 1 listening
uniform float uTeal;     // 0 purple-pink .. 1 teal (thinking)
uniform float uLevel;    // mic-ish pulse 0..1

// hash / noise / fbm
float hash(vec3 p){ p = fract(p*0.3183099+.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x);
  f = f*f*f*(f*(f*6.0-15.0)+10.0);
  return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),
                 mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),
                 mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
}
float fbm(vec3 p){
  float v = 0.0; float a = 0.5;
  for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.03 + vec3(7.3); a *= 0.55; }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy*2.0 - uRes) / min(uRes.x, uRes.y);
  float t = uTime*0.22;
  float r = length(uv);

  // gentle low-frequency wobble keeps the silhouette smooth, not ragged
  float wob = fbm(vec3(uv*1.1, t)) - 0.5;
  float pulse = 0.015*uLevel*sin(uTime*5.0);
  float radius = 0.78 + wob*(0.035 + 0.035*uEnergy) + pulse;

  float d = r - radius;
  float aa = 2.5/min(uRes.x,uRes.y);
  float body = 1.0 - smoothstep(-aa, aa, d);
  float glow = exp(-max(d, 0.0)*7.0) * (1.0 - body);

  // true sphere normal
  float rr = clamp(r/radius, 0.0, 1.0);
  float z = sqrt(1.0 - rr*rr);
  vec3 n = normalize(vec3(uv/radius, z));

  // domain-warped swirl flow — no angular seam at the center
  float ct = cos(t*0.45), st = sin(t*0.45);
  vec2 q = mat2(ct, -st, st, ct) * uv;
  float sw = 1.5 + 0.7*z;
  float w1 = fbm(vec3(q*sw + vec2(0.0, t*0.6), t*0.7));
  float w2 = fbm(vec3(q*sw*2.1 + w1*2.6 + 11.0, t*0.9));
  float band = 0.5 + 0.5*sin((q.y*3.0 + w1*5.0 + w2*2.0)*1.7 + t*2.2);

  // palettes
  vec3 A1 = vec3(0.55,0.42,0.96);  // violet
  vec3 A2 = vec3(0.99,0.66,0.86);  // pink
  vec3 A3 = vec3(0.50,0.74,1.00);  // blue
  vec3 B1 = vec3(0.16,0.82,0.75);  // teal
  vec3 B2 = vec3(0.55,0.95,1.00);  // cyan
  vec3 B3 = vec3(0.78,0.90,1.00);  // ice
  vec3 c1 = mix(A1,B1,uTeal); vec3 c2 = mix(A2,B2,uTeal); vec3 c3 = mix(A3,B3,uTeal);

  vec3 col = mix(c1, c2, band);
  col = mix(col, c3, smoothstep(0.35, 0.85, w2));

  // sphere shading — reads as glass/polished stone, not a flat cloud
  vec3 L = normalize(vec3(-0.45, 0.55, 0.72));
  float diff = 0.64 + 0.36*max(0.0, dot(n, L));
  col *= diff * (0.90 + 0.22*z);

  // fresnel rim + crisp specular
  float fres = pow(1.0 - z, 2.6);
  col += mix(vec3(0.80,0.68,1.0), vec3(0.55,1.0,0.94), uTeal) * fres * (0.5 + 0.4*uEnergy);
  float spec = pow(max(0.0, dot(reflect(-L, n), vec3(0.0,0.0,1.0))), 42.0);
  col += vec3(1.0)*spec*0.5;

  vec3 glowCol = mix(vec3(0.62,0.48,1.0), vec3(0.30,0.90,0.85), uTeal);
  vec3 final = col*body + glowCol*glow*(0.22 + 0.25*uEnergy + 0.3*uLevel);
  float alpha = clamp(body + glow*(0.40 + 0.3*uEnergy), 0.0, 1.0);

  gl_FragColor = vec4(final*alpha, alpha);
}
`;

  class TarigaOrb extends HTMLElement {
    connectedCallback() {
      if (this._init) { this._dead = false; if (this._raf) cancelAnimationFrame(this._raf); if (this._drawLoop) this._drawLoop(); return; }
      this._init = true;
      this.style.display = 'block';
      this.style.position = 'relative';
      this.style.width = '100%';
      this.style.height = '100%';
      if (!this.clientHeight) this.style.aspectRatio = '1 / 1';
      this._start = performance.now();
      this._energy = 0; this._teal = 0; this._level = 0;
      this._targets = { energy: 0.4, teal: 0, level: 0 };
      this._applyMode();
      if (!this._tryWebGL()) this._cssFallback();
    }
    static get observedAttributes() { return ['mode']; }
    attributeChangedCallback() { if (this._init) this._applyMode(); }
    _applyMode() {
      const m = this.getAttribute('mode') || 'idle';
      if (m === 'listening') this._targets = { energy: 1.0, teal: 0.0, level: 0.7 };
      else if (m === 'thinking') this._targets = { energy: 0.75, teal: 1.0, level: 0.25 };
      else this._targets = { energy: 0.35, teal: 0.15, level: 0.08 };
      if (this._fb) this._fbMode();
    }
    disconnectedCallback() { this._dead = true; if (this._raf) cancelAnimationFrame(this._raf); }

    _tryWebGL() {
      try {
        const c = document.createElement('canvas');
        c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
        const gl = c.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
        if (!gl) return false;
        const mk = (type, src) => {
          const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
          return s;
        };
        const prog = gl.createProgram();
        gl.attachShader(prog, mk(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, mk(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
        gl.useProgram(prog);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'aPos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        const uRes = gl.getUniformLocation(prog, 'uRes');
        const uTime = gl.getUniformLocation(prog, 'uTime');
        const uEnergy = gl.getUniformLocation(prog, 'uEnergy');
        const uTeal = gl.getUniformLocation(prog, 'uTeal');
        const uLevel = gl.getUniformLocation(prog, 'uLevel');
        this.appendChild(c);
        const draw = () => {
          if (this._dead) return;
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = Math.max(1, Math.round(this.clientWidth * dpr));
          const h = Math.max(1, Math.round(this.clientHeight * dpr));
          if (c.width !== w || c.height !== h) { c.width = w; c.height = h; gl.viewport(0, 0, w, h); }
          // ease toward targets
          const k = 0.045;
          this._energy += (this._targets.energy - this._energy) * k;
          this._teal += (this._targets.teal - this._teal) * k;
          const wobble = this._targets.level * (0.7 + 0.3 * Math.sin(performance.now() / 340));
          this._level += (wobble - this._level) * 0.08;
          gl.uniform2f(uRes, w, h);
          gl.uniform1f(uTime, (performance.now() - this._start) / 1000);
          gl.uniform1f(uEnergy, this._energy);
          gl.uniform1f(uTeal, this._teal);
          gl.uniform1f(uLevel, this._level);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
          this._raf = requestAnimationFrame(draw);
        };
        this._drawLoop = draw;
        draw();
        return true;
      } catch (e) { return false; }
    }

    _cssFallback() {
      const d = document.createElement('div');
      this._fb = d;
      d.style.cssText = 'position:absolute;inset:7%;border-radius:50%;filter:blur(0.5px);animation:tariga-orb-breathe 4s ease-in-out infinite;';
      const style = document.createElement('style');
      style.textContent = '@keyframes tariga-orb-breathe{0%,100%{transform:scale(0.96)}50%{transform:scale(1.04)}}@keyframes tariga-orb-spin{to{transform:rotate(360deg)}}';
      this.appendChild(style);
      this.appendChild(d);
      this._fbMode();
    }
    _fbMode() {
      if (!this._fb) return;
      const m = this.getAttribute('mode') || 'idle';
      const pal = m === 'thinking'
        ? 'radial-gradient(circle at 32% 28%, rgba(180,240,255,.95), rgba(46,220,200,.85) 34%, rgba(20,120,140,.9) 68%, rgba(8,40,50,.95))'
        : 'radial-gradient(circle at 32% 28%, rgba(255,220,245,.95), rgba(200,140,250,.85) 34%, rgba(110,80,220,.9) 66%, rgba(30,18,70,.95))';
      const glow = m === 'thinking' ? 'rgba(60,220,200,.45)' : 'rgba(160,110,255,.45)';
      this._fb.style.background = pal;
      this._fb.style.boxShadow = `0 0 80px 8px ${glow}, inset -18px -24px 60px rgba(0,0,0,.45), inset 10px 14px 40px rgba(255,255,255,.25)`;
    }
  }
  if (!customElements.get('tariga-orb')) customElements.define('tariga-orb', TarigaOrb);
})();
