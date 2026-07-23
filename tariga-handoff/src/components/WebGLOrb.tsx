import React, { useEffect, useRef, useState } from 'react';

const VERT = `
attribute vec2 aPos;
void main(){ gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uEnergy;
uniform float uLevel;

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

  float wob = fbm(vec3(uv*1.1, t)) - 0.5;
  float pulse = 0.015*uLevel*sin(uTime*5.0);
  float radius = 0.78 + wob*(0.035 + 0.035*uEnergy) + pulse;

  float d = r - radius;
  float aa = 2.5/min(uRes.x,uRes.y);
  float body = 1.0 - smoothstep(-aa, aa, d);
  float glow = exp(-max(d, 0.0)*7.0) * (1.0 - body);

  float rr = clamp(r/radius, 0.0, 1.0);
  float z = sqrt(1.0 - rr*rr);
  vec3 n = normalize(vec3(uv/radius, z));

  float ct = cos(t*0.45), st = sin(t*0.45);
  vec2 q = mat2(ct, -st, st, ct) * uv;
  float sw = 1.5 + 0.7*z;
  float w1 = fbm(vec3(q*sw + vec2(0.0, t*0.6), t*0.7));
  float w2 = fbm(vec3(q*sw*2.1 + w1*2.6 + 11.0, t*0.9));
  float band = 0.5 + 0.5*sin((q.y*3.0 + w1*5.0 + w2*2.0)*1.7 + t*2.2);

  // Warm gold/amber/copper palette
  vec3 c1 = vec3(0.82, 0.43, 0.25); // Copper / Ember
  vec3 c2 = vec3(0.91, 0.79, 0.60); // Light Gold (#e8c99a)
  vec3 c3 = vec3(0.40, 0.20, 0.05); // Deep dark bronze/amber

  vec3 col = mix(c1, c2, band);
  col = mix(col, c3, smoothstep(0.35, 0.85, w2));

  // Shading
  vec3 L = normalize(vec3(-0.45, 0.55, 0.72));
  float diff = 0.64 + 0.36*max(0.0, dot(n, L));
  col *= diff * (0.90 + 0.22*z);

  // Fresnel rim + specular
  float fres = pow(1.0 - z, 2.6);
  col += vec3(0.95, 0.85, 0.65) * fres * (0.5 + 0.4*uEnergy);
  float spec = pow(max(0.0, dot(reflect(-L, n), vec3(0.0,0.0,1.0))), 42.0);
  col += vec3(1.0, 0.95, 0.8)*spec*0.5;

  vec3 glowCol = vec3(0.85, 0.55, 0.25); // Warm ambient glow
  vec3 final = col*body + glowCol*glow*(0.22 + 0.25*uEnergy + 0.3*uLevel);
  float alpha = clamp(body + glow*(0.40 + 0.3*uEnergy), 0.0, 1.0);

  gl_FragColor = vec4(final*alpha, alpha);
}
`;

interface WebGLOrbProps {
  mode?: 'idle' | 'listening' | 'thinking';
  className?: string;
  style?: React.CSSProperties;
}

export const WebGLOrb: React.FC<WebGLOrbProps> = ({ mode = 'idle', className = '', style }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webGLFailed, setWebGLFailed] = useState(false);

  useEffect(() => {
    if (webGLFailed || !canvasRef.current || !containerRef.current) return;

    const c = canvasRef.current;
    const gl = c.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: true });
    
    if (!gl) {
      setWebGLFailed(true);
      return;
    }

    const mk = (type: number, src: string) => {
      const s = gl.createShader(type)!; 
      gl.shaderSource(s, src); 
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        setWebGLFailed(true);
        return null;
      }
      return s;
    };

    const vShader = mk(gl.VERTEX_SHADER, VERT);
    const fShader = mk(gl.FRAGMENT_SHADER, FRAG);
    if (!vShader || !fShader) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setWebGLFailed(true);
      return;
    }

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
    const uLevel = gl.getUniformLocation(prog, 'uLevel');

    let energy = 0;
    let level = 0;
    const start = performance.now();
    let rafId: number;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(containerRef.current!.clientWidth * dpr));
      const h = Math.max(1, Math.round(containerRef.current!.clientHeight * dpr));

      if (c.width !== w || c.height !== h) { 
        c.width = w; 
        c.height = h; 
        gl.viewport(0, 0, w, h); 
      }

      let tEnergy = 0.35;
      let tLevel = 0.08;
      if (mode === 'listening') {
        tEnergy = 1.0;
        tLevel = 0.7;
      } else if (mode === 'thinking') {
        tEnergy = 0.75;
        tLevel = 0.25;
      }

      const k = 0.045;
      energy += (tEnergy - energy) * k;
      const wobble = tLevel * (0.7 + 0.3 * Math.sin(performance.now() / 340));
      level += (wobble - level) * 0.08;

      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uTime, (performance.now() - start) / 1000);
      gl.uniform1f(uEnergy, energy);
      gl.uniform1f(uLevel, level);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [mode, webGLFailed]);

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      {webGLFailed ? (
        <div style={{
          position: 'absolute',
          inset: '7%',
          borderRadius: '50%',
          filter: 'blur(0.5px)',
          background: 'radial-gradient(circle at 35% 35%, #e8c99a, #c9a96e 40%, #e08a7a 80%, #7d6544)',
          boxShadow: '0 0 40px 8px rgba(201,169,110,0.4), inset -10px -10px 30px rgba(0,0,0,0.5), inset 5px 5px 20px rgba(255,255,255,0.3)',
          animation: 'tariga-orb-breathe 4s ease-in-out infinite'
        }} />
      ) : (
        <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      )}
      <style>{`
        @keyframes tariga-orb-breathe {
          0%, 100% { transform: scale(0.96); }
          50% { transform: scale(1.04); }
        }
      `}</style>
    </div>
  );
};
