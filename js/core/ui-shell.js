// Tariga definition modal, sidebar toggle for mobile
function showTarigaDef(){
  const overlay = document.createElement('div');
  overlay.className = 'tariga-overlay';
  overlay.innerHTML = `
    <div class="tariga-modal">
      <button class="tariga-modal-close" onclick="this.closest('.tariga-overlay').remove()">×</button>
      <div class="tariga-arabic">طريقة</div>
      <div class="tariga-romanized">ta·ri·ga</div>
      <div class="tariga-divider"></div>
      <div class="tariga-def-row">
        <div class="tariga-def-num">1.</div>
        <div class="tariga-def-body">
          <div class="tariga-def-main">The way · the method · the path</div>
          <div class="tariga-def-note">How you do something — your approach, your manner, your style of moving through the world.</div>
        </div>
      </div>
      <div class="tariga-def-row">
        <div class="tariga-def-num">2.</div>
        <div class="tariga-def-body">
          <div class="tariga-def-main">طريقة كلامك — the way you speak</div>
          <div class="tariga-def-note">Used constantly in Sudanese Arabic. "طريقة كلامك مختلفة" = the way you talk is different. That's what this trainer is about.</div>
        </div>
      </div>
      <div class="tariga-root">
        <strong>Root: ط·ر·ق</strong> — to knock, to strike a path. From the same root as طريق (the road). A طريقة is literally the road you travel — and how you travel it.
        <br><br>
        <strong>Sudanese pronunciation:</strong> The ق becomes a hard G — so القاهرة becomes <em>al-Gaahira</em>, and طريقة becomes <em>tariga</em>. That G sound is one of the most distinctive features of Sudanese Arabic.
      </div>
    </div>
  `;
  overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

// ── Sidebar toggle ──
function toggleSidebar(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const btn = document.getElementById('menu-toggle');
  const isOpen = sidebar.classList.contains('open');
  sidebar.classList.toggle('open', !isOpen);
  overlay.classList.toggle('show', !isOpen);
  btn.textContent = isOpen ? '☰' : '✕';
}
function closeSidebar(){
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const btn = document.getElementById('menu-toggle');
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  btn.textContent = '☰';
}
// Close sidebar when a mode is selected on mobile
const _origSetMode = setMode;
// patch setMode to close sidebar on mobile after selection
function setModeAndClose(m){ setMode(m); if(window.innerWidth<=900) closeSidebar(); }

