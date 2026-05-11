/**
 * ui.js – reusable UI components & helpers
 */

const UI = (() => {

  // ── Toast notifications ───────────────────────────────
  function toast(msg, type = 'success', duration = 3200) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warn: '⚠️' };
    const el = document.createElement('div');
    el.className = `toast ${type !== 'success' ? type : ''}`;
    el.innerHTML = `<span>${icons[type] || icons.success}</span><span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(60px)'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 320); }, duration);
  }

  // ── Modal system ─────────────────────────────────────
  let _modalEl = null;
  function openModal(html, onClose) {
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';
    overlay.innerHTML = `<div class="modal">${html}</div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) { if (onClose) onClose(); closeModal(); } });
    document.body.appendChild(overlay);
    _modalEl = overlay;
    // Close on ESC
    document.addEventListener('keydown', _escClose);
  }
  function closeModal() {
    const m = document.getElementById('active-modal');
    if (m) m.remove();
    document.removeEventListener('keydown', _escClose);
    _modalEl = null;
  }
  function _escClose(e) { if (e.key === 'Escape') closeModal(); }

  // ── Post card HTML ─────────────────────────────────────
  const COLORS = ['#4caf7d','#4891c5','#e0b84a','#c56b9e','#7b67d4','#e05e55','#4bbfc5','#82c83e'];
  const BG_PAIRS = [
    ['#a8e6c5','#50c48a'], ['#a8d4f5','#4a9ed4'],
    ['#f5e0a8','#e0b84a'], ['#f5c5c5','#e05e55'],
    ['#c5a8f5','#7a4ae0'], ['#c5f0ee','#4ac8be'],
  ];

  function postCardHTML(post, user, idx = 0) {
    const cat = DB.CATEGORIES[post.category] || DB.CATEGORIES['khac'];
    const [c1, c2] = BG_PAIRS[idx % BG_PAIRS.length];
    const liked = (APP && APP.user) ? post.likes.includes(APP.user.id) : false;
    const commentCount = DB.getCommentsByPost(post.id).length;
    return `
      <div class="card post-card" onclick="APP.showPost('${post.id}')">
        <div class="card-thumb" style="background:linear-gradient(135deg,${c1},${c2})">
          <span style="font-size:62px">${cat.icon}</span>
        </div>
        <div class="card-body">
          <div class="post-author-row">
            <div class="post-avatar" style="background:${user ? user.color : '#aaa'}">${user ? user.avatar : '👤'}</div>
            <div>
              <div class="post-author-name">${user ? user.name : 'Ẩn danh'}</div>
              <div class="post-author-class">${user ? user.cls : ''}</div>
            </div>
            <span class="badge badge-green" style="margin-left:auto;font-size:10px">${cat.icon} ${cat.label}</span>
          </div>
          <div class="post-title">${post.title}</div>
          <div class="post-excerpt">${post.content.slice(0, 120)}…</div>
          <div class="post-meta">
            <span class="post-like ${liked ? 'liked' : ''}" onclick="event.stopPropagation();APP.likePost('${post.id}',this)">❤️ ${post.likes.length}</span>
            <span>💬 ${commentCount}</span>
            <span>👁️ ${post.views || 0}</span>
            <span class="post-date">${DB.ago(post.createdAt)}</span>
          </div>
        </div>
      </div>`;
  }

  // ── Heritage card HTML ────────────────────────────────
  const HERITAGE = [
    { title:'Phố cổ Hội An', badge:'Di sản UNESCO', icon:'🏮', bg:'linear-gradient(135deg,#f5d08a,#c87420)', desc:'Di sản văn hóa thế giới với kiến trúc độc đáo và những con phố đèn lồng lung linh về đêm.' },
    { title:'Thánh địa Mỹ Sơn', badge:'Di sản UNESCO', icon:'🛕', bg:'linear-gradient(135deg,#8fba70,#3a6820)', desc:'Quần thể đền tháp Chăm Pa huyền bí, được UNESCO công nhận là Di sản văn hóa thế giới.' },
    { title:'Làng bích họa Tam Thanh', badge:'Di sản văn hóa', icon:'🎨', bg:'linear-gradient(135deg,#70b0d4,#1850a0)', desc:'Ngôi làng chài được biến đổi thành bảo tàng nghệ thuật ngoài trời sống động và đầy màu sắc.' },
  ];

  function heritageCardHTML(h) {
    return `
      <div class="card heritage-card">
        <div class="card-thumb">
          <div class="card-thumb-inner" style="background:${h.bg}">${h.icon}</div>
          <div class="card-thumb-overlay"></div>
          <div class="card-thumb-badge">${h.badge}</div>
        </div>
        <div class="card-body">
          <div class="card-title">${h.title}</div>
          <div class="card-desc">${h.desc}</div>
          <a class="btn-link" href="#">Xem thêm →</a>
        </div>
      </div>`;
  }

  // ── Avatar color generator ─────────────────────────────
  function strColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return COLORS[Math.abs(hash) % COLORS.length];
  }

  // ── Confirm dialog ─────────────────────────────────────
  function confirm(msg) {
    return new Promise(resolve => {
      openModal(`
        <div class="modal-header"><div class="modal-title">Xác nhận</div></div>
        <div class="modal-body"><p style="font-size:15px;line-height:1.7">${msg}</p></div>
        <div class="modal-footer">
          <button class="btn btn-outline btn-sm" onclick="UI.closeModal()">Huỷ</button>
          <button class="btn btn-primary btn-sm" id="confirm-ok">Đồng ý</button>
        </div>`);
      document.getElementById('confirm-ok').onclick = () => { closeModal(); resolve(true); };
    });
  }

  // ── Scroll reveal ─────────────────────────────────────
  function initReveal() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 90);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
  }

  // ── Animated counter ─────────────────────────────────
  function animateCount(el, target) {
    let cur = 0;
    const step = target / 80;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur).toLocaleString('vi');
      if (cur >= target) clearInterval(t);
    }, 18);
  }

  // ── Image to base64 ───────────────────────────────────
  function fileToBase64(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(file);
    });
  }

  // ── Truncate text ─────────────────────────────────────
  function truncate(str, n) { return str.length > n ? str.slice(0, n) + '…' : str; }

  // ── Escape HTML ───────────────────────────────────────
  function esc(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { toast, openModal, closeModal, postCardHTML, heritageCardHTML, HERITAGE, strColor, confirm, initReveal, animateCount, fileToBase64, truncate, esc };
})();
