// ===== BLOCK BLAST GAME ENGINE =====

// ===== STATE =====
let currentLang = 'ar';
let currentUser = null;
let audioCtx = null;
let ambientAudioUnlocked = false;

let gameState = {
  board: [],
  pieces: [],
  selectedPiece: null,
  score: 0,
  level: 1,
  combo: 0,
  gamePaused: false
};

let memoryState = {
  cards: [],
  flipped: [],
  matchedPairs: 0,
  moves: 0,
  locked: false,
  level: 1,
  pairCount: 8
};

const BOARD_SIZE = 8;
const MEMORY_LEVELS = [
  { id: 1, name: { ar: 'مبتدئ ✨', en: 'Beginner' }, pairs: 4, cols: 4, diff: 1 },
  { id: 2, name: { ar: 'سهل 🌱', en: 'Easy' }, pairs: 6, cols: 4, diff: 1 },
  { id: 3, name: { ar: 'متوسط ⚡', en: 'Medium' }, pairs: 8, cols: 4, diff: 2 },
  { id: 4, name: { ar: 'متقدم 🔥', en: 'Advanced' }, pairs: 10, cols: 5, diff: 2 },
  { id: 5, name: { ar: 'صعب 💎', en: 'Hard' }, pairs: 12, cols: 6, diff: 3 },
  { id: 6, name: { ar: 'احترافي 🏆', en: 'Pro' }, pairs: 15, cols: 6, diff: 3 },
  { id: 7, name: { ar: 'أسطوري 🐉', en: 'Legendary' }, pairs: 18, cols: 6, diff: 3 },
  { id: 8, name: { ar: 'مستحيل 🛸', en: 'Impossible' }, pairs: 24, cols: 8, diff: 3 },
];
const LEVEL_THEMES = [
  { ar: 'مجرة البداية', en: 'Starter Galaxy', chip: 'Nova', colors: ['#62d5ff', '#7f5cff', '#ffcf5a'] },
  { ar: 'شهب ذهبية', en: 'Meteor Gold', chip: 'Solar', colors: ['#ffb347', '#ff7a59', '#ffe76a'] },
  { ar: 'ضباب زمردي', en: 'Emerald Mist', chip: 'Mist', colors: ['#47f5a0', '#00d2ff', '#8dff73'] },
  { ar: 'نيون ليلي', en: 'Midnight Neon', chip: 'Neon', colors: ['#7b61ff', '#ff63b8', '#6ac3ff'] },
  { ar: 'لهيب النجوم', en: 'Starfire', chip: 'Blaze', colors: ['#ff6d6d', '#ff9f43', '#ffd166'] },
  { ar: 'بحر كوني', en: 'Cosmic Tide', chip: 'Tide', colors: ['#00d2ff', '#1e90ff', '#7a7cff'] },
  { ar: 'أورورا أسطورية', en: 'Legend Aurora', chip: 'Aura', colors: ['#8cff6a', '#00ffa3', '#66c7ff'] },
  { ar: 'عاصفة ليلية', en: 'Night Storm', chip: 'Storm', colors: ['#6f7bff', '#00bfff', '#d46bff'] },
  { ar: 'جحيم الكواكب', en: 'Inferno Orbit', chip: 'Inferno', colors: ['#ff5c5c', '#ff7a00', '#ffd166'] },
  { ar: 'تاج المجرة', en: 'Galaxy Crown', chip: 'Crown', colors: ['#ffd700', '#ff67c4', '#6ae3ff'] },
  { ar: 'غزو الشفق', en: 'Aurora Raid', chip: 'Raid', colors: ['#66ffb3', '#7f5cff', '#ffaf45'] },
  { ar: 'أسطورة النجم', en: 'Star Legend', chip: 'Legend', colors: ['#ffffff', '#ffe76a', '#89c8ff'] },
];

// ===== LEVEL CONFIG =====
const LEVELS = [
  { id: 1, name: { ar: 'المبتدئ', en: 'Beginner' }, target: 300, diff: 1, boardExtra: 0 },
  { id: 2, name: { ar: 'سهل', en: 'Easy' }, target: 600, diff: 1, boardExtra: 1 },
  { id: 3, name: { ar: 'عادي', en: 'Normal' }, target: 900, diff: 1, boardExtra: 2 },
  { id: 4, name: { ar: 'متوسط', en: 'Medium' }, target: 1400, diff: 2, boardExtra: 3 },
  { id: 5, name: { ar: 'صعب', en: 'Hard' }, target: 2000, diff: 2, boardExtra: 5 },
  { id: 6, name: { ar: 'خبير', en: 'Expert' }, target: 3000, diff: 2, boardExtra: 7 },
  { id: 7, name: { ar: 'أسطوري', en: 'Legendary' }, target: 4500, diff: 3, boardExtra: 10 },
  { id: 8, name: { ar: 'عاصفة', en: 'Storm' }, target: 6000, diff: 3, boardExtra: 12 },
  { id: 9, name: { ar: 'نار', en: 'Inferno' }, target: 8000, diff: 3, boardExtra: 15 },
  { id: 10, name: { ar: 'الملك', en: 'King' }, target: 12000, diff: 3, boardExtra: 20 },
  { id: 11, name: { ar: 'غزو', en: 'Invasion' }, target: 15000, diff: 3, boardExtra: 25 },
  { id: 12, name: { ar: 'الأسطورة', en: 'Legend' }, target: 20000, diff: 3, boardExtra: 30 },
];

// ===== PIECES DEFINITIONS =====
const PIECE_SHAPES = [
  // Single
  [[1]],
  // Dominos
  [[1,1]],
  [[1],[1]],
  // Trominoes
  [[1,1,1]],
  [[1],[1],[1]],
  [[1,1],[1,0]],
  [[1,1],[0,1]],
  [[1,0],[1,1]],
  [[0,1],[1,1]],
  // Tetrominos
  [[1,1,1,1]],
  [[1],[1],[1],[1]],
  [[1,1],[1,1]],
  [[1,1,1],[1,0,0]],
  [[1,1,1],[0,0,1]],
  [[1,0,0],[1,1,1]],
  [[0,0,1],[1,1,1]],
  [[0,1,0],[1,1,1]],
  [[1,1,0],[0,1,1]],
  [[0,1,1],[1,1,0]],
  [[1,0],[1,1],[0,1]],
  [[0,1],[1,1],[1,0]],
  // Pentominos
  [[1,1,1,1,1]],
  [[1],[1],[1],[1],[1]],
  [[1,1,1],[1,0,0],[1,0,0]],
  [[1,1,1],[0,0,1],[0,0,1]],
  [[1,0,0],[1,1,1],[0,0,1]],
];

const COLORS = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6', 'color-7'];

// ===== ACHIEVEMENTS =====
const ACHIEVEMENTS_DEF = [
  { id: 'first_win', icon: '🏆', name: { ar: 'أول فوز', en: 'First Win' }, desc: { ar: 'افوز لأول مرة', en: 'Win your first game' } },
  { id: 'score_1000', icon: '⭐', name: { ar: 'ألف نقطة', en: '1000 Points' }, desc: { ar: '1000+ نقطة', en: 'Score 1000+' } },
  { id: 'score_5000', icon: '💫', name: { ar: 'خمسة آلاف', en: '5000 Points' }, desc: { ar: '5000+ نقطة', en: 'Score 5000+' } },
  { id: 'win_5', icon: '🌟', name: { ar: 'خبير', en: 'Expert' }, desc: { ar: 'افوز 5 مرات', en: 'Win 5 times' } },
  { id: 'level_5', icon: '🎯', name: { ar: 'وصل للمستوى 5', en: 'Reach Level 5' }, desc: { ar: 'العب حتى المستوى 5', en: 'Play until level 5' } },
  { id: 'combo_3', icon: '🔥', name: { ar: 'سلسلة × 3', en: 'Combo x3' }, desc: { ar: 'سلسلة 3 مرات متتالية', en: '3-combo in a row' } },
  { id: 'perfect', icon: '💎', name: { ar: 'مثالي', en: 'Perfect' }, desc: { ar: 'امسح الكل دفعة واحدة', en: 'Clear entire board' } },
  { id: 'speed_demon', icon: '⚡', name: { ar: 'سريع جداً', en: 'Speed Demon' }, desc: { ar: 'افوز خلال دقيقة', en: 'Win within a minute' } },
  { id: 'explorer', icon: '🗺️', name: { ar: 'مستكشف', en: 'Explorer' }, desc: { ar: 'العب 10 مباريات', en: 'Play 10 games' } },
];

// ===== LOCALIZATION =====
const T = {
  ar: {
    levelComplete: 'مرحى! أكملت المستوى! 🎉',
    levelFail: 'حاول مجدداً! 💪',
    pieceSelected: 'اضغط على الخلية لوضع البلوك',
    noFit: 'لا يمكن وضعه هنا!',
    comboMsg: (n) => `سلسلة × ${n}! 🔥`,
    scoreLabel: 'النقاط:',
    newRecord: '🎊 رقم قياسي جديد!',
    userExists: 'اسم المستخدم موجود مسبقاً',
    wrongPass: 'كلمة السر خاطئة',
    userNotFound: 'المستخدم غير موجود',
    fillFields: 'يرجى ملء جميع الحقول',
    achUnlocked: (name) => `🏅 إنجاز جديد: ${name}`,
    guestMode: 'وضع الضيف',
  },
  en: {
    levelComplete: 'Amazing! Level Complete! 🎉',
    levelFail: 'Try Again! 💪',
    pieceSelected: 'Tap a cell to place the block',
    noFit: "Can't place it here!",
    comboMsg: (n) => `Combo × ${n}! 🔥`,
    scoreLabel: 'Score:',
    newRecord: '🎊 New Record!',
    userExists: 'Username already taken',
    wrongPass: 'Wrong password',
    userNotFound: 'User not found',
    fillFields: 'Please fill all fields',
    achUnlocked: (name) => `🏅 Achievement: ${name}`,
    guestMode: 'Guest Mode',
  }
};
const t = (key, ...args) => {
  const val = T[currentLang][key];
  return typeof val === 'function' ? val(...args) : val;
};

// ===== LANGUAGE =====
function menuSettingsToggleLang() {
  toggleLang();
}

function menuSettingsToggleMusic() {
  const music = document.getElementById('music-player');
  if (!music) return;

  music.classList.remove('start-settings-music');
  music.style.display = '';

  const panel = document.getElementById('music-panel');
  const panelHidden = panel ? panel.classList.contains('hidden') : true;

  if (panelHidden) {
    if (!musicPanelOpen) toggleMusicPanel();
  } else if (musicPanelOpen) {
    toggleMusicPanel();
  }
}
function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-text').textContent = currentLang === 'ar' ? 'EN' : 'AR';
  updateLangDOM();
  syncDynamicLocalizedUI();
}
function updateLangDOM() {
  document.querySelectorAll('[data-ar]').forEach(el => {
    if (el.tagName !== 'INPUT') {
      el.textContent = el.dataset[currentLang] || el.textContent;
    }
  });
  document.querySelectorAll('[data-ph-ar]').forEach(el => {
    el.placeholder = el.dataset[`ph${currentLang.charAt(0).toUpperCase()+currentLang.slice(1)}`] || el.placeholder;
  });
}

