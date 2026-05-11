/**
 * app.js – main application controller (SPA router)
 */

const APP = (() => {

  let user = null;   // currently logged-in user (or null)

  // ── INIT ──────────────────────────────────────────────
  function init() {
    DB.init();              // seed data
    user = DB.currentUser();
    renderHeader();
    renderHomeSections();
    initNav();
    initSearch();
    UI.initReveal();
    animateHeroStats();
    initLeafFall();
    updateHeaderUser();
  }

  // ── HEADER ────────────────────────────────────────────
  function renderHeader() {
    updateHeaderUser();
  }

  function updateHeaderUser() {
    const right = document.getElementById('header-right');
    if (!right) return;
    if (user) {
      right.innerHTML = `
        <button class="btn btn-post" onclick="APP.openPostModal()">✏️ Đăng bài</button>
        <div class="header-user" onclick="toggleDropdown()">
          <div class="header-avatar" style="background:${user.color}">${user.avatar}</div>
          <span class="header-username">${user.name.split(' ').slice(-1)[0]}</span>
          <span>▾</span>
          <div class="header-dropdown" id="user-dropdown">
            <div class="dropdown-item" onclick="APP.showPage('profile')">👤 Trang cá nhân</div>
            <div class="dropdown-item" onclick="APP.showPage('ranking')">🏆 Bảng xếp hạng</div>
            <div class="dropdown-item danger" onclick="APP.doLogout()">🚪 Đăng xuất</div>
          </div>
        </div>`;
    } else {
      right.innerHTML = `
        <div class="search-wrap">
          <span class="search-icon" onclick="handleSearch()">🔍</span>
          <input type="text" id="search-input" placeholder="Tìm kiếm…" onkeydown="if(event.key==='Enter')handleSearch()">
        </div>
        <button class="btn-login" onclick="APP.openLoginModal()">Đăng nhập</button>
        <button class="btn-post" onclick="APP.openRegisterModal()">Đăng ký</button>`;
    }
  }

  function toggleDropdown() {
    const d = document.getElementById('user-dropdown');
    if (d) d.classList.toggle('open');
    document.addEventListener('click', function close(e) {
      if (!e.target.closest('.header-user')) { if (d) d.classList.remove('open'); document.removeEventListener('click', close); }
    }, true);
  }

  // ── NAV / ROUTER ─────────────────────────────────────
  function initNav() {
    document.querySelectorAll('#main-nav a[data-page]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        showPage(a.dataset.page);
        // close mobile nav
        document.getElementById('main-nav').classList.remove('open');
      });
    });
    // scroll spy
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    // hamburger
    document.getElementById('hamburger')?.addEventListener('click', () => {
      document.getElementById('main-nav').classList.toggle('open');
    });
  }

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    let current = 'hero';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    document.querySelectorAll('#main-nav a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current || a.dataset.page === current);
    });
  }

  function showPage(name) {
    // Hide all virtual pages, show home sections
    document.getElementById('virtual-pages').innerHTML = '';
    const home = document.getElementById('home-content');
    if (name === 'home' || !name) {
      home.style.display = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    home.style.display = 'none';
    const wrap = document.getElementById('virtual-pages');
    if (name === 'profile')  renderProfilePage(wrap);
    else if (name === 'ranking') renderRankingPage(wrap);
    else if (name === 'posts-all') renderAllPostsPage(wrap);
    else if (name === 'search') renderSearchPage(wrap);
    window.scrollTo({ top: 0 });
  }

  // ── HERO STATS ────────────────────────────────────────
  function animateHeroStats() {
    const s = DB.getStats();
    const TARGETS = {
      'stat-trees': 1200,
      'stat-posts': Math.max(s.posts * 10, 50),
      'stat-heritage': 86,
      'stat-members': Math.max(s.users * 5, 30),
    };
    let triggered = false;
    const trigger = () => {
      if (triggered || window.scrollY < 100) return;
      triggered = true;
      Object.entries(TARGETS).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) UI.animateCount(el, val);
      });
    };
    window.addEventListener('scroll', trigger, { passive: true });
    setTimeout(trigger, 1600);
  }

  // ── LEAF FALL ────────────────────────────────────────
  function initLeafFall() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const leaves = ['🍃','🍀','🌿','🍃','🌱','🍀'];
    leaves.forEach((l, i) => {
      const el = document.createElement('div');
      el.className = 'leaf-fall';
      el.textContent = l;
      el.style.cssText = `left:${10 + i * 15}%;font-size:${14+i*2}px;animation-duration:${8+i*1.5}s;animation-delay:${i*1.2}s`;
      hero.appendChild(el);
    });
  }

  // ── SEARCH ────────────────────────────────────────────
  function initSearch() {
    // handled inline via handleSearch()
  }
  window.handleSearch = function() {
    const q = document.getElementById('search-input')?.value?.trim();
    if (!q) return;
    showPage('search');
    renderSearchPage(document.getElementById('virtual-pages'), q);
  };

  // ── AUTH MODALS ───────────────────────────────────────
  function openLoginModal() {
    UI.openModal(`
      <div class="modal-header">
        <div class="modal-title">🔐 Đăng nhập</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" id="l-email" type="email" placeholder="email@example.com" autofocus>
        </div>
        <div class="form-group">
          <label class="form-label">Mật khẩu</label>
          <input class="form-input" id="l-pass" type="password" placeholder="••••••" onkeydown="if(event.key==='Enter')APP.doLogin()">
        </div>
        <div id="l-err" class="form-error"></div>
        <p style="font-size:13px;color:#999;margin-top:12px">Demo: <b>minhanh@hs.vn</b> / <b>123456</b></p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="APP.openRegisterModal()">Đăng ký tài khoản</button>
        <button class="btn btn-primary" onclick="APP.doLogin()">Đăng nhập</button>
      </div>`);
  }

  function doLogin() {
    const email = document.getElementById('l-email')?.value?.trim();
    const pass  = document.getElementById('l-pass')?.value;
    const err   = document.getElementById('l-err');
    if (!email || !pass) { if (err) err.textContent = 'Vui lòng điền đầy đủ!'; return; }
    const res = DB.login(email, pass);
    if (!res.ok) { if (err) err.textContent = res.msg; return; }
    user = res.user;
    UI.closeModal();
    updateHeaderUser();
    UI.toast(`Chào mừng trở lại, ${user.name.split(' ').slice(-1)[0]}! 👋`);
  }

  function openRegisterModal() {
    UI.openModal(`
      <div class="modal-header">
        <div class="modal-title">🌱 Đăng ký tài khoản</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Họ và tên</label>
          <input class="form-input" id="r-name" placeholder="Nguyễn Văn A" autofocus>
        </div>
        <div class="form-group">
          <label class="form-label">Lớp</label>
          <input class="form-input" id="r-cls" placeholder="10A1">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" id="r-email" type="email" placeholder="email@example.com">
        </div>
        <div class="form-group">
          <label class="form-label">Mật khẩu</label>
          <input class="form-input" id="r-pass" type="password" placeholder="Ít nhất 6 ký tự" onkeydown="if(event.key==='Enter')APP.doRegister()">
        </div>
        <div id="r-err" class="form-error"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="APP.openLoginModal()">Đã có tài khoản</button>
        <button class="btn btn-primary" onclick="APP.doRegister()">Đăng ký</button>
      </div>`);
  }

  function doRegister() {
    const name  = document.getElementById('r-name')?.value?.trim();
    const cls   = document.getElementById('r-cls')?.value?.trim();
    const email = document.getElementById('r-email')?.value?.trim();
    const pass  = document.getElementById('r-pass')?.value;
    const err   = document.getElementById('r-err');
    if (!name || !email || !pass) { if (err) err.textContent = 'Vui lòng điền đầy đủ!'; return; }
    if (pass.length < 6) { if (err) err.textContent = 'Mật khẩu ít nhất 6 ký tự!'; return; }
    const res = DB.register({ name, cls: cls || 'Chưa rõ', email, password: pass });
    if (!res.ok) { if (err) err.textContent = res.msg; return; }
    DB.login(email, pass);
    user = DB.currentUser();
    UI.closeModal();
    updateHeaderUser();
    UI.toast(`Đăng ký thành công! Chào mừng ${name.split(' ').slice(-1)[0]} 🎉`);
  }

  function doLogout() {
    DB.logout(); user = null;
    updateHeaderUser();
    showPage('home');
    UI.toast('Đã đăng xuất!', 'info');
  }

  // ── POST MODAL ────────────────────────────────────────
  let _imgData = [];
  function openPostModal() {
    if (!user) { openLoginModal(); return; }
    _imgData = [];
    const cats = Object.entries(DB.CATEGORIES).map(([k,v]) =>
      `<option value="${k}">${v.icon} ${v.label}</option>`).join('');
    UI.openModal(`
      <div class="modal-header">
        <div class="modal-title">✏️ Đăng bài viết mới</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Tiêu đề bài viết *</label>
          <input class="form-input" id="p-title" placeholder="Nhập tiêu đề hấp dẫn…" autofocus maxlength="120">
        </div>
        <div class="form-group">
          <label class="form-label">Chuyên mục *</label>
          <select class="form-select" id="p-cat">${cats}</select>
        </div>
        <div class="form-group">
          <label class="form-label">Nội dung bài viết *</label>
          <textarea class="form-textarea" id="p-content" rows="7" placeholder="Chia sẻ câu chuyện, trải nghiệm, kiến thức của bạn…" style="min-height:160px"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Ảnh minh họa (tùy chọn)</label>
          <div class="upload-area" id="upload-area" onclick="document.getElementById('img-file').click()">
            <input type="file" id="img-file" accept="image/*" multiple onchange="APP.handleImgUpload(this)">
            <div class="upload-icon">🖼️</div>
            <p>Nhấn để chọn ảnh hoặc kéo thả vào đây</p>
            <p style="font-size:12px;color:#bbb;margin-top:4px">JPG, PNG, GIF – tối đa 3 ảnh</p>
          </div>
          <div class="img-preview-grid" id="img-preview"></div>
        </div>
        <div class="form-group">
          <label class="form-label">Tags (cách nhau bằng dấu phẩy)</label>
          <input class="form-input" id="p-tags" placeholder="môi trường, di sản, Hội An">
        </div>
        <div id="p-err" class="form-error"></div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="UI.closeModal()">Huỷ</button>
        <button class="btn btn-primary" onclick="APP.submitPost()">🚀 Đăng bài</button>
      </div>`, null);

    // drag-drop
    const area = document.getElementById('upload-area');
    area.addEventListener('dragover', e => { e.preventDefault(); area.classList.add('drag'); });
    area.addEventListener('dragleave', () => area.classList.remove('drag'));
    area.addEventListener('drop', e => { e.preventDefault(); area.classList.remove('drag'); APP.handleImgUpload({ files: e.dataTransfer.files }); });
  }

  async function handleImgUpload(input) {
    const files = Array.from(input.files || []).slice(0, 3 - _imgData.length);
    for (const f of files) {
      if (!f.type.startsWith('image/')) continue;
      const b64 = await UI.fileToBase64(f);
      _imgData.push(b64);
    }
    renderImgPreview();
  }

  function renderImgPreview() {
    const grid = document.getElementById('img-preview');
    if (!grid) return;
    grid.innerHTML = _imgData.map((d, i) => `
      <div class="img-preview-wrap">
        <img class="img-preview-item" src="${d}">
        <button class="remove-img" onclick="APP.removeImg(${i})">✕</button>
      </div>`).join('');
  }

  function removeImg(i) { _imgData.splice(i, 1); renderImgPreview(); }

  function submitPost() {
    const title   = document.getElementById('p-title')?.value?.trim();
    const cat     = document.getElementById('p-cat')?.value;
    const content = document.getElementById('p-content')?.value?.trim();
    const tags    = document.getElementById('p-tags')?.value?.split(',').map(t => t.trim()).filter(Boolean);
    const err     = document.getElementById('p-err');
    if (!title)   { if(err) err.textContent='Vui lòng nhập tiêu đề!'; return; }
    if (!content) { if(err) err.textContent='Vui lòng nhập nội dung!'; return; }
    const post = DB.createPost({ authorId: user.id, title, category: cat, content, images: [..._imgData], tags });
    user = DB.currentUser(); // refresh points
    UI.closeModal();
    UI.toast('Đăng bài thành công! 🎉');
    renderPostsSection();
    // Go show the post
    setTimeout(() => showPost(post.id), 600);
  }

  // ── SHOW POST DETAIL ─────────────────────────────────
  function showPost(postId) {
    const post = DB.getPostById(postId);
    if (!post) return;
    DB.incrementView(postId);
    const author = DB.getUserById(post.authorId);
    const cat    = DB.CATEGORIES[post.category] || DB.CATEGORIES['khac'];
    const liked  = user ? post.likes.includes(user.id) : false;
    const comments = DB.getCommentsByPost(postId);

    document.getElementById('home-content').style.display = 'none';
    const wrap = document.getElementById('virtual-pages');

    const imgHtml = post.images?.length
      ? post.images.map(src => `<img class="post-detail-img" src="${src}" alt="">`).join('')
      : '';

    const commentsHtml = comments.map(c => {
      const cu = DB.getUserById(c.authorId);
      return `
        <div class="comment-item">
          <div class="comment-avatar" style="background:${cu ? cu.color : '#aaa'}">${cu ? cu.avatar : '👤'}</div>
          <div class="comment-bubble">
            <div class="comment-author">${cu ? cu.name : 'Ẩn danh'}</div>
            <div class="comment-text">${UI.esc(c.text)}</div>
            <div class="comment-time">${DB.ago(c.createdAt)}</div>
          </div>
        </div>`;
    }).join('');

    wrap.innerHTML = `
      <div style="margin-top:var(--header-h);background:var(--gray-soft);min-height:100vh;padding-bottom:60px">
        <div class="container">
          <div class="post-detail">
            <div style="padding:32px 0 8px">
              <button class="btn btn-outline btn-sm" onclick="APP.showPage('home');document.getElementById('bai-viet').scrollIntoView({behavior:'smooth'})">← Quay lại</button>
            </div>
            <div class="post-detail-header">
              <span class="badge badge-green">${cat.icon} ${cat.label}</span>
              <h1 class="post-detail-title" style="margin-top:14px">${UI.esc(post.title)}</h1>
              <div class="post-detail-meta">
                <div style="display:flex;align-items:center;gap:10px">
                  <div class="post-avatar" style="background:${author ? author.color : '#aaa'};width:38px;height:38px;font-size:18px">${author ? author.avatar : '👤'}</div>
                  <div>
                    <div style="font-weight:700;font-size:14px;color:var(--green-dark)">${author ? author.name : 'Ẩn danh'}</div>
                    <div style="font-size:12px;color:#aaa">${author ? author.cls : ''} · ${DB.ago(post.createdAt)}</div>
                  </div>
                </div>
                <span style="font-size:13px;color:#aaa">👁️ ${(post.views||0)+1} lượt xem</span>
              </div>
            </div>
            ${imgHtml}
            <div class="post-detail-body">${UI.esc(post.content)}</div>
            ${post.tags?.length ? `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px">${post.tags.map(t=>`<span class="badge badge-green">#${t}</span>`).join('')}</div>` : ''}
            <div style="display:flex;align-items:center;gap:20px;padding:20px 0;border-top:2px solid var(--gray-light);border-bottom:2px solid var(--gray-light);margin-bottom:32px">
              <button class="btn ${liked ? 'btn-primary' : 'btn-outline'} btn-sm" id="like-btn" onclick="APP.likePost('${post.id}',this,true)">❤️ <span id="like-count">${post.likes.length}</span> Thích</button>
              <span style="font-size:14px;color:#aaa">💬 ${comments.length} bình luận</span>
            </div>
            <div class="comments-section">
              <div class="comments-title">💬 Bình luận (${comments.length})</div>
              ${user ? `
              <div class="comment-form">
                <div class="post-avatar" style="background:${user.color};width:36px;height:36px;font-size:16px;flex-shrink:0">${user.avatar}</div>
                <input class="comment-input" id="comment-input" placeholder="Viết bình luận…" onkeydown="if(event.key==='Enter')APP.submitComment('${post.id}')">
                <button class="btn btn-primary btn-sm" onclick="APP.submitComment('${post.id}')">Gửi</button>
              </div>` : `<p style="font-size:14px;color:#aaa;margin-bottom:20px"><a href="#" onclick="APP.openLoginModal()" style="color:var(--green);font-weight:600">Đăng nhập</a> để bình luận</p>`}
              <div class="comment-list" id="comment-list">${commentsHtml || '<p style="font-size:14px;color:#bbb">Chưa có bình luận nào. Hãy là người đầu tiên! 😊</p>'}</div>
            </div>
          </div>
        </div>
      </div>`;
    window.scrollTo({ top: 0 });
  }

  function likePost(postId, el, isDetailPage) {
    if (!user) { openLoginModal(); return; }
    const count = DB.toggleLike(postId, user.id);
    user = DB.currentUser();
    if (isDetailPage) {
      const btn = document.getElementById('like-btn');
      const cnt = document.getElementById('like-count');
      if (cnt) cnt.textContent = count;
    } else {
      // update inline
      const post = DB.getPostById(postId);
      if (el) { el.textContent = `❤️ ${count}`; el.classList.toggle('liked', post.likes.includes(user.id)); }
    }
  }

  function submitComment(postId) {
    const input = document.getElementById('comment-input');
    const text  = input?.value?.trim();
    if (!text) return;
    if (!user) { openLoginModal(); return; }
    const c = DB.addComment(postId, user.id, text);
    const list = document.getElementById('comment-list');
    const cu = user;
    const html = `
      <div class="comment-item">
        <div class="comment-avatar" style="background:${cu.color}">${cu.avatar}</div>
        <div class="comment-bubble">
          <div class="comment-author">${cu.name}</div>
          <div class="comment-text">${UI.esc(c.text)}</div>
          <div class="comment-time">Vừa xong</div>
        </div>
      </div>`;
    if (list.querySelector('p')) list.innerHTML = '';
    list.insertAdjacentHTML('afterbegin', html);
    input.value = '';
    UI.toast('Đã gửi bình luận! 💬');
  }

  // ── RENDER HOME SECTIONS ─────────────────────────────
  function renderHomeSections() {
    renderHeritage();
    renderPostsSection();
    renderEvents();
  }

  function renderHeritage() {
    const grid = document.getElementById('heritage-grid');
    if (!grid) return;
    grid.innerHTML = UI.HERITAGE.map(h => UI.heritageCardHTML(h)).join('');
    grid.querySelectorAll('.reveal').forEach(el => {
      new IntersectionObserver(([e]) => { if (e.isIntersecting) e.target.classList.add('visible'); }, { threshold: .1 }).observe(el);
    });
  }

  function renderPostsSection() {
    const grid = document.getElementById('posts-grid');
    if (!grid) return;
    const posts = DB.getPosts().slice(0, 6);
    grid.innerHTML = posts.map((p, i) => UI.postCardHTML(p, DB.getUserById(p.authorId), i)).join('');
  }

  function renderEvents() {
    const tl = document.getElementById('timeline');
    if (!tl) return;
    const events = [
      { date:'20/5/2025', icon:'🌿', title:'Chủ nhật xanh – Làm sạch bãi biển Tam Thanh', desc:'Cùng nhau thu gom rác, làm đẹp bãi biển quê hương. Hoạt động thường niên của Đoàn trường Duy Tân.' },
      { date:'25/5/2025', icon:'📸', title:'Thi ảnh "Di sản trong mắt em"', desc:'Cuộc thi ảnh dành cho học sinh toàn trường. Nhiều giải thưởng hấp dẫn chờ đợi bạn.' },
      { date:'01/6/2025', icon:'🌱', title:'Ngày trồng cây – Sân trường xanh mãi', desc:'Trồng 200 cây xanh trong khuôn viên trường nhân ngày Quốc tế Thiếu nhi.' },
      { date:'10/6/2025', icon:'🏆', title:'Cuộc thi video "Bảo vệ môi trường"', desc:'Thi sản xuất video ngắn về bảo vệ môi trường – video hay nhất lên mạng xã hội trường.' },
    ];
    tl.innerHTML = events.map(e => `
      <div class="timeline-item reveal">
        <div class="timeline-dot">${e.icon}</div>
        <div class="timeline-card">
          <div class="event-date">📅 ${e.date}</div>
          <div class="event-title">${e.title}</div>
          <div class="event-desc">${e.desc}</div>
          <button class="btn btn-primary btn-sm" onclick="APP.joinEvent(this)">Tham gia ngay</button>
        </div>
      </div>`).join('');
    tl.querySelectorAll('.reveal').forEach(el => {
      new IntersectionObserver(([ev]) => { if (ev.isIntersecting) el.classList.add('visible'); }, { threshold: .1 }).observe(el);
    });
  }

  function joinEvent(btn) {
    if (!user) { openLoginModal(); return; }
    btn.textContent = '✅ Đã đăng ký!';
    btn.disabled = true;
    btn.classList.remove('btn-primary'); btn.classList.add('btn-outline');
    UI.toast('Đăng ký tham gia thành công! 🎉');
  }

  // ── ALL POSTS PAGE ────────────────────────────────────
  function renderAllPostsPage(wrap, cat) {
    const cats = Object.entries(DB.CATEGORIES);
    const posts = DB.getPostsByCategory(cat || '');
    wrap.innerHTML = `
      <div style="margin-top:var(--header-h);min-height:100vh;background:var(--gray-soft);padding-bottom:80px">
        <div style="background:linear-gradient(135deg,var(--green-dark),var(--blue));padding:60px 48px 40px;color:#fff">
          <div class="container">
            <button class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,.5);margin-bottom:20px" onclick="APP.showPage('home')">← Trang chủ</button>
            <h1 style="font-family:Montserrat,sans-serif;font-weight:900;font-size:36px;margin-bottom:10px">📝 Tất cả bài viết</h1>
            <p style="opacity:.8">${posts.length} bài viết từ học sinh trường Duy Tân</p>
          </div>
        </div>
        <div class="container" style="padding-top:32px">
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px">
            <button class="btn ${!cat?'btn-primary':'btn-outline'} btn-sm" onclick="APP.filterPosts('')">Tất cả</button>
            ${cats.map(([k,v])=>`<button class="btn ${cat===k?'btn-primary':'btn-outline'} btn-sm" onclick="APP.filterPosts('${k}')">${v.icon} ${v.label}</button>`).join('')}
          </div>
          <div id="all-posts-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px">
            ${posts.length ? posts.map((p,i)=>UI.postCardHTML(p,DB.getUserById(p.authorId),i)).join('') : '<p style="color:#aaa;grid-column:1/-1;text-align:center;padding:60px">Chưa có bài viết nào 😊</p>'}
          </div>
        </div>
      </div>`;
  }

  let _curCat = '';
  function filterPosts(cat) {
    _curCat = cat;
    renderAllPostsPage(document.getElementById('virtual-pages'), cat);
  }

  // ── SEARCH PAGE ───────────────────────────────────────
  function renderSearchPage(wrap, q) {
    const query = q || document.getElementById('search-input')?.value?.trim() || '';
    const results = query ? DB.searchPosts(query) : [];
    wrap.innerHTML = `
      <div style="margin-top:var(--header-h);min-height:100vh;background:var(--gray-soft);padding-bottom:80px">
        <div style="background:linear-gradient(135deg,var(--green-dark),var(--blue));padding:60px 48px 40px;color:#fff">
          <div class="container">
            <button class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,.5);margin-bottom:20px" onclick="APP.showPage('home')">← Trang chủ</button>
            <h1 style="font-family:Montserrat,sans-serif;font-weight:900;font-size:32px;margin-bottom:16px">🔍 Tìm kiếm</h1>
            <div style="display:flex;gap:12px;max-width:500px">
              <input id="search-page-input" class="form-input" value="${UI.esc(query)}" placeholder="Tìm kiếm bài viết…" onkeydown="if(event.key==='Enter'){APP.runSearch()}">
              <button class="btn btn-primary" onclick="APP.runSearch()">Tìm</button>
            </div>
          </div>
        </div>
        <div class="container" style="padding-top:32px">
          ${query ? `<p style="color:#777;margin-bottom:24px">Kết quả cho "<b>${UI.esc(query)}</b>": ${results.length} bài viết</p>` : ''}
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px">
            ${results.length ? results.map((p,i)=>UI.postCardHTML(p,DB.getUserById(p.authorId),i)).join('')
              : query ? '<p style="color:#aaa;grid-column:1/-1;text-align:center;padding:60px">Không tìm thấy kết quả nào 😅</p>' : ''}
          </div>
        </div>
      </div>`;
  }

  window.APP_runSearch = function() {};
  function runSearch() {
    const q = document.getElementById('search-page-input')?.value?.trim();
    renderSearchPage(document.getElementById('virtual-pages'), q);
  }

  // ── PROFILE PAGE ─────────────────────────────────────
  function renderProfilePage(wrap) {
    const u = user;
    if (!u) { showPage('home'); openLoginModal(); return; }
    const myPosts = DB.getPosts().filter(p => p.authorId === u.id);
    const totalLikes = myPosts.reduce((s, p) => s + p.likes.length, 0);
    wrap.innerHTML = `
      <div style="min-height:100vh;background:var(--gray-soft);padding-bottom:80px">
        <div class="profile-header">
          <div class="profile-avatar-lg" style="background:${u.color}">${u.avatar}</div>
          <div>
            <div class="profile-name">${u.name}</div>
            <div class="profile-class">Lớp ${u.cls}</div>
            <div class="profile-class" style="margin-top:6px;opacity:.8">${u.bio || 'Chưa có giới thiệu'}</div>
            <div class="profile-stats">
              <div class="profile-stat"><div class="profile-stat-num">${myPosts.length}</div><div class="profile-stat-lbl">Bài viết</div></div>
              <div class="profile-stat"><div class="profile-stat-num">${totalLikes}</div><div class="profile-stat-lbl">Lượt thích</div></div>
              <div class="profile-stat"><div class="profile-stat-num">⭐ ${u.points || 0}</div><div class="profile-stat-lbl">Điểm xanh</div></div>
            </div>
          </div>
          <div style="margin-left:auto;display:flex;flex-direction:column;gap:10px">
            <button class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,.5)" onclick="APP.openEditProfile()">✏️ Chỉnh sửa</button>
            <button class="btn btn-outline btn-sm" style="color:#fff;border-color:rgba(255,255,255,.5)" onclick="APP.openPostModal()">✏️ Đăng bài mới</button>
          </div>
        </div>
        <div class="profile-content">
          <h2 style="font-family:Montserrat,sans-serif;font-weight:900;font-size:22px;color:var(--green-dark);margin-bottom:24px">📝 Bài viết của tôi</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:22px">
            ${myPosts.length ? myPosts.map((p,i)=>UI.postCardHTML(p,u,i)).join('') : '<div style="grid-column:1/-1;text-align:center;padding:60px;color:#bbb"><div style="font-size:48px;margin-bottom:12px">📝</div><p>Bạn chưa có bài viết nào.<br>Hãy chia sẻ câu chuyện của bạn!</p><button class="btn btn-primary" style="margin-top:20px" onclick="APP.openPostModal()">Đăng bài ngay</button></div>'}
          </div>
        </div>
      </div>`;
  }

  function openEditProfile() {
    if (!user) return;
    UI.openModal(`
      <div class="modal-header">
        <div class="modal-title">✏️ Chỉnh sửa hồ sơ</div>
        <button class="modal-close" onclick="UI.closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">Họ và tên</label>
          <input class="form-input" id="ep-name" value="${UI.esc(user.name)}">
        </div>
        <div class="form-group">
          <label class="form-label">Lớp</label>
          <input class="form-input" id="ep-cls" value="${UI.esc(user.cls)}">
        </div>
        <div class="form-group">
          <label class="form-label">Giới thiệu bản thân</label>
          <textarea class="form-textarea" id="ep-bio" rows="3" placeholder="Viết vài dòng về bạn…">${UI.esc(user.bio || '')}</textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-outline btn-sm" onclick="UI.closeModal()">Huỷ</button>
        <button class="btn btn-primary" onclick="APP.saveProfile()">Lưu thay đổi</button>
      </div>`);
  }

  function saveProfile() {
    const name = document.getElementById('ep-name')?.value?.trim();
    const cls  = document.getElementById('ep-cls')?.value?.trim();
    const bio  = document.getElementById('ep-bio')?.value?.trim();
    if (!name) return;
    DB.updateProfile(user.id, { name, cls, bio });
    user = DB.currentUser();
    updateHeaderUser();
    UI.closeModal();
    renderProfilePage(document.getElementById('virtual-pages'));
    UI.toast('Đã cập nhật hồ sơ! ✅');
  }

  // ── RANKING PAGE ─────────────────────────────────────
  function renderRankingPage(wrap) {
    const rankings = DB.getRankings();
    const medals = ['🥇','🥈','🥉'];
    wrap.innerHTML = `
      <div style="margin-top:var(--header-h);min-height:100vh;background:var(--gray-soft);padding-bottom:80px">
        <div style="background:linear-gradient(135deg,#b8900a,#f5c842,#b8900a);padding:60px 48px 40px;color:#333;text-align:center">
          <h1 style="font-family:Montserrat,sans-serif;font-weight:900;font-size:40px;margin-bottom:8px">🏆 Bảng xếp hạng Đại sứ Xanh</h1>
          <p style="font-size:16px;opacity:.75">Những học sinh tích cực nhất trong phong trào bảo vệ môi trường và di sản</p>
        </div>
        <div class="container" style="padding-top:40px">
          <div class="rank-list">
            ${rankings.map((u, i) => `
              <div class="rank-item rank-${i+1}" style="${i<3?'box-shadow:0 4px 20px rgba(0,0,0,.12)':''}">
                <div class="rank-num">${medals[i] || (i+1)}</div>
                <div class="post-avatar" style="background:${u.color};width:44px;height:44px;font-size:20px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center">${u.avatar}</div>
                <div class="rank-info">
                  <div class="rank-name">${u.name}</div>
                  <div class="rank-class">Lớp ${u.cls} · ${u.posts.length} bài viết</div>
                </div>
                <div class="rank-score">⭐ ${u.points || 0}</div>
              </div>`).join('')}
            ${rankings.length === 0 ? '<p style="text-align:center;color:#bbb;padding:60px">Chưa có dữ liệu xếp hạng</p>' : ''}
          </div>
        </div>
      </div>`;
  }

  // ── PUBLIC API ────────────────────────────────────────
  return {
    get user() { return user; },
    init,
    showPage, showPost,
    openLoginModal, doLogin,
    openRegisterModal, doRegister,
    doLogout,
    openPostModal, handleImgUpload, removeImg, submitPost,
    likePost, submitComment,
    joinEvent,
    filterPosts, runSearch,
    openEditProfile, saveProfile,
    renderPostsSection,
  };
})();

// ── Boot ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', APP.init);
