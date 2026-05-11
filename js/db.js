/**
 * db.js – localStorage-based data layer
 * All data persists in the browser across sessions.
 */

const DB = (() => {

  // ── helpers ──────────────────────────────────────────
  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function now() { return new Date().toISOString(); }
  function ago(iso) {
    const s = Math.floor((Date.now() - new Date(iso)) / 1000);
    if (s < 60)   return `${s} giây trước`;
    if (s < 3600) return `${Math.floor(s/60)} phút trước`;
    if (s < 86400) return `${Math.floor(s/3600)} giờ trước`;
    if (s < 86400*30) return `${Math.floor(s/86400)} ngày trước`;
    return new Date(iso).toLocaleDateString('vi');
  }

  // ── SEED default data if first run ───────────────────
  function seedIfNeeded() {
    if (load('dt_seeded', false)) return;
    // Seed demo users
    const users = [
      { id:'u1', name:'Nguyễn Minh Anh', cls:'10A2', email:'minhanh@hs.vn',  password:'123456', avatar:'👧', color:'#4caf7d', bio:'Yêu thiên nhiên và di sản quê hương', posts:[], likes:[], points:320 },
      { id:'u2', name:'Trần Văn Khoa',    cls:'11B1', email:'vankhoa@hs.vn',  password:'123456', avatar:'👦', color:'#4891c5', bio:'Nhiếp ảnh gia nghiệp dư', posts:[], likes:[], points:285 },
      { id:'u3', name:'Lê Thị Hương',     cls:'12C3', email:'thhuong@hs.vn', password:'123456', avatar:'👧', color:'#e0b84a', bio:'Đại sứ xanh trường Duy Tân', posts:[], likes:[], points:410 },
    ];
    save('dt_users', users);

    // Seed demo posts
    const posts = [
      {
        id:'p1', authorId:'u1',
        title:'Em đã cùng lớp làm sạch bãi biển Tam Thanh',
        category:'moi-truong',
        content:`Sáng chủ nhật tuần trước, cả lớp 10A2 chúng em đã háo hức tập hợp lúc 6 giờ sáng tại bãi biển Tam Thanh.\n\nVới bao tay, túi rác và tinh thần nhiệt tình, chúng em chia thành 4 nhóm, mỗi nhóm phụ trách một đoạn bãi biển dài khoảng 200 mét.\n\nSau 3 giờ đồng hồ miệt mài, chúng em đã thu gom được hơn 15 túi rác đầy. Điều khiến em ấn tượng nhất là sự đoàn kết của cả lớp – không ai than mệt, ai cũng cười tươi và làm việc hết mình.\n\nBãi biển sau khi dọn sạch trông đẹp hơn rất nhiều. Em tự hứa với bản thân sẽ tiếp tục tham gia những hoạt động như thế này và không bao giờ vứt rác ra bãi biển.`,
        images:[], tags:['môi trường','biển','Tam Thanh'],
        likes:['u2','u3'], comments:[], createdAt:'2025-05-20T08:30:00Z', views:234,
      },
      {
        id:'p2', authorId:'u2',
        title:'Hội An – Thành phố của ánh đèn lồng và kỷ niệm',
        category:'di-san',
        content:`Lần đầu đến phố cổ Hội An vào buổi tối, em không thể tin vào mắt mình.\n\nHàng nghìn chiếc đèn lồng đủ màu sắc lung linh phản chiếu xuống dòng sông Hoài thơ mộng. Những căn nhà cổ trăm năm tuổi vẫn giữ nguyên vẹn kiến trúc độc đáo pha trộn giữa phong cách Nhật Bản, Trung Hoa và Việt Nam.\n\nEm đã đi bộ suốt 3 tiếng đồng hồ trên những con phố nhỏ lát đá, ngắm nhìn từng góc phố, từng mái nhà và hiểu rằng đây là một di sản quý giá mà chúng ta cần phải gìn giữ.\n\nPhố cổ Hội An không chỉ là di sản của Quảng Nam, của Việt Nam, mà là di sản của cả nhân loại. Mỗi viên gạch, mỗi mái ngói ở đây đều chứa đựng câu chuyện lịch sử hàng trăm năm.`,
        images:[], tags:['Hội An','di sản','UNESCO'],
        likes:['u1'], comments:[], createdAt:'2025-05-18T14:00:00Z', views:198,
      },
      {
        id:'p3', authorId:'u3',
        title:'Dự án "Sân trường xanh" – Khi học sinh biến ước mơ thành hiện thực',
        category:'moi-truong',
        content:`Mọi chuyện bắt đầu từ một tiết học Sinh học tháng 3, khi thầy giáo hỏi: "Các em có muốn làm gì đó thực sự có ý nghĩa cho môi trường không?"\n\nChúng em – lớp 12C3 – đã quyết định biến sân trường thành một không gian xanh thực sự.\n\nSau 2 tháng lên kế hoạch, vận động, và xin tài trợ từ phụ huynh và ban giám hiệu, chúng em đã trồng được 50 cây xanh trong khuôn viên trường: cây xà cừ, cây bóng mát, cây hoa giấy...\n\nHôm nay nhìn lại, những cây nhỏ đã lớn lên từng ngày. Em tin rằng các em học sinh khóa sau sẽ được ngồi học dưới bóng mát của những cây này và biết rằng chúng tôi – lớp 12C3 – đã để lại một thứ gì đó xanh tươi cho trường.`,
        images:[], tags:['sân trường','trồng cây','dự án xanh'],
        likes:['u1','u2'], comments:[], createdAt:'2025-05-15T09:00:00Z', views:312,
      },
    ];
    // Link post ids to users
    users[0].posts.push('p1'); users[1].posts.push('p2'); users[2].posts.push('p3');
    save('dt_posts', posts);
    save('dt_users', users);

    // Seed comments
    const comments = [
      { id:'c1', postId:'p1', authorId:'u2', text:'Thật tuyệt vời! Mình cũng muốn tham gia lần sau!', createdAt:'2025-05-20T10:00:00Z' },
      { id:'c2', postId:'p1', authorId:'u3', text:'Bãi biển Tam Thanh sau khi dọn sạch trông đẹp hơn nhiều nhỉ 🌊', createdAt:'2025-05-20T11:30:00Z' },
      { id:'c3', postId:'p2', authorId:'u1', text:'Mình rất yêu Hội An! Bài viết hay quá bạn ơi ❤️', createdAt:'2025-05-18T16:00:00Z' },
      { id:'c4', postId:'p3', authorId:'u1', text:'Lớp 12C3 thật đáng ngưỡng mộ! Cảm ơn các bạn đã nghĩ đến tương lai 🌱', createdAt:'2025-05-15T12:00:00Z' },
    ];
    save('dt_comments', comments);

    // Seed events
    const events = [
      { id:'e1', date:'20/5/2025', icon:'🌿', title:'Chủ nhật xanh – Làm sạch bãi biển Tam Thanh', desc:'Cùng nhau thu gom rác, làm đẹp bãi biển quê hương. Hoạt động thường niên của Đoàn trường Duy Tân.' },
      { id:'e2', date:'25/5/2025', icon:'📸', title:'Thi ảnh "Di sản trong mắt em"', desc:'Cuộc thi ảnh dành cho học sinh toàn trường về các di sản văn hóa và thiên nhiên Quảng Nam.' },
      { id:'e3', date:'01/6/2025', icon:'🌱', title:'Ngày trồng cây – Sân trường xanh mãi', desc:'Trồng 200 cây xanh trong khuôn viên trường nhân ngày Quốc tế Thiếu nhi 01/6.' },
      { id:'e4', date:'10/6/2025', icon:'🏆', title:'Cuộc thi video "Bảo vệ môi trường"', desc:'Thi sản xuất video ngắn về bảo vệ môi trường. Video xuất sắc sẽ được phát trên mạng xã hội trường.' },
    ];
    save('dt_events', events);

    save('dt_seeded', true);
  }

  // ── AUTH ──────────────────────────────────────────────
  function getUsers() { return load('dt_users', []); }
  function saveUsers(u) { save('dt_users', u); }

  function register({ name, cls, email, password }) {
    const users = getUsers();
    if (users.find(u => u.email === email)) return { ok: false, msg: 'Email đã được sử dụng!' };
    const avatars = ['😊','🌟','🌿','🎓','🦋','🌸','⭐','🍀'];
    const colors  = ['#4caf7d','#4891c5','#e0b84a','#c56b9e','#7b67d4','#e05e55','#4bbfc5','#82c83e'];
    const idx = users.length % avatars.length;
    const user = {
      id: uid(), name, cls, email, password,
      avatar: avatars[idx], color: colors[idx],
      bio: '', posts: [], likes: [], points: 0,
      createdAt: now(),
    };
    users.push(user);
    saveUsers(users);
    return { ok: true, user };
  }

  function login(email, password) {
    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) return { ok: false, msg: 'Email hoặc mật khẩu không đúng!' };
    save('dt_session', user.id);
    return { ok: true, user };
  }

  function logout() { localStorage.removeItem('dt_session'); }

  function currentUser() {
    const id = load('dt_session', null);
    if (!id) return null;
    return getUsers().find(u => u.id === id) || null;
  }

  function updateProfile(id, updates) {
    const users = getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx < 0) return;
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
  }

  function getUserById(id) { return getUsers().find(u => u.id === id) || null; }

  // ── POSTS ─────────────────────────────────────────────
  function getPosts() { return load('dt_posts', []); }
  function savePosts(p) { save('dt_posts', p); }

  function createPost({ authorId, title, category, content, images, tags }) {
    const posts = getPosts();
    const post = {
      id: uid(), authorId, title, category,
      content, images: images || [], tags: tags || [],
      likes: [], comments: [], views: 0, createdAt: now(),
    };
    posts.unshift(post);
    savePosts(posts);
    // Update user posts list & points
    const users = getUsers();
    const uIdx = users.findIndex(u => u.id === authorId);
    if (uIdx >= 0) {
      users[uIdx].posts.push(post.id);
      users[uIdx].points += 10;
      saveUsers(users);
    }
    return post;
  }

  function getPostById(id) { return getPosts().find(p => p.id === id) || null; }

  function incrementView(id) {
    const posts = getPosts();
    const p = posts.find(x => x.id === id);
    if (p) { p.views = (p.views || 0) + 1; savePosts(posts); }
  }

  function toggleLike(postId, userId) {
    const posts = getPosts();
    const p = posts.find(x => x.id === postId);
    if (!p) return;
    const idx = p.likes.indexOf(userId);
    if (idx >= 0) { p.likes.splice(idx, 1); }
    else {
      p.likes.push(userId);
      // Give points to author
      const users = getUsers();
      const au = users.find(u => u.id === p.authorId);
      if (au) { au.points += 1; saveUsers(users); }
    }
    savePosts(posts);
    return p.likes.length;
  }

  function getPostsByCategory(cat) {
    const posts = getPosts();
    return cat ? posts.filter(p => p.category === cat) : posts;
  }

  function searchPosts(q) {
    const lower = q.toLowerCase();
    return getPosts().filter(p =>
      p.title.toLowerCase().includes(lower) ||
      p.content.toLowerCase().includes(lower) ||
      (p.tags || []).some(t => t.toLowerCase().includes(lower))
    );
  }

  // ── COMMENTS ─────────────────────────────────────────
  function getComments() { return load('dt_comments', []); }
  function saveComments(c) { save('dt_comments', c); }

  function addComment(postId, authorId, text) {
    const comments = getComments();
    const c = { id: uid(), postId, authorId, text, createdAt: now() };
    comments.push(c);
    saveComments(comments);
    // Update post comment count
    const posts = getPosts();
    const p = posts.find(x => x.id === postId);
    if (p) { if (!p.comments) p.comments = []; p.comments.push(c.id); savePosts(posts); }
    // Points
    const users = getUsers();
    const u = users.find(x => x.id === authorId);
    if (u) { u.points += 2; saveUsers(users); }
    return c;
  }

  function getCommentsByPost(postId) {
    return getComments().filter(c => c.postId === postId);
  }

  // ── STATS (dynamic) ───────────────────────────────────
  function getStats() {
    const posts = getPosts();
    const users = getUsers();
    const comments = getComments();
    const totalLikes = posts.reduce((s, p) => s + (p.likes || []).length, 0);
    return {
      posts: posts.length,
      users: users.length,
      likes: totalLikes,
      comments: comments.length,
    };
  }

  // ── RANKINGS ─────────────────────────────────────────
  function getRankings() {
    return [...getUsers()].sort((a, b) => (b.points || 0) - (a.points || 0));
  }

  // ── UTILS ─────────────────────────────────────────────
  const CATEGORIES = {
    'di-san':    { label: 'Di sản quê em', icon: '🏛️', color: '#e8d5a3' },
    'moi-truong':{ label: 'Môi trường xanh', icon: '🌿', color: '#b8e6cb' },
    'kien-thuc': { label: 'Góc kiến thức',   icon: '💡', color: '#c5dff5' },
    'hoat-dong': { label: 'Hoạt động',        icon: '🎯', color: '#f5d0d0' },
    'khac':      { label: 'Khác',             icon: '📝', color: '#e0d0f5' },
  };

  return {
    init: seedIfNeeded,
    uid, now, ago,
    // auth
    register, login, logout, currentUser, updateProfile, getUserById,
    // posts
    createPost, getPosts, getPostById, getPostsByCategory, searchPosts,
    toggleLike, incrementView,
    // comments
    addComment, getCommentsByPost,
    // stats / rankings
    getStats, getRankings,
    CATEGORIES,
  };
})();