// ===== STORAGE HELPERS =====
function getUsers() { return JSON.parse(localStorage.getItem('bb_users') || '{}'); }
function saveUsers(u) { localStorage.setItem('bb_users', JSON.stringify(u)); }
function getUser(name) { return getUsers()[name]; }
function saveUser(data) {
  const users = getUsers();
  users[data.username] = data;
  saveUsers(users);
}
function defaultUser(username) {
  return {
    username,
    avatar: '🎮', highScore: 0, totalWins: 0, totalGames: 0,
    bestStreak: 0, unlockedLevels: [1], completedLevels: [], memoryUnlockedLevels: [1],
    levelStars: {}, achievements: [], gameHistory: [], memoryBestMoves: null, avatarImage: '', coverImage: '', createdAt: Date.now()
  };
}

// ===== SETUP / PROFILE MANAGEMENT =====

// Selected avatar during setup
let setupAvatar = '🎮';
let editAvatar  = '🎮';
let editAvatarImage = '';

function pickAvatar(el, emoji) {
  setupAvatar = emoji;
  document.querySelectorAll('.setup-avatars .setup-av').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  renderAvatarNode(document.getElementById('setup-av-preview'), { avatar: emoji, avatarImage: '' });
  playSound('click');
}

function validateSetupName() {
  const val = document.getElementById('setup-name').value.trim();
  document.getElementById('setup-go-btn').disabled = val.length < 2;
}

function createProfile() {
  const name = document.getElementById('setup-name').value.trim();
  if (name.length < 2) return;
  const user = defaultUser(name);
  user.avatar = setupAvatar;
  saveUser(user);
  // Save "active user" key so next visit skips setup
  localStorage.setItem('bb_active_user', name);
  currentUser = user;
  playSound('start');
  showMenu();
}

// ---- Edit name / avatar from menu ----
function showEditName() {
  editAvatar = currentUser.avatar || '🎮';
  editAvatarImage = currentUser.avatarImage || '';
  renderAvatarNode(document.getElementById('edit-av-preview'), { avatar: editAvatar, avatarImage: editAvatarImage });
  document.getElementById('edit-name-input').value = currentUser.username;
  // mark current avatar
  document.querySelectorAll('#edit-avatars .setup-av').forEach(el => {
    el.classList.toggle('selected', el.textContent === editAvatar);
  });
  document.getElementById('editname-modal').classList.remove('hidden');
}

function pickEditAvatar(el, emoji) {
  editAvatar = emoji;
  editAvatarImage = '';
  document.querySelectorAll('#edit-avatars .setup-av').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  renderAvatarNode(document.getElementById('edit-av-preview'), { avatar: emoji, avatarImage: '' });
  playSound('click');
}

function validateEditName() {
  const val = document.getElementById('edit-name-input').value.trim();
  document.getElementById('edit-save-btn').disabled = val.length < 2;
}

function saveEditName() {
  const newName = document.getElementById('edit-name-input').value.trim();
  if (newName.length < 2) return;

  // If name changed, remove old key and create new
  if (newName !== currentUser.username) {
    const users = getUsers();
    delete users[currentUser.username];
    saveUsers(users);
    currentUser.username = newName;
  }
  currentUser.avatar = editAvatar;
  currentUser.avatarImage = editAvatarImage;
  saveUser(currentUser);
  localStorage.setItem('bb_active_user', currentUser.username);

  closeEditName();
  showMenu();
  showToast(currentLang === 'ar' ? '✅ تم الحفظ!' : '✅ Saved!');
}

function closeEditName() {
  document.getElementById('editname-modal').classList.add('hidden');
}

function triggerAvatarUpload() {
  document.getElementById('avatar-upload-input').click();
}

function triggerCoverUpload() {
  document.getElementById('cover-upload-input').click();
}

function handleAvatarUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  readImageFile(file, (dataUrl) => {
    if (!currentUser) return;
    editAvatarImage = dataUrl;
    currentUser.avatarImage = dataUrl;
    renderAvatarNode(document.getElementById('profile-avatar'), currentUser);
    renderAvatarNode(document.getElementById('menu-avatar'), currentUser);
    renderAvatarNode(document.getElementById('edit-av-preview'), { avatar: editAvatar || currentUser.avatar, avatarImage: editAvatarImage });
    saveUser(currentUser);
    showToast(currentLang === 'ar' ? '🖼️ تم تجهيز صورتك الشخصية' : '🖼️ Your profile image is ready');
  });
  event.target.value = '';
}

function handleCoverUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  readImageFile(file, (dataUrl) => {
    if (!currentUser) return;
    currentUser.coverImage = dataUrl;
    applyCoverImage(document.getElementById('profile-cover'), currentUser.coverImage);
    saveUser(currentUser);
    showToast(currentLang === 'ar' ? '🌌 تم تحديث الغلاف' : '🌌 Cover updated');
  });
  event.target.value = '';
}

function readImageFile(file, onLoad) {
  if (!file.type.startsWith('image/')) {
    showToast(currentLang === 'ar' ? 'اختر صورة صحيحة' : 'Choose a valid image');
    return;
  }
  const reader = new FileReader();
  reader.onload = () => onLoad(reader.result);
  reader.readAsDataURL(file);
}

// ---- Load or setup on boot ----
function loadOrSetup() {
  const savedName = localStorage.getItem('bb_active_user');
  if (savedName) {
    const user = getUser(savedName);
    if (user) {
      currentUser = user;
      showMenu();
      return;
    }
  }
  // First time — show setup screen
  showScreen('setup-screen');
}

// Keep logout stub so nothing breaks
function logout() { loadOrSetup(); }

// ===== NAVIGATION =====
function closeStartSettingsMenu() {
  const menu = document.getElementById('start-settings-menu');
  if (menu) menu.classList.remove('open');
}

function toggleStartSettingsMenu() {
  const menu = document.getElementById('start-settings-menu');
  if (!menu) return;
  menu.classList.toggle('open');
}

function openStartMusicSettings() {
  const music = document.getElementById('music-player');
  if (music) {
    music.classList.add('start-settings-music');
    music.style.display = '';
  }
  closeStartSettingsMenu();
  if (!musicPanelOpen) toggleMusicPanel();
}

function setupStartSettingsEvents() {
  document.addEventListener('click', (event) => {
    const wrap = document.getElementById('start-settings-wrap');
    if (!wrap) return;
    if (!wrap.contains(event.target)) closeStartSettingsMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeStartSettingsMenu();
  });
}

function updateFloatingUiForScreen(screenId) {
  const music = document.getElementById('music-player');
  const lang = document.getElementById('lang-btn');
  const quick = document.getElementById('start-settings-wrap');
  const isStartScreen = screenId === 'setup-screen';

  if (lang) lang.style.display = 'none';
  if (quick) quick.style.display = isStartScreen ? '' : 'none';

  if (music) {
    if (!isStartScreen) {
      music.classList.remove('start-settings-music');
      music.style.display = 'none';
      if (musicPanelOpen) toggleMusicPanel();
    } else if (musicPanelOpen) {
      music.classList.add('start-settings-music');
      music.style.display = '';
    } else {
      music.classList.remove('start-settings-music');
      music.style.display = 'none';
    }
  }

  if (!isStartScreen) closeStartSettingsMenu();
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const screen = document.getElementById(id);
  screen.style.display = 'flex';
  updateFloatingUiForScreen(id);
  requestAnimationFrame(() => screen.classList.add('active'));
}
function showMenu() {
  closeModals();
  if (currentUser && !currentUser.isGuest) saveUser(currentUser);
  document.getElementById('menu-username').textContent = currentUser?.username || 'لاعب';
  renderAvatarNode(document.getElementById('menu-avatar'), currentUser);
  document.getElementById('menu-score').textContent = currentUser?.highScore || 0;
  showScreen('menu-screen');
}

function syncDynamicLocalizedUI() {
  if (gameState.levelConfig) applyLevelTheme(gameState.level);
  if (document.getElementById('memory-levels-grid')) renderMemoryLevels();
}
function showGamesHub() {
  showScreen('games-screen');
}
function showLevelSelect() {
  renderLevels();
  showScreen('level-screen');
}
function showProfile() {
  renderProfile();
  showScreen('profile-screen');
}
function showLeaderboard() {
  renderLeaderboard();
  showScreen('leaderboard-screen');
}
function showMemoryLevels() {
  renderMemoryLevels();
  showScreen('memory-level-screen');
}

// ===== LEVELS =====
function renderLevels() {
  const grid = document.getElementById('levels-grid');
  grid.innerHTML = '';
  const unlocked = currentUser?.unlockedLevels || [1];
  const completed = currentUser?.completedLevels || [];
  const stars = currentUser?.levelStars || {};

  LEVELS.forEach(lv => {
    const isUnlocked = unlocked.includes(lv.id);
    const isCompleted = completed.includes(lv.id);
    const lvStars = stars[lv.id] || 0;

    const card = document.createElement('div');
    card.className = `level-card${!isUnlocked ? ' locked' : ''}${isCompleted ? ' completed' : ''}`;
    card.dataset.diff = lv.diff;
    const theme = LEVEL_THEMES[(lv.id - 1) % LEVEL_THEMES.length];
    card.innerHTML = `
      <div class="level-num">${lv.id}</div>
      <div class="level-name">${lv.name[currentLang]}</div>
      <div class="level-theme">${theme[currentLang]}</div>
      <div class="level-stars">${'⭐'.repeat(lvStars)}${'☆'.repeat(3 - lvStars)}</div>
      <div class="level-target">${currentLang === 'ar' ? 'الهدف:' : 'Target:'} ${lv.target}</div>
      ${!isUnlocked ? '<div style="font-size:20px;margin-top:4px">🔒</div>' : ''}
    `;
    if (isUnlocked) card.onclick = () => startGame(lv.id);
    grid.appendChild(card);
  });
}

// ===== GAME START =====
function startGame(levelId) {
  const lv = LEVELS.find(l => l.id === levelId);
  if (!lv) return;
  applyLevelTheme(levelId);

  gameState = {
    board: Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)),
    pieces: [],
    selectedPiece: null,
    score: 0,
    level: levelId,
    levelConfig: lv,
    combo: 0,
    gamePaused: false,
    startTime: Date.now()
  };

  // Pre-fill some cells for higher levels
  if (lv.boardExtra > 0) prefillBoard(lv.boardExtra);

  renderBoard();
  generatePieces();
  updateScoreDisplay();

  document.getElementById('curr-level').textContent = levelId;
  document.getElementById('target-score').textContent = lv.target;
  updateLevelProgress();

  showScreen('game-screen');
  playSound('start');
}

function applyLevelTheme(levelId) {
  const theme = LEVEL_THEMES[(levelId - 1) % LEVEL_THEMES.length];
  const gameScreen = document.getElementById('game-screen');
  gameScreen.style.setProperty('--level-primary', theme.colors[0]);
  gameScreen.style.setProperty('--level-secondary', theme.colors[1]);
  gameScreen.style.setProperty('--level-accent', theme.colors[2]);
  document.getElementById('level-theme-name').textContent = theme[currentLang];
  document.getElementById('level-theme-chip').textContent = theme.chip;
}

function prefillBoard(count) {
  let placed = 0;
  while (placed < count) {
    const r = Math.floor(Math.random() * BOARD_SIZE);
    const c = Math.floor(Math.random() * BOARD_SIZE);
    if (!gameState.board[r][c]) {
      gameState.board[r][c] = COLORS[Math.floor(Math.random() * COLORS.length)];
      placed++;
    }
  }
}

// ===== BOARD RENDERING =====
function renderBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  board.onmouseleave = () => clearHighlight();
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if (gameState.board[r][c]) {
        cell.classList.add('filled', gameState.board[r][c]);
      }
      cell.dataset.r = r;
      cell.dataset.c = c;
      cell.onclick = () => handleCellClick(r, c);
      cell.onmouseenter = () => handleCellHover(r, c);
      board.appendChild(cell);
    }
  }
}

function getCell(r, c) {
  return document.querySelector(`#game-board .cell[data-r="${r}"][data-c="${c}"]`);
}

// ===== PIECE GENERATION =====
function generatePieces() {
  gameState.pieces = [];
  for (let i = 0; i < 3; i++) {
    const shape = PIECE_SHAPES[Math.floor(Math.random() * PIECE_SHAPES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    gameState.pieces.push({ shape, color, used: false });
  }
  renderPieces();
}

function renderPieces() {
  const container = document.getElementById('pieces-container');
  container.innerHTML = '';
  gameState.pieces.forEach((piece, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = `piece-wrapper${piece.used ? ' used' : ''}${gameState.selectedPiece === idx ? ' selected' : ''}`;
    wrapper.onclick = () => selectPiece(idx);

    const rows = piece.shape.length;
    const cols = piece.shape[0].length;
    const grid = document.createElement('div');
    grid.className = 'piece-grid';
    grid.style.gridTemplateColumns = `repeat(${cols}, 18px)`;

    piece.shape.forEach(row => {
      row.forEach(cell => {
        const c = document.createElement('div');
        c.className = `piece-cell${cell ? ' ' + piece.color : ' empty'}`;
        grid.appendChild(c);
      });
    });
    wrapper.appendChild(grid);
    container.appendChild(wrapper);
  });
}

function selectPiece(idx) {
  if (gameState.pieces[idx].used) return;
  gameState.selectedPiece = gameState.selectedPiece === idx ? null : idx;
  renderPieces();
  clearHighlight();
  playSound('click');
}

// ===== PLACEMENT =====
function handleCellHover(r, c) {
  clearHighlight();
  if (gameState.selectedPiece === null) return;
  const piece = gameState.pieces[gameState.selectedPiece];
  if (!piece || piece.used) return;
  if (canPlace(piece.shape, r, c)) highlightPlacement(piece.shape, r, c, true);
  else highlightPlacement(piece.shape, r, c, false);
}

function handleCellClick(r, c) {
  if (gameState.gamePaused) return;
  if (gameState.selectedPiece === null) { showToast(t('pieceSelected')); return; }
  const piece = gameState.pieces[gameState.selectedPiece];
  if (!piece || piece.used) return;

  if (!canPlace(piece.shape, r, c)) {
    playSound('error');
    shakeBoard();
    return;
  }
  placePiece(piece.shape, piece.color, r, c);
  piece.used = true;
  gameState.selectedPiece = null;
  clearHighlight();

  setTimeout(() => {
    checkLines();
    renderPieces();
    updateScoreDisplay();
    checkWinLose();

    // If all pieces used, generate new
    if (gameState.pieces.every(p => p.used)) {
      setTimeout(() => generatePieces(), 300);
    }
  }, 200);
}

function canPlace(shape, startR, startC) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const br = startR + r, bc = startC + c;
      if (br < 0 || br >= BOARD_SIZE || bc < 0 || bc >= BOARD_SIZE) return false;
      if (gameState.board[br][bc]) return false;
    }
  }
  return true;
}

function placePiece(shape, color, startR, startC) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const br = startR + r, bc = startC + c;
      gameState.board[br][bc] = color;
      const cell = getCell(br, bc);
      if (cell) {
        cell.className = `cell filled ${color} placed`;
        setTimeout(() => cell.classList.remove('placed'), 300);
      }
    }
  }
  playSound('place');
}

function highlightPlacement(shape, startR, startC, valid) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const br = startR + r, bc = startC + c;
      if (br < 0 || br >= BOARD_SIZE || bc < 0 || bc >= BOARD_SIZE) continue;
      const cell = getCell(br, bc);
      if (cell && !gameState.board[br][bc]) {
        cell.classList.add('highlight');
        cell.style.background = valid ? 'rgba(46,213,115,0.4)' : 'rgba(255,71,87,0.3)';
      }
    }
  }
}

function clearHighlight() {
  document.querySelectorAll('#game-board .cell.highlight').forEach(c => {
    c.classList.remove('highlight');
    c.style.background = '';
  });
}

// ===== LINE CLEARING =====
function checkLines() {
  const board = gameState.board;
  const toClear = new Set();
  let linesCleared = 0;

  // Check rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every(c => c !== null)) {
      for (let c = 0; c < BOARD_SIZE; c++) toClear.add(`${r},${c}`);
      linesCleared++;
    }
  }
  // Check cols
  for (let c = 0; c < BOARD_SIZE; c++) {
    if (board.every(row => row[c] !== null)) {
      for (let r = 0; r < BOARD_SIZE; r++) toClear.add(`${r},${c}`);
      linesCleared++;
    }
  }

  if (toClear.size === 0) {
    gameState.combo = 0;
    return;
  }

  gameState.combo++;
  const comboMult = Math.min(gameState.combo, 5);
  const baseScore = linesCleared * 100;
  const bonus = toClear.size * 10;
  const total = (baseScore + bonus) * comboMult;
  gameState.score += total;

  // Animate clearing
  toClear.forEach(key => {
    const [r, c] = key.split(',').map(Number);
    const cell = getCell(r, c);
    if (cell) cell.classList.add('clearing');
  });

  // Show combo
  if (gameState.combo >= 2) {
    const cd = document.getElementById('combo-display');
    cd.textContent = t('comboMsg', gameState.combo);
    cd.classList.add('show');
    setTimeout(() => cd.classList.remove('show'), 1500);
    checkAchievement('combo_3', gameState.combo >= 3);
  }

  // Show score float
  showScoreFloat(total, linesCleared);

  setTimeout(() => {
    toClear.forEach(key => {
      const [r, c] = key.split(',').map(Number);
      board[r][c] = null;
      const cell = getCell(r, c);
      if (cell) {
        cell.className = 'cell';
        cell.style.background = '';
      }
    });

    // Check perfect board
    const allEmpty = board.every(row => row.every(c => c === null));
    if (allEmpty) {
      gameState.score += 1000;
      showToast('💎 مسح كامل! +1000');
      checkAchievement('perfect', true);
      playSound('perfect');
    } else {
      playSound('clear');
    }
    updateScoreDisplay();
    checkWinLose();
  }, 400);
}

function showScoreFloat(score, lines) {
  const boardEl = document.getElementById('game-board');
  const float = document.createElement('div');
  float.className = 'score-float';
  float.textContent = `+${score}`;
  float.style.left = Math.random() * 60 + 20 + '%';
  float.style.top = Math.random() * 60 + 20 + '%';
  boardEl.appendChild(float);
  setTimeout(() => float.remove(), 1000);
}

function updateScoreDisplay() {
  document.getElementById('curr-score').textContent = gameState.score;
  updateLevelProgress();
  // Auto-save live score progress
  if (currentUser) {
    if (gameState.score > (currentUser.highScore || 0)) {
      currentUser.highScore = gameState.score;
    }
    saveUser(currentUser);
  }
}

function updateLevelProgress() {
  if (!gameState.levelConfig) return;
  const target = gameState.levelConfig.target || 1;
  const progress = Math.max(0, Math.min(100, Math.round((gameState.score / target) * 100)));
  document.getElementById('level-progress-fill').style.width = `${progress}%`;
  document.getElementById('level-progress-text').textContent = `${progress}%`;
}

// ===== WIN / LOSE CHECK =====
function checkWinLose() {
  const lv = gameState.levelConfig;
  if (gameState.score >= lv.target) {
    winLevel();
    return;
  }
  // Check if no moves possible
  const unusedPieces = gameState.pieces.filter(p => !p.used);
  if (unusedPieces.length > 0) {
    const hasMoves = unusedPieces.some(p =>
      [...Array(BOARD_SIZE)].some((_, r) =>
        [...Array(BOARD_SIZE)].some((_, c) => canPlace(p.shape, r, c))
      )
    );
    if (!hasMoves) gameOver();
  }
}

function winLevel() {
  const lv = gameState.levelConfig;
  const timeMs = Date.now() - gameState.startTime;
  const timeSecs = timeMs / 1000;

  // Stars calculation
  let stars = 1;
  if (gameState.score >= lv.target * 1.5) stars = 2;
  if (gameState.score >= lv.target * 2) stars = 3;

  // Update user data
  if (currentUser) {
    currentUser.totalWins = (currentUser.totalWins || 0) + 1;
    currentUser.totalGames = (currentUser.totalGames || 0) + 1;
    if (gameState.score > (currentUser.highScore || 0)) {
      currentUser.highScore = gameState.score;
      showToast(t('newRecord'));
    }
    if (!currentUser.completedLevels) currentUser.completedLevels = [];
    if (!currentUser.completedLevels.includes(lv.id)) currentUser.completedLevels.push(lv.id);
    if (!currentUser.levelStars) currentUser.levelStars = {};
    currentUser.levelStars[lv.id] = Math.max(currentUser.levelStars[lv.id] || 0, stars);

    // Unlock next level
    const nextId = lv.id + 1;
    if (nextId <= LEVELS.length) {
      if (!currentUser.unlockedLevels) currentUser.unlockedLevels = [1];
      if (!currentUser.unlockedLevels.includes(nextId)) currentUser.unlockedLevels.push(nextId);
    }

    // Streak
    currentUser.bestStreak = Math.max(currentUser.bestStreak || 0, gameState.combo);

    // History
    if (!currentUser.gameHistory) currentUser.gameHistory = [];
    currentUser.gameHistory.unshift({ level: lv.id, score: gameState.score, win: true, date: Date.now() });
    currentUser.gameHistory = currentUser.gameHistory.slice(0, 20);

    // Achievements
    checkAchievement('first_win', currentUser.totalWins >= 1);
    checkAchievement('score_1000', currentUser.highScore >= 1000);
    checkAchievement('score_5000', currentUser.highScore >= 5000);
    checkAchievement('win_5', currentUser.totalWins >= 5);
    checkAchievement('level_5', lv.id >= 5);
    checkAchievement('speed_demon', timeSecs < 60);
    checkAchievement('explorer', currentUser.totalGames >= 10);

    saveUser(currentUser);
  }

  playSound('win');

  // Show win modal
  document.getElementById('win-stars').textContent = '⭐'.repeat(stars);
  document.getElementById('win-score-text').textContent =
    `${currentLang === 'ar' ? 'نقاطك:' : 'Score:'} ${gameState.score}`;

  const badges = document.getElementById('win-badges');
  badges.innerHTML = '';
  if (stars === 3) badges.innerHTML += `<span class="win-badge">${currentLang === 'ar' ? '✨ مثالي' : '✨ Perfect'}</span>`;
  if (gameState.combo >= 3) badges.innerHTML += `<span class="win-badge">🔥 Combo x${gameState.combo}</span>`;
  if (timeSecs < 60) badges.innerHTML += `<span class="win-badge">⚡ ${currentLang === 'ar' ? 'سريع' : 'Speed'}</span>`;

  const modal = document.getElementById('win-modal');
  const nextBtn = modal.querySelector('.btn-play');
  nextBtn.onclick = () => nextLevel();
  
  modal.classList.remove('hidden');
}

function gameOver() {
  if (currentUser) {
    currentUser.totalGames = (currentUser.totalGames || 0) + 1;
    if (!currentUser.gameHistory) currentUser.gameHistory = [];
    currentUser.gameHistory.unshift({ level: gameState.level, score: gameState.score, win: false, date: Date.now() });
    currentUser.gameHistory = currentUser.gameHistory.slice(0, 20);
    saveUser(currentUser);
  }
  playSound('lose');
  document.getElementById('go-score-text').textContent =
    `${currentLang === 'ar' ? 'نقاطك:' : 'Score:'} ${gameState.score}`;
  document.getElementById('gameover-modal').classList.remove('hidden');
}

function nextLevel() {
  closeModals();
  const next = gameState.level + 1;
  if (next <= LEVELS.length && currentUser?.unlockedLevels?.includes(next)) {
    startGame(next);
  } else {
    showMenu();
  }
}
function restartGame() { closeModals(); startGame(gameState.level); }
function pauseGame() {
  gameState.gamePaused = true;
  document.getElementById('pause-modal').classList.remove('hidden');
}
function resumeGame() {
  gameState.gamePaused = false;
  document.getElementById('pause-modal').classList.add('hidden');
}
function closeModals() {
  ['pause-modal','win-modal','gameover-modal','editname-modal'].forEach(id =>
    document.getElementById(id).classList.add('hidden')
  );
  gameState.gamePaused = false;
}

// ===== MEMORY GAME =====
const MEMORY_SYMBOLS = [
  '🌙', '⭐', '☄️', '🪐', '🌈', '🎧', '🚀', '💎',
  '🦁', '🐉', '🦊', '🤖', '👾', '🐺', '🦅', '🦄',
  '🔥', '❄️', '⚡', '🍀', '🍎', '🍓', '🏀', '🎮', '🧿', '💠'
];

function renderMemoryLevels() {
  const grid = document.getElementById('memory-levels-grid');
  grid.innerHTML = '';
  const unlocked = currentUser?.memoryUnlockedLevels || [1];
  
  MEMORY_LEVELS.forEach(level => {
    const isUnlocked = unlocked.includes(level.id);
    const card = document.createElement('div');
    card.className = `level-card ${!isUnlocked ? 'locked' : ''}`;
    card.dataset.diff = level.diff;
    card.innerHTML = `
      <div class="level-num">${level.id}</div>
      <div class="level-name">${level.name[currentLang]}</div>
      <div class="level-stars">${'🃏'.repeat(Math.min(level.pairs, 3))}</div>
      <div class="level-target">${currentLang === 'ar' ? 'الأزواج:' : 'Pairs:'} ${level.pairs}</div>
      ${!isUnlocked ? '<div style="font-size:24px; margin-top:8px;">🔒</div>' : ''}
    `;
    if (isUnlocked) {
      card.onclick = () => {
        startMemoryGame(level.id);
        showScreen('memory-screen');
      };
    }
    grid.appendChild(card);
  });
}

function startMemoryGame(levelId = 2) {
  const cfg = MEMORY_LEVELS.find(level => level.id === levelId) || MEMORY_LEVELS[1];
  const symbols = MEMORY_SYMBOLS.slice(0, cfg.pairs);
  const cards = [...symbols, ...symbols]
    .map((symbol, index) => ({
      id: `${symbol}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      symbol,
      matched: false
    }))
    .sort(() => Math.random() - 0.5);

  memoryState = {
    cards,
    flipped: cards.map(c => c.id), // Flip all initially
    matchedPairs: 0,
    moves: 0,
    locked: true, // Lock board during preview
    level: cfg.id,
    pairCount: cfg.pairs,
    cols: cfg.cols
  };

  renderMemoryStats();
  renderMemoryBoard();

  if (window.memoryTimerInterval) clearInterval(window.memoryTimerInterval);
  if (window.previewInterval) clearInterval(window.previewInterval);

  let previewTime = 3;
  document.getElementById('memory-time').textContent = `00:0${previewTime}`;

  window.previewInterval = setInterval(() => {
    previewTime -= 1;
    if (previewTime > 0) {
      document.getElementById('memory-time').textContent = `00:0${previewTime}`;
    } else {
      clearInterval(window.previewInterval);
      memoryState.flipped = [];
      memoryState.locked = false;
      renderMemoryBoard();
      
      window.memoryTimeElapsed = 0;
      document.getElementById('memory-time').textContent = `00:00`;
      
      window.memoryTimerInterval = setInterval(() => {
        window.memoryTimeElapsed += 1;
        let mins = Math.floor(window.memoryTimeElapsed / 60).toString().padStart(2, '0');
        let secs = (window.memoryTimeElapsed % 60).toString().padStart(2, '0');
        const timeEl = document.getElementById('memory-time');
        if(timeEl) timeEl.textContent = `${mins}:${secs}`;
      }, 1000);
    }
  }, 1000);
}

function restartMemoryGame() {
  startMemoryGame(memoryState.level || 2);
  playSound('start');
}

function renderMemoryStats() {
  const best = currentUser?.memoryBestMoves;
  document.getElementById('memory-moves').textContent = memoryState.moves;
  document.getElementById('memory-pairs').textContent = `${memoryState.matchedPairs}/${memoryState.pairCount}`;
  document.getElementById('memory-best').textContent = best ? best : '--';
}

function renderMemoryBoard() {
  const board = document.getElementById('memory-board');
  if (!board) return;
  board.innerHTML = '';
  board.style.gridTemplateColumns = `repeat(${memoryState.cols || 4}, minmax(0, 1fr))`;

  memoryState.cards.forEach(card => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `memory-card${memoryState.flipped.includes(card.id) ? ' flipped' : ''}${card.matched ? ' matched' : ''}`;
    btn.onclick = () => flipMemoryCard(card.id);
    btn.onpointerdown = () => btn.classList.add('is-pressing');
    btn.onpointerup = () => btn.classList.remove('is-pressing');
    btn.onpointercancel = () => btn.classList.remove('is-pressing');
    btn.onpointerleave = () => btn.classList.remove('is-pressing');
    btn.innerHTML = `
      <div class="memory-card-inner">
        <div class="memory-card-face memory-card-front">
          <span class="memory-star-orbit">
            <span class="memory-star-core">✦</span>
          </span>
        </div>
        <div class="memory-card-face memory-card-back">${card.symbol}</div>
      </div>
    `;
    board.appendChild(btn);
  });
}

function flipMemoryCard(cardId) {
  if (memoryState.locked) return;
  if (memoryState.flipped.includes(cardId)) return;

  const card = memoryState.cards.find(item => item.id === cardId);
  if (!card || card.matched) return;

  memoryState.flipped.push(cardId);
  renderMemoryBoard();
  playSound('click');

  if (memoryState.flipped.length < 2) return;

  memoryState.moves += 1;
  memoryState.locked = true;
  renderMemoryStats();

  const [firstId, secondId] = memoryState.flipped;
  const first = memoryState.cards.find(item => item.id === firstId);
  const second = memoryState.cards.find(item => item.id === secondId);

  if (first && second && first.symbol === second.symbol) {
    first.matched = true;
    second.matched = true;
    memoryState.matchedPairs += 1;
    memoryState.flipped = [];
    memoryState.locked = false;
    renderMemoryBoard();
    renderMemoryStats();
    playSound('clear');

    if (memoryState.matchedPairs === memoryState.pairCount) {
      finishMemoryGame();
    }
    return;
  }

  setTimeout(() => {
    memoryState.flipped = [];
    memoryState.locked = false;
    renderMemoryBoard();
  }, 700);
}

function finishMemoryGame() {
  if (window.memoryTimerInterval) clearInterval(window.memoryTimerInterval);
  
  const currentLvlId = memoryState.level;
  const cfg = MEMORY_LEVELS.find(l => l.id === currentLvlId);
  const moves = memoryState.moves;
  const minPossible = cfg.pairs; // Perfect: each pair is matched in 1 try (2 flips). Note: logic-wise min moves=pairs.
  
  // Clear any existing timer
  if (window.memoryTimerInterval) clearInterval(window.memoryTimerInterval);

  // Star calculation
  let stars = 1;
  if (moves <= minPossible * 1.5) stars = 3;
  else if (moves <= minPossible * 2.2) stars = 2;

  if (currentUser) {
    currentUser.totalGames = (currentUser.totalGames || 0) + 1;
    
    // Unlock next level
    if (!currentUser.memoryUnlockedLevels) currentUser.memoryUnlockedLevels = [1];
    const nextLvlId = currentLvlId + 1;
    if (nextLvlId <= MEMORY_LEVELS.length && !currentUser.memoryUnlockedLevels.includes(nextLvlId)) {
      currentUser.memoryUnlockedLevels.push(nextLvlId);
    }
    
    // Update Best
    if (!currentUser.memoryBestMoves || moves < currentUser.memoryBestMoves) {
      currentUser.memoryBestMoves = moves;
    }
    saveUser(currentUser);
  }

  // Show Modal
  const modal = document.getElementById('win-modal');
  document.getElementById('win-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
  document.getElementById('win-score-text').textContent = (currentLang === 'ar' ? `أنهيت اللعبة في ${moves} حركة!` : `Finished in ${moves} moves!`);
  
  // Customize Next Button for Memory
  const nextBtn = modal.querySelector('.btn-play');
  nextBtn.onclick = () => nextMemoryLevel();
  
  modal.classList.remove('hidden');
  playSound('win');
}

function nextMemoryLevel() {
  closeModals();
  const nextId = (memoryState.level || 0) + 1;
  if (nextId <= MEMORY_LEVELS.length) {
    startMemoryGame(nextId);
  } else {
    showGamesHub();
  }
}

function shakeBoard() {
  const board = document.getElementById('game-board');
  board.style.animation = 'none';
  board.offsetHeight;
  board.style.animation = 'shake 0.4s ease';
  setTimeout(() => board.style.animation = '', 400);
}

// Add shake keyframe dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)}
}`;
document.head.appendChild(shakeStyle);

// ===== PROFILE =====
function renderProfile() {
  if (!currentUser) return;
  document.getElementById('profile-name').textContent = currentUser.username;
  renderAvatarNode(document.getElementById('profile-avatar'), currentUser);
  applyCoverImage(document.getElementById('profile-cover'), currentUser.coverImage);
  document.getElementById('stat-wins').textContent = currentUser.totalWins || 0;
  document.getElementById('stat-score').textContent = currentUser.highScore || 0;
  document.getElementById('stat-games').textContent = currentUser.totalGames || 0;
  document.getElementById('stat-streak').textContent = currentUser.bestStreak || 0;

  // Achievements
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = '';
  ACHIEVEMENTS_DEF.forEach(ach => {
    const unlocked = currentUser.achievements?.includes(ach.id);
    const card = document.createElement('div');
    card.className = `achievement-card ${unlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `<div class="ach-icon">${ach.icon}</div><div class="ach-name">${ach.name[currentLang]}</div><div class="ach-desc">${ach.desc[currentLang]}</div>`;
    card.title = ach.desc[currentLang];
    grid.appendChild(card);
  });

  // History
  const histList = document.getElementById('history-list');
  histList.innerHTML = '';
  const history = currentUser.gameHistory || [];
  if (history.length === 0) {
    histList.innerHTML = `<p style="color:var(--text-dim);text-align:center">${currentLang === 'ar' ? 'لا يوجد سجل بعد' : 'No games yet'}</p>`;
  } else {
    history.slice(0, 10).forEach(h => {
      const item = document.createElement('div');
      item.className = 'history-item';
      const d = new Date(h.date);
      item.innerHTML = `
        <span class="history-level">${currentLang === 'ar' ? 'مستوى' : 'Level'} ${h.level}</span>
        <span class="history-score">${h.score}</span>
        <span class="history-result ${h.win ? 'result-win' : 'result-loss'}">${h.win ? (currentLang === 'ar' ? '✅ فوز' : '✅ Win') : (currentLang === 'ar' ? '❌ خسارة' : '❌ Loss')}</span>
      `;
      histList.appendChild(item);
    });
  }
}

function changeAvatar(emoji) {
  if (!currentUser) return;
  currentUser.avatar = emoji;
  currentUser.avatarImage = '';
  renderAvatarNode(document.getElementById('profile-avatar'), currentUser);
  renderAvatarNode(document.getElementById('menu-avatar'), currentUser);
  saveUser(currentUser);
  playSound('click');
}

function renderAvatarNode(node, userLike) {
  if (!node) return;
  const avatarImage = userLike?.avatarImage;
  const avatar = userLike?.avatar || '🎮';
  if (avatarImage) {
    node.innerHTML = `<img src="${avatarImage}" alt="avatar" class="avatar-img">`;
  } else {
    node.textContent = avatar;
  }
}

function applyCoverImage(node, image) {
  if (!node) return;
  if (image) {
    node.style.backgroundImage = `linear-gradient(135deg, rgba(7,17,43,0.3), rgba(42,14,65,0.45)), url("${image}")`;
    node.classList.add('has-image');
  } else {
    node.style.backgroundImage = '';
    node.classList.remove('has-image');
  }
}

// ===== LEADERBOARD =====
function renderLeaderboard() {
  const users = getUsers();
  const list = Object.values(users)
    .sort((a, b) => (b.highScore || 0) - (a.highScore || 0))
    .slice(0, 20);

  const container = document.getElementById('leaderboard-list');
  container.innerHTML = '';

  list.forEach((u, i) => {
    const item = document.createElement('div');
    item.className = `lb-item${i === 0 ? ' top1' : i === 1 ? ' top2' : i === 2 ? ' top3' : ''}`;
    const medals = ['🥇', '🥈', '🥉'];
    item.innerHTML = `
      <span class="lb-rank">${medals[i] || '#' + (i + 1)}</span>
      <span class="lb-avatar">${u.avatar || '🎮'}</span>
      <div class="lb-info">
        <div class="lb-name">${u.username}</div>
        <div class="lb-wins">${currentLang === 'ar' ? 'فوز:' : 'Wins:'} ${u.totalWins || 0}</div>
      </div>
      <span class="lb-score">${u.highScore || 0}</span>
    `;
    if (currentUser && u.username === currentUser.username) {
      item.style.border = '2px solid var(--c4)';
    }
    container.appendChild(item);
  });

  if (list.length === 0) {
    container.innerHTML = `<p style="color:var(--text-dim);text-align:center;padding:20px">${currentLang === 'ar' ? 'لا يوجد لاعبون بعد' : 'No players yet'}</p>`;
  }
}

// ===== ACHIEVEMENTS =====
function checkAchievement(id, condition) {
  if (!currentUser || !condition) return;
  if (!currentUser.achievements) currentUser.achievements = [];
  if (currentUser.achievements.includes(id)) return;
  currentUser.achievements.push(id);
  const ach = ACHIEVEMENTS_DEF.find(a => a.id === id);
  if (ach) {
    showToast(t('achUnlocked', ach.name[currentLang]));
    playSound('achievement');
  }
}

// ===== TOAST =====
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== MUSIC PLAYER =====

const TRACKS = [
  {
    file: 'lemonmusiclab-lofi-lofi-music-499264.mp3',
    name: 'Lofi Vibes',
    artist: 'Lemon Music Lab',
    art: '🍋',
    accent: 'var(--c2)'
  },
  {
    file: 'freemusicforvideo-lofi-chill-music-495628.mp3',
    name: 'Chill Beats',
    artist: 'Free Music For Video',
    art: '🌙',
    accent: 'var(--c7)'
  },
  {
    file: 'fassounds-good-night-lofi-cozy-chill-music-160166.mp3',
    name: 'Good Night',
    artist: 'Fassounds',
    art: '✨',
    accent: 'var(--c6)'
  },
  {
    file: 'the_mountain-lofi-lofi-music-496553.mp3',
    name: 'The Mountain',
    artist: 'The Mountain',
    art: '🏔️',
    accent: 'var(--c3)'
  },
];

let audioEl = null;
let currentTrackIdx = 0;
let musicPanelOpen = false;

function initMusicPlayer() {
  if (audioEl) return;
  audioEl = new Audio();
  audioEl.volume = 0.6;
  audioEl.preload = 'metadata';
  audioEl.addEventListener('ended', () => nextTrack());
  audioEl.addEventListener('timeupdate', updateProgress);
  audioEl.addEventListener('loadedmetadata', updateTotalTime);
  audioEl.addEventListener('play', () => {
    document.getElementById('play-pause-btn').textContent = '⏸';
    document.getElementById('track-art').classList.add('playing');
    document.getElementById('music-waves').classList.remove('paused');
    document.getElementById('music-toggle-icon').textContent = '🎵';
    updateActiveTrackUI();
  });
  audioEl.addEventListener('pause', () => {
    document.getElementById('play-pause-btn').textContent = '▶';
    document.getElementById('track-art').classList.remove('playing');
    document.getElementById('music-waves').classList.add('paused');
    updateActiveTrackUI();
  });
  audioEl.addEventListener('error', () => {
    showToast(currentLang === 'ar' ? 'تعذر تشغيل هذه الأغنية' : 'Unable to play this track');
  });
  buildTrackList();
  buildQuickPicks();
  loadTrack(0, false);
}

function buildTrackList() {
  const list = document.getElementById('track-list');
  list.innerHTML = '';
  TRACKS.forEach((tr, i) => {
    const item = document.createElement('div');
    item.className = `track-item${i === 0 ? ' active' : ''}`;
    item.id = `track-item-${i}`;
    item.innerHTML = `
      <span class="track-num">${i + 1}</span>
      <div class="track-item-info">
        <div class="track-item-name">${tr.name}</div>
        <div class="track-item-dur" id="dur-${i}">--:--</div>
      </div>
      <div class="track-eq" id="eq-${i}" style="display:none">
        <span></span><span></span><span></span>
      </div>
    `;
    item.onclick = () => loadTrack(i, true);
    list.appendChild(item);
  });
}

function buildQuickPicks() {
  const grid = document.getElementById('quick-picks-grid');
  if (!grid) return;
  grid.innerHTML = '';
  TRACKS.forEach((tr, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quick-track-btn';
    btn.id = `quick-track-${i}`;
    btn.innerHTML = `<strong>${tr.art} ${tr.name}</strong><span>${tr.artist}</span>`;
    btn.onclick = () => loadTrack(i, true);
    grid.appendChild(btn);
  });
}

function updateActiveTrackUI() {
  document.querySelectorAll('.track-item').forEach((el, i) => {
    el.classList.toggle('active', i === currentTrackIdx);
    const eq = document.getElementById(`eq-${i}`);
    if (eq) eq.style.display = i === currentTrackIdx && audioEl && !audioEl.paused ? 'flex' : 'none';
  });

  document.querySelectorAll('.quick-track-btn').forEach((el, i) => {
    el.classList.toggle('active', i === currentTrackIdx);
  });
}

function loadTrack(idx, autoplay = true) {
  if (!audioEl) initMusicPlayer();
  currentTrackIdx = idx;
  const tr = TRACKS[idx];
  audioEl.src = tr.file;
  audioEl.load();

  // Update UI
  document.getElementById('track-name').textContent = tr.name;
  document.getElementById('track-artist').textContent = tr.artist;
  document.getElementById('track-art').textContent = tr.art;
  document.getElementById('track-art').style.background = `linear-gradient(135deg, ${tr.accent}, var(--c4))`;
  document.getElementById('progress-fill').style.width = '0%';
  document.getElementById('time-curr').textContent = '0:00';
  document.getElementById('time-total').textContent = '--:--';
  updateActiveTrackUI();

  if (autoplay) {
    unlockAmbientAudio();
    audioEl.play().catch(() => {});
  }
}

function togglePlayPause() {
  if (!audioEl) initMusicPlayer();
  if (audioEl.paused) {
    unlockAmbientAudio();
    audioEl.play().catch(() => {});
  } else {
    audioEl.pause();
  }
  updateActiveTrackUI();
}

function nextTrack() {
  const next = (currentTrackIdx + 1) % TRACKS.length;
  loadTrack(next, true);
}

function prevTrack() {
  if (audioEl && audioEl.currentTime > 3) {
    audioEl.currentTime = 0;
    return;
  }
  const prev = (currentTrackIdx - 1 + TRACKS.length) % TRACKS.length;
  loadTrack(prev, true);
}

function setVolume(val) {
  if (audioEl) audioEl.volume = val / 100;
}

function seekMusic(e) {
  if (!audioEl || !audioEl.duration) return;
  const bar = e.currentTarget;
  const rect = bar.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audioEl.currentTime = pct * audioEl.duration;
}

function updateProgress() {
  if (!audioEl || !audioEl.duration) return;
  const pct = (audioEl.currentTime / audioEl.duration) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('time-curr').textContent = formatTime(audioEl.currentTime);
}

function updateTotalTime() {
  if (!audioEl) return;
  document.getElementById('time-total').textContent = formatTime(audioEl.duration);
  // Also update track list duration
  const durEl = document.getElementById(`dur-${currentTrackIdx}`);
  if (durEl) durEl.textContent = formatTime(audioEl.duration);
}

function formatTime(secs) {
  if (!secs || isNaN(secs)) return '--:--';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function toggleMusicPanel() {
  musicPanelOpen = !musicPanelOpen;
  const panel = document.getElementById('music-panel');
  panel.classList.toggle('hidden', !musicPanelOpen);
  if (musicPanelOpen) initMusicPlayer();
}

// ===== SOUND EFFECTS (kept for game feedback) =====
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
}

function unlockAmbientAudio() {
  if (ambientAudioUnlocked || !audioEl) return;
  ambientAudioUnlocked = true;
  audioEl.muted = true;
  const playAttempt = audioEl.play();
  if (playAttempt && typeof playAttempt.then === 'function') {
    playAttempt.then(() => {
      audioEl.pause();
      audioEl.currentTime = 0;
      audioEl.muted = false;
    }).catch(() => {
      ambientAudioUnlocked = false;
      audioEl.muted = false;
    });
  } else {
    audioEl.muted = false;
  }
}
function playSound(type) {
  try {
    initAudio();
    const sounds = {
      click:       { freqs: [440],               type: 'sine',     dur: 0.08, vol: 0.15 },
      place:       { freqs: [330, 440],           type: 'sine',     dur: 0.12, vol: 0.12 },
      clear:       { freqs: [523, 659, 784],      type: 'sine',     dur: 0.35, vol: 0.15 },
      win:         { freqs: [523,659,784,1047],   type: 'sine',     dur: 0.9,  vol: 0.15 },
      lose:        { freqs: [440, 330, 220],      type: 'sawtooth', dur: 0.6,  vol: 0.12 },
      error:       { freqs: [200],               type: 'square',   dur: 0.15, vol: 0.1  },
      start:       { freqs: [330, 440, 550],      type: 'sine',     dur: 0.4,  vol: 0.12 },
      achievement: { freqs: [659,784,1047,1319],  type: 'sine',     dur: 1,    vol: 0.15 },
      perfect:     { freqs: [784,1047,1319,1568], type: 'sine',     dur: 1.1,  vol: 0.15 },
    };
    const s = sounds[type] || sounds.click;
    s.freqs.forEach((f, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain); gain.connect(audioCtx.destination);
      osc.type = s.type;
      osc.frequency.value = f;
      const t0 = audioCtx.currentTime + i * 0.1;
      gain.gain.setValueAtTime(s.vol, t0);
      gain.gain.exponentialRampToValueAtTime(0.001, t0 + s.dur);
      osc.start(t0); osc.stop(t0 + s.dur);
    });
  } catch(e) {}
}

// Legacy stub so old calls don't break
function toggleMusic() { toggleMusicPanel(); }
function startBgMusic() {}
function stopBgMusic() {}


// ===== PARTICLES =====
function createParticles() {
  const container = document.getElementById('particles-container');
  for (let i = 0; i < 40; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    const colors = ['#ff4757','#ffa502','#2ed573','#1e90ff','#a855f7','#ff6b81','#00d2ff'];
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      animation-duration:${Math.random()*10+8}s;
      animation-delay:${Math.random()*10}s;
    `;
    container.appendChild(p);
  }
}


function setAppViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--app-vh', `${vh}px`);
}

function setupResponsiveViewport() {
  setAppViewportHeight();

  window.addEventListener('resize', setAppViewportHeight, { passive: true });
  window.addEventListener('orientationchange', setAppViewportHeight, { passive: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setAppViewportHeight, { passive: true });
  }
}
// ===== INIT =====
window.onload = () => {
  setupResponsiveViewport();
  setupStartSettingsEvents();
  createParticles();
  initMusicPlayer();
  loadOrSetup();

  // Demo: Add some fake users for leaderboard
  const users = getUsers();
  if (Object.keys(users).length === 0) {
    const demoUsers = [
      { username: 'أبو علي', highScore: 15000, totalWins: 25, avatar: '🦁', totalGames: 40, bestStreak: 5, unlockedLevels: LEVELS.map(l=>l.id), completedLevels: [1,2,3,4,5], levelStars: {1:3,2:3,3:2}, achievements: ['first_win','score_1000','win_5'], gameHistory: [] },
      { username: 'سارة', highScore: 12000, totalWins: 18, avatar: '🦊', totalGames: 30, bestStreak: 4, unlockedLevels: [1,2,3,4,5,6,7], completedLevels: [1,2,3,4], levelStars: {1:3,2:2,3:1}, achievements: ['first_win','score_1000'], gameHistory: [] },
      { username: 'GamePro', highScore: 20000, totalWins: 40, avatar: '🤖', totalGames: 60, bestStreak: 8, unlockedLevels: LEVELS.map(l=>l.id), completedLevels: [1,2,3,4,5,6,7,8], levelStars: {1:3,2:3,3:3,4:2}, achievements: ['first_win','score_1000','score_5000','win_5'], gameHistory: [] },
      { username: 'بطل', highScore: 8000, totalWins: 10, avatar: '🐉', totalGames: 18, bestStreak: 3, unlockedLevels: [1,2,3,4,5], completedLevels: [1,2,3], levelStars: {1:2,2:1}, achievements: ['first_win'], gameHistory: [] },
    ];
    demoUsers.forEach(u => { u.password = btoa('demo'); users[u.username] = u; });
    saveUsers(users);
  }
};

// ===== NEON STRIKE =====

let raidCanvas, raidCtx;
let raidAnimFrame;
let rState = {
  running: false, score: 0, fuel: 100, // fuel is now "energy"
  speed: 5, offsetY: 0, combo: 0, comboTimer: 0,
  player: { x: 50, y: 80, w: 30, h: 40, vx: 0, dash: 0, shield: 0, slow: 0 },
  skills: { dash: { cd: 0, max: 200 }, shield: { cd: 0, max: 500 }, slow: { cd: 0, max: 400 } },
  projs: [], enemies: [], particles: [], stars: [],
  lastEnemy: 0, bossActive: false, boss: null
};

let playerShipType = { type: 'emoji', value: '🚀', frame: 0 };
let playerShipColor = '#00ffff';
let raidInputState = {
  leftHeld: false,
  rightHeld: false,
  shootHeld: false,
  shootTimer: null,
  pointerId: null,
  dragActive: false,
  dragOffsetX: 0,
  handlersBound: false
};
let shipSpriteSheet = new Image();
shipSpriteSheet.onload = () => { console.log('Ships Sprite Loaded Successfully'); };
shipSpriteSheet.onerror = () => { console.error('Error Loading Ships Sprite'); };
shipSpriteSheet.src = 'assets/neon_ships.png?v=' + Date.now();

function triggerCyberStart() {
  playSound('start');
  initDesertRaidGame();
}

function openCyberCharModal() { document.getElementById('cyber-char-modal').classList.remove('hidden'); }
function closeCyberCharModal() { document.getElementById('cyber-char-modal').classList.add('hidden'); }
function selectCyberShip(el, value, type = 'emoji', frame = 0) {
  document.querySelectorAll('.cyber-ship-av').forEach(n => n.classList.remove('selected'));
  el.classList.add('selected');
  playerShipType = { type, value, frame };
  playSound('click');
}
function changeCyberColor(color) { playerShipColor = color; }
function openCyberSettingsModal() { document.getElementById('cyber-settings-modal').classList.remove('hidden'); }
function closeCyberSettingsModal() { document.getElementById('cyber-settings-modal').classList.add('hidden'); }

function showDesertRaid() { // Reused function name for backwards compatibility
  showScreen('raid-screen');
  document.getElementById('raid-overlay').style.display = 'flex';
  
  const bestEl = document.getElementById('cyber-high-score-val');
  if (bestEl) bestEl.textContent = currentUser && currentUser.raidBest ? currentUser.raidBest : 0;
  
  if (!raidCanvas) raidCanvas = document.getElementById('raid-canvas');
  if (raidCanvas) resizeRaidCanvas();
}

function resizeRaidCanvas() {
  if (!raidCanvas) return;
  const wrap = document.querySelector('.raid-game-wrap');
  if (!wrap) return;

  const oldW = raidCanvas.width || wrap.clientWidth;
  const oldH = raidCanvas.height || wrap.clientHeight;
  const nextW = wrap.clientWidth;
  const nextH = wrap.clientHeight;

  if (!nextW || !nextH) return;
  raidCanvas.width = nextW;
  raidCanvas.height = nextH;

  if (rState && rState.player) {
    const margin = (nextW - (rState.canyonWidth || nextW * 0.95)) / 2;
    const xRatio = oldW > 0 ? rState.player.x / oldW : 0.5;
    const yRatio = oldH > 0 ? rState.player.y / oldH : 0.82;
    rState.player.x = Math.max(margin, Math.min(nextW - margin - rState.player.w, Math.floor(nextW * xRatio)));
    rState.player.y = Math.max(0, Math.min(nextH - rState.player.h - 6, Math.floor(nextH * yRatio)));
    rState.canyonWidth = nextW * 0.95;
  }
}

function syncRaidMoveFromHold() {
  if (!rState.running) return;
  if (raidInputState.leftHeld && !raidInputState.rightHeld) {
    raidMove(-1);
  } else if (raidInputState.rightHeld && !raidInputState.leftHeld) {
    raidMove(1);
  } else {
    raidStop();
  }
}

function raidPressLeft(e) {
  if (e) e.preventDefault();
  raidInputState.leftHeld = true;
  syncRaidMoveFromHold();
}

function raidReleaseLeft(e) {
  if (e) e.preventDefault();
  raidInputState.leftHeld = false;
  syncRaidMoveFromHold();
}

function raidPressRight(e) {
  if (e) e.preventDefault();
  raidInputState.rightHeld = true;
  syncRaidMoveFromHold();
}

function raidReleaseRight(e) {
  if (e) e.preventDefault();
  raidInputState.rightHeld = false;
  syncRaidMoveFromHold();
}

function raidPressShoot(e) {
  if (e) e.preventDefault();
  if (!rState.running) return;
  raidInputState.shootHeld = true;
  raidShoot();

  if (raidInputState.shootTimer) clearInterval(raidInputState.shootTimer);
  raidInputState.shootTimer = setInterval(() => {
    if (raidInputState.shootHeld && rState.running) raidShoot();
  }, 130);
}

function raidReleaseShoot(e) {
  if (e) e.preventDefault();
  raidInputState.shootHeld = false;
  if (raidInputState.shootTimer) {
    clearInterval(raidInputState.shootTimer);
    raidInputState.shootTimer = null;
  }
}

function setupRaidTouchControls() {
  if (raidInputState.handlersBound) return;

  const controls = document.getElementById('raid-controls');
  if (controls) {
    controls.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  const bindPointer = () => {
    if (!raidCanvas) return;

    const onPointerDown = (e) => {
      if (!rState.running) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      raidInputState.pointerId = e.pointerId;
      raidInputState.dragActive = true;
      raidInputState.dragOffsetX = e.clientX - rState.player.x;
      try { raidCanvas.setPointerCapture(e.pointerId); } catch (_) {}
    };

    const onPointerMove = (e) => {
      if (!rState.running || !raidInputState.dragActive || raidInputState.pointerId !== e.pointerId) return;
      const margin = (raidCanvas.width - rState.canyonWidth) / 2;
      const newX = e.clientX - raidInputState.dragOffsetX;
      rState.player.x = Math.max(margin, Math.min(raidCanvas.width - margin - rState.player.w, newX));
      rState.player.vx = 0;
    };

    const stopDrag = (e) => {
      if (raidInputState.pointerId !== e.pointerId) return;
      raidInputState.dragActive = false;
      raidInputState.pointerId = null;
    };

    raidCanvas.addEventListener('pointerdown', onPointerDown, { passive: true });
    raidCanvas.addEventListener('pointermove', onPointerMove, { passive: true });
    raidCanvas.addEventListener('pointerup', stopDrag, { passive: true });
    raidCanvas.addEventListener('pointercancel', stopDrag, { passive: true });
  };

  bindPointer();
  window.addEventListener('resize', resizeRaidCanvas, { passive: true });
  window.addEventListener('orientationchange', resizeRaidCanvas, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', resizeRaidCanvas, { passive: true });
  }

  raidInputState.handlersBound = true;
}

function initDesertRaidGame() {
  document.getElementById('raid-overlay').style.display = 'none';
  raidCanvas = document.getElementById('raid-canvas');
  raidCtx = raidCanvas.getContext('2d', { alpha: false });
  resizeRaidCanvas();
  setupRaidTouchControls();
  
  rState = {
    running: true, score: 0, energy: 100, speed: 6, offsetY: 0, combo: 0, comboTimer: 0, lives: 3, padWasMoving: false,
    player: { x: raidCanvas.width / 2 - 15, y: raidCanvas.height - 80, w: 30, h: 40, vx: 0, dash: 0, shield: 0, slow: 0 },
    skills: { dash: { cd: 0, max: 200 }, shield: { cd: 0, max: 600 }, slow: { cd: 0, max: 500 } },
    projs: [], enemies: [], particles: [], stars: [],
    lastEnemy: 0, bossActive: false, boss: null, canyonWidth: raidCanvas.width * 0.95
  };
  
  for(let i=0; i<50; i++) rState.stars.push({x: Math.random()*raidCanvas.width, y: Math.random()*raidCanvas.height, s: Math.random()*2+1});
  
  if (window.raidFuelInterval) clearInterval(window.raidFuelInterval);
  window.raidFuelInterval = setInterval(() => {
    if (rState.running) {
      rState.energy -= (rState.player.slow > 0 ? 0.3 : 1);
      if(rState.skills.dash.cd > 0) rState.skills.dash.cd -= 10;
      if(rState.skills.shield.cd > 0) rState.skills.shield.cd -= 10;
      if(rState.skills.slow.cd > 0) rState.skills.slow.cd -= 10;
      
      updateRaidUI();
      if (rState.energy <= 0) {
        rState.lives--;
        if (rState.lives <= 0) raidGameOver();
        else {
          rState.energy = 50; 
          rState.player.shield = 100;
          playSound('error');
        }
      }
    }
  }, 100);
  
  raidLoop();
}

function updateRaidUI() {
  document.getElementById('raid-score').textContent = rState.score;
  const f = Math.max(0, Math.min(100, rState.energy));
  document.getElementById('raid-fuel-fill').style.width = f + '%';
  const livesEl = document.getElementById('raid-lives');
  if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, rState.lives));
  
  const updateSkillBtn = (id, skill) => {
    const btn = document.getElementById(id);
    if(btn) {
      if(skill.cd > 0) {
        btn.classList.add('cooldown');
        btn.style.background = `linear-gradient(90deg, rgba(255,255,0,0.1) ${(1 - skill.cd/skill.max)*100}%, rgba(0,0,0,0.8) 0%)`;
      } else {
        btn.classList.remove('cooldown');
        btn.style.background = 'rgba(255,255,0,0.1)';
      }
    }
  };
  updateSkillBtn('btn-dash', rState.skills.dash);
  updateSkillBtn('btn-shield', rState.skills.shield);
  updateSkillBtn('btn-slow', rState.skills.slow);
}

function raidMove(dir) { if (rState.running) rState.player.vx = dir * 8; }
function raidStop() { if (rState.running) rState.player.vx = 0; }

function raidUseDash() {
  if(!rState.running || rState.skills.dash.cd > 0) return;
  rState.player.dash = 15;
  rState.skills.dash.cd = rState.skills.dash.max;
  playSound('start');
  createExplosion(rState.player.x+15, rState.player.y+20, '#00ffff', 10);
}
function raidUseShield() {
  if(!rState.running || rState.skills.shield.cd > 0) return;
  rState.player.shield = 100;
  rState.skills.shield.cd = rState.skills.shield.max;
  playSound('win');
}
function raidUseSlow() {
  if(!rState.running || rState.skills.slow.cd > 0) return;
  rState.player.slow = 100;
  rState.skills.slow.cd = rState.skills.slow.max;
  playSound('achievement');
}

window.addEventListener('keydown', (e) => {
  if (!rState.running) return;
  if (['ArrowLeft','a','A'].includes(e.key)) raidMove(-1);
  if (['ArrowRight','d','D'].includes(e.key)) raidMove(1);
  if ([' ','ArrowUp','w','W'].includes(e.key)) raidShoot();
  if (e.key === 'Shift') raidUseDash();
  if (e.key === '1') raidUseShield();
  if (e.key === '2') raidUseSlow();
});
window.addEventListener('keyup', (e) => {
  if (!rState.running) return;
  if (['ArrowLeft','a','A','ArrowRight','d','D'].includes(e.key)) raidStop();
});

let lastShootTime = 0;
function handleGamepad() {
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  let gp = null;
  for (let i = 0; i < gamepads.length; i++) {
    if (gamepads[i] && gamepads[i].connected) { gp = gamepads[i]; break; }
  }
  if (!gp || !rState.running) return;

  let padMoved = false;
  if (gp.axes[0] < -0.3 || (gp.buttons[14] && gp.buttons[14].pressed)) {
    raidMove(-1); padMoved = true;
  } else if (gp.axes[0] > 0.3 || (gp.buttons[15] && gp.buttons[15].pressed)) {
    raidMove(1); padMoved = true;
  }
  
  if (!padMoved && rState.padWasMoving) {
    raidStop();
    rState.padWasMoving = false;
  } else if (padMoved) {
    rState.padWasMoving = true;
  }

  const now = Date.now();
  if ((gp.buttons[0] && gp.buttons[0].pressed) || (gp.buttons[7] && gp.buttons[7].pressed)) {
    if (now - lastShootTime > 150) { raidShoot(); lastShootTime = now; }
  }

  if (gp.buttons[2] && gp.buttons[2].pressed) raidUseDash(); 
  if (gp.buttons[1] && gp.buttons[1].pressed) raidUseShield(); 
  if (gp.buttons[3] && gp.buttons[3].pressed) raidUseSlow(); 
}

function raidShoot() {
  if (!rState.running) return;
  rState.projs.push({ x: rState.player.x + rState.player.w / 2 - 2, y: rState.player.y, w: 4, h: 16, vy: -15, c: '#ff00ff' });
  if (rState.player.dash > 0) { // Spread shot if dashing
    rState.projs.push({ x: rState.player.x, y: rState.player.y, w: 4, h: 16, vx: -3, vy: -15, c: '#00ffff' });
    rState.projs.push({ x: rState.player.x + rState.player.w, y: rState.player.y, w: 4, h: 16, vx: 3, vy: -15, c: '#00ffff' });
  }
  playSound('click');
}

function createExplosion(x, y, color, count=15) {
  for(let i=0; i<count; i++) {
    rState.particles.push({
      x, y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10,
      life: 1, color, size: Math.random()*4+2
    });
  }
}

function raidLoop() {
  if (!rState.running) return;
  updateRaid();
  drawRaid();
  handleGamepad();
  raidAnimFrame = requestAnimationFrame(raidLoop);
}

function updateRaid() {
  let effSpeed = rState.player.slow > 0 ? rState.speed * 0.4 : rState.speed;
  rState.offsetY += effSpeed;
  
  if (rState.comboTimer > 0) rState.comboTimer--;
  else rState.combo = 0;
  
  if(rState.player.dash > 0) rState.player.dash--;
  if(rState.player.shield > 0) rState.player.shield--;
  if(rState.player.slow > 0) rState.player.slow--;
  
  let pSpeed = rState.player.vx;
  if(rState.player.dash > 0) pSpeed *= 2.5;
  rState.player.x += pSpeed;
  
  const margin = (raidCanvas.width - rState.canyonWidth) / 2;
  if (rState.player.x < margin) rState.player.x = margin;
  if (rState.player.x + rState.player.w > raidCanvas.width - margin) rState.player.x = raidCanvas.width - margin - rState.player.w;
  
  rState.projs.forEach(p => { p.y += p.vy; if(p.vx) p.x += p.vx; });
  rState.projs = rState.projs.filter(p => p.y > 0 && p.x > 0 && p.x < raidCanvas.width);
  
  rState.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.05; p.size *= 0.9; });
  rState.particles = rState.particles.filter(p => p.life > 0);
  
  rState.stars.forEach(s => { s.y += effSpeed * s.s * 0.5; if(s.y > raidCanvas.height) { s.y = 0; s.x = Math.random()*raidCanvas.width; }});
  
  // Scoring & Boss spawn
  rState.score += (rState.player.slow > 0 ? 0.5 : 1);
  if (rState.score > 0 && Math.floor(rState.score) % 2000 === 0 && !rState.bossActive && rState.score < 2005) {
    rState.bossActive = true;
    rState.boss = { x: raidCanvas.width/2 - 60, y: -100, w: 120, h: 80, hp: 50, maxHp: 50, vx: 3, type: 'boss' };
    rState.enemies.push(rState.boss);
    rState.speed += 1;
    playSound('error');
  }
  
  if (!rState.bossActive) {
    rState.lastEnemy += (rState.player.slow > 0 ? 0.4 : 1);
    if (rState.lastEnemy > Math.max(15, 50 - rState.speed * 1.5)) {
      rState.lastEnemy = 0;
      const isFuel = Math.random() < 0.15;
      const isSeeker = Math.random() < 0.1;
      const w = isFuel ? 25 : 40; const h = isFuel ? 35 : 30;
      const x = margin + Math.random() * (rState.canyonWidth - w);
      rState.enemies.push({ x, y: -h, w, h, type: isFuel ? 'fuel' : (isSeeker ? 'seeker' : 'enemy'), hp: isFuel ? 1 : (isSeeker?2:3) });
    }
  }
  
  rState.enemies.forEach(e => {
    if(e.type === 'boss') {
      if(e.y < 50) e.y += 2;
      e.x += e.vx;
      if (e.x < margin || e.x + e.w > raidCanvas.width - margin) e.vx *= -1;
      if (Math.random() < 0.05 && rState.player.slow <= 0) {
         rState.enemies.push({x: e.x+e.w/2-10, y: e.y+e.h, w: 20, h: 20, type:'laser', hp:1, vy: 8});
      }
    } else if (e.type === 'seeker') {
      e.y += effSpeed * 1.2;
      e.x += (rState.player.x - e.x) * 0.02;
    } else if (e.type === 'laser') {
      e.y += e.vy * (rState.player.slow > 0 ? 0.3 : 1);
    } else {
      e.y += effSpeed * 0.9;
      if (e.type === 'enemy') {
        if (e.time === undefined) e.time = Math.random() * 100;
        if (e.x0 === undefined) e.x0 = e.x;
        
        e.time += 0.05;
        e.x = e.x0 + Math.sin(e.time) * 50;
        const margin = (raidCanvas.width - rState.canyonWidth) / 2;
        if (e.x < margin) e.x = margin;
        if (e.x + e.w > raidCanvas.width - margin) e.x = raidCanvas.width - margin - e.w;

        if (Math.random() < 0.03 && rState.player.slow <= 0) {
          rState.enemies.push({x: e.x+e.w/2-3, y: e.y+e.h, w: 6, h: 16, type:'laser', hp:1, vy: 8});
        }
      }
    }
  });
  
  rState.enemies = rState.enemies.filter(e => e.y < raidCanvas.height + 50);
  
  for (let i = rState.enemies.length - 1; i >= 0; i--) {
    let e = rState.enemies[i];
    
    // Player collision
    if (rectIntersect(rState.player, {x:e.x, y:e.y, width:e.w, height:e.h})) {
      if (e.type === 'fuel') {
        rState.energy = Math.min(100, rState.energy + 35);
        rState.score += 100;
        createExplosion(e.x+e.w/2, e.y+e.h/2, '#00ffff', 10);
        rState.enemies.splice(i, 1);
        playSound('clear');
        continue;
      } else {
        if (rState.player.dash > 0 || rState.player.shield > 0) {
          e.hp -= 5;
          if(e.hp <= 0) {
            createExplosion(e.x+e.w/2, e.y+e.h/2, '#ff00ff', 20);
            rState.enemies.splice(i, 1);
            playSound('place');
          }
          if(rState.player.shield === 0) rState.player.dash = 0; // stop dash on impact
        } else {
          createExplosion(rState.player.x+15, rState.player.y+20, '#ff4757', 50);
          rState.lives--;
          if (rState.lives <= 0) {
            raidGameOver();
            return;
          } else {
            rState.player.shield = 100;
            rState.enemies.splice(i, 1);
            playSound('error');
          }
        }
      }
    }
    
    // Projectiles collision
    for (let j = rState.projs.length - 1; j >= 0; j--) {
      let p = rState.projs[j];
      if (rectIntersect({x:p.x,y:p.y,width:p.w,height:p.h}, {x:e.x, y:e.y, width:e.w, height:e.h})) {
        rState.projs.splice(j, 1);
        if (e.type !== 'fuel') {
          createExplosion(p.x, p.y, p.c, 5);
          e.hp--;
           if (e.hp <= 0) {
            rState.combo++; rState.comboTimer = 100;
            let mult = Math.min(5, 1 + Math.floor(rState.combo/3));
            rState.score += (e.type==='boss'?2000:100) * mult;
            createExplosion(e.x+e.w/2, e.y+e.h/2, e.type==='boss'?'#ffff00':'#ff00ff', e.type==='boss'?50:20);
            if(e.type === 'boss') rState.bossActive = false;
            rState.enemies.splice(i, 1);
            playSound(e.type==='boss'?'win':'place');
          }
        }
        break;
      }
    }
  }
}

function drawRaid() {
  raidCtx.fillStyle = '#050510'; 
  raidCtx.fillRect(0, 0, raidCanvas.width, raidCanvas.height);
  
  // Stars
  raidCtx.fillStyle = '#ffffff';
  rState.stars.forEach(s => { raidCtx.globalAlpha = s.s/3; raidCtx.fillRect(s.x, s.y, s.s, s.s); });
  raidCtx.globalAlpha = 1;

  // Neon Grid Back
  raidCtx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
  raidCtx.lineWidth = 1;
  raidCtx.beginPath();
  let effSpeed = rState.player.slow > 0 ? rState.speed * 0.4 : rState.speed;
  const gridSize = 60;
  for (let i = 0; i < raidCanvas.width/gridSize; i++) {
    raidCtx.moveTo(i*gridSize, 0); raidCtx.lineTo(i*gridSize, raidCanvas.height);
  }
  for (let i = -2; i < raidCanvas.height/gridSize + 2; i++) {
    const y = (i*gridSize + rState.offsetY % gridSize);
    raidCtx.moveTo(0, y); raidCtx.lineTo(raidCanvas.width, y);
  }
  raidCtx.stroke();
  
  const margin = (raidCanvas.width - rState.canyonWidth) / 2;
  
  // Side Walls
  raidCtx.fillStyle = 'rgba(255, 0, 255, 0.05)';
  raidCtx.fillRect(0, 0, margin, raidCanvas.height);
  raidCtx.fillRect(raidCanvas.width - margin, 0, margin, raidCanvas.height);
  raidCtx.strokeStyle = '#ff00ff';
  raidCtx.lineWidth = 2;
  raidCtx.shadowBlur = 15; raidCtx.shadowColor = '#ff00ff';
  raidCtx.beginPath();
  raidCtx.moveTo(margin, 0); raidCtx.lineTo(margin, raidCanvas.height);
  raidCtx.moveTo(raidCanvas.width - margin, 0); raidCtx.lineTo(raidCanvas.width - margin, raidCanvas.height);
  raidCtx.stroke();
  raidCtx.shadowBlur = 0;
  
  // Player
  raidCtx.shadowBlur = 20;
  raidCtx.shadowColor = rState.player.dash > 0 ? '#ffffff' : (rState.player.shield > 0 ? '#ffff00' : playerShipColor);
  raidCtx.fillStyle = raidCtx.shadowColor;
  
  if (playerShipType.type === 'emoji') {
    raidCtx.beginPath();
    raidCtx.moveTo(rState.player.x + rState.player.w/2, rState.player.y);
    raidCtx.lineTo(rState.player.x + rState.player.w, rState.player.y + rState.player.h);
    raidCtx.lineTo(rState.player.x, rState.player.y + rState.player.h);
    raidCtx.fill();
    raidCtx.shadowBlur = 0;
    raidCtx.font = '26px Arial';
    raidCtx.textAlign = 'center';
    raidCtx.textBaseline = 'middle';
    raidCtx.fillText(playerShipType.value, rState.player.x + rState.player.w/2, rState.player.y + rState.player.h/2 + 5);
  } else if (playerShipType.type === 'image') {
    const frameSize = shipSpriteSheet.complete ? shipSpriteSheet.naturalWidth / 4 : 128; 
    const fx = (playerShipType.frame % 4) * frameSize;
    const fy = Math.floor(playerShipType.frame / 4) * frameSize;
    
    raidCtx.save();
    raidCtx.translate(rState.player.x + rState.player.w/2, rState.player.y + rState.player.h/2);
    
    // Rotate 180 degrees to face forward (up)
    // Plus a small tilt based on horizontal velocity for extra "juice"
    const tilt = (rState.player.vx / 10) * 0.2; 
    raidCtx.rotate(Math.PI + tilt); 
    
    const oldGCO = raidCtx.globalCompositeOperation;
    raidCtx.globalCompositeOperation = 'screen';
    
    // Draw centered
    raidCtx.drawImage(shipSpriteSheet, fx, fy, frameSize, frameSize, -rState.player.w/2, -rState.player.h/2, rState.player.w, rState.player.h);
    
    raidCtx.globalCompositeOperation = oldGCO;
    raidCtx.restore();
  }
  
  // Shield ring
  if(rState.player.shield > 0) {
    raidCtx.strokeStyle = `rgba(255,255,0,${rState.player.shield/100})`;
    raidCtx.lineWidth = 3; raidCtx.beginPath();
    raidCtx.arc(rState.player.x+rState.player.w/2, rState.player.y+rState.player.h/2, 35, 0, Math.PI*2);
    raidCtx.stroke();
  }
  if(rState.player.slow > 0) {
    raidCtx.fillStyle = `rgba(0,255,255,${(rState.player.slow/100)*0.2})`;
    raidCtx.fillRect(0,0,raidCanvas.width,raidCanvas.height);
  }
  
  // Projectiles
  rState.projs.forEach(p => {
    raidCtx.shadowBlur = 10; raidCtx.shadowColor = p.c;
    raidCtx.fillStyle = '#ffffff';
    raidCtx.fillRect(p.x, p.y, p.w, p.h);
  });
  raidCtx.shadowBlur = 0;
  
  // Enemies
  rState.enemies.forEach(e => {
    if (e.type === 'fuel') {
      raidCtx.shadowBlur = 15; raidCtx.shadowColor = '#00ffff';
      raidCtx.fillStyle = '#0a2a2a'; raidCtx.strokeStyle = '#00ffff'; raidCtx.lineWidth = 2;
      raidCtx.fillRect(e.x, e.y, e.w, e.h); raidCtx.strokeRect(e.x, e.y, e.w, e.h);
      raidCtx.fillStyle = '#00ffff'; raidCtx.font = 'bold 16px Arial';
      raidCtx.fillText('⚡', e.x + 4, e.y + e.h/2 + 6);
    } else if (e.type === 'boss') {
      raidCtx.shadowBlur = 20; raidCtx.shadowColor = '#ff0000';
      raidCtx.fillStyle = '#110000'; raidCtx.strokeStyle = '#ff0000'; raidCtx.lineWidth = 3;
      raidCtx.fillRect(e.x, e.y, e.w, e.h); raidCtx.strokeRect(e.x, e.y, e.w, e.h);
      // Boss Eye
      raidCtx.fillStyle = '#ff0000';
      raidCtx.beginPath(); raidCtx.arc(e.x+e.w/2, e.y+e.h/2, 15, 0, Math.PI*2); raidCtx.fill();
      // Boss HP
      raidCtx.fillStyle = '#ff0000';
      raidCtx.fillRect(e.x, e.y - 12, (e.hp/e.maxHp)*e.w, 6);
    } else if (e.type === 'laser') {
      raidCtx.shadowBlur = 10; raidCtx.shadowColor = '#ff0000'; raidCtx.fillStyle = '#ff4757';
      raidCtx.fillRect(e.x, e.y, e.w, e.h);
    } else {
      raidCtx.shadowBlur = 15; raidCtx.shadowColor = e.type==='seeker'?'#ff00ff':'#ff4757';
      raidCtx.fillStyle = '#1a0505'; raidCtx.strokeStyle = raidCtx.shadowColor; raidCtx.lineWidth = 2;
      // Diamond shape for enemies
      raidCtx.beginPath();
      raidCtx.moveTo(e.x + e.w/2, e.y);
      raidCtx.lineTo(e.x + e.w, e.y + e.h/2);
      raidCtx.lineTo(e.x + e.w/2, e.y + e.h);
      raidCtx.lineTo(e.x, e.y + e.h/2);
      raidCtx.closePath();
      raidCtx.fill(); raidCtx.stroke();
    }
  });
  raidCtx.shadowBlur = 0;
  
  // Particles
  rState.particles.forEach(p => {
    raidCtx.fillStyle = p.color; raidCtx.globalAlpha = p.life;
    raidCtx.beginPath(); raidCtx.arc(p.x, p.y, p.size, 0, Math.PI*2); raidCtx.fill();
  });
  raidCtx.globalAlpha = 1;
  // Combo Text
  if (rState.combo > 1) {
    raidCtx.fillStyle = `rgba(0, 255, 255, ${rState.comboTimer/100})`;
    raidCtx.font = 'italic 900 32px Orbitron';
    raidCtx.fillText(`x${Math.min(5, 1+Math.floor(rState.combo/3))} COMBO!`, raidCanvas.width/2 - 80, 100);
  }
}

function rectIntersect(r1, r2) {
  return !(r2.x > r1.x + r1.width || r2.x + r2.width < r1.x || r2.y > r1.y + r1.height || r2.y + r2.height < r1.y);
}

function raidGameOver() {
  rState.running = false;
  clearInterval(window.raidFuelInterval);
  playSound('lose');
  if (currentUser) {
    if (!currentUser.raidBest || rState.score > currentUser.raidBest) {
      currentUser.raidBest = rState.score;
      showToast(currentLang === 'ar' ? 'رقم قياسي نيون جديد!' : 'New Neon Record!');
    }
    saveUser(currentUser);
  }
  document.getElementById('raid-overlay').style.display = 'flex';
  document.getElementById('raid-msg').textContent = (currentLang === 'ar' ? 'تحطمت! النقاط: ' : 'CRASHED! Score: ') + Math.floor(rState.score);
}







