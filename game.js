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

const BOARD_SIZE = 8;

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
function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('lang-text').textContent = currentLang === 'ar' ? 'EN' : 'AR';
  updateLangDOM();
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
    bestStreak: 0, unlockedLevels: [1], completedLevels: [],
    levelStars: {}, achievements: [], gameHistory: [], createdAt: Date.now()
  };
}

// ===== SETUP / PROFILE MANAGEMENT =====

// Selected avatar during setup
let setupAvatar = '🎮';
let editAvatar  = '🎮';

function pickAvatar(el, emoji) {
  setupAvatar = emoji;
  document.querySelectorAll('.setup-avatars .setup-av').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('setup-av-preview').textContent = emoji;
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
  document.getElementById('edit-av-preview').textContent = editAvatar;
  document.getElementById('edit-name-input').value = currentUser.username;
  // mark current avatar
  document.querySelectorAll('#edit-avatars .setup-av').forEach(el => {
    el.classList.toggle('selected', el.textContent === editAvatar);
  });
  document.getElementById('editname-modal').classList.remove('hidden');
}

function pickEditAvatar(el, emoji) {
  editAvatar = emoji;
  document.querySelectorAll('#edit-avatars .setup-av').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
  document.getElementById('edit-av-preview').textContent = emoji;
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
  saveUser(currentUser);
  localStorage.setItem('bb_active_user', currentUser.username);

  closeEditName();
  showMenu();
  showToast(currentLang === 'ar' ? '✅ تم الحفظ!' : '✅ Saved!');
}

function closeEditName() {
  document.getElementById('editname-modal').classList.add('hidden');
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
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  const screen = document.getElementById(id);
  screen.style.display = 'flex';
  requestAnimationFrame(() => screen.classList.add('active'));
}
function showMenu() {
  closeModals();
  if (currentUser && !currentUser.isGuest) saveUser(currentUser);
  document.getElementById('menu-username').textContent = currentUser?.username || 'لاعب';
  document.getElementById('menu-avatar').textContent = currentUser?.avatar || '🎮';
  document.getElementById('menu-score').textContent = currentUser?.highScore || 0;
  showScreen('menu-screen');
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
    card.innerHTML = `
      <div class="level-num">${lv.id}</div>
      <div class="level-name">${lv.name[currentLang]}</div>
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

  showScreen('game-screen');
  playSound('start');
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
  // Auto-save live score progress
  if (currentUser) {
    if (gameState.score > (currentUser.highScore || 0)) {
      currentUser.highScore = gameState.score;
    }
    saveUser(currentUser);
  }
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

  document.getElementById('win-modal').classList.remove('hidden');
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
  document.getElementById('profile-avatar').textContent = currentUser.avatar || '🎮';
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
  document.getElementById('profile-avatar').textContent = emoji;
  document.getElementById('menu-avatar').textContent = emoji;
  saveUser(currentUser);
  playSound('click');
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
    file: 'WhatsApp Audio 2026-03-29 at 12.34.56 PM.mpeg',
    name: 'Lofi Vibes',
    artist: 'Lemon Music Lab',
    art: '🍋',
    accent: 'var(--c2)'
  },
  {
    file: 'WhatsApp Audio 2026-03-29 at 12.34.56 PM (1).mpeg',
    name: 'Chill Beats',
    artist: 'Free Music For Video',
    art: '🌙',
    accent: 'var(--c7)'
  },
  {
    file: 'WhatsApp Audio 2026-03-29 at 12.34.57 PM.mpeg',
    name: 'Good Night',
    artist: 'Fassounds',
    art: '✨',
    accent: 'var(--c6)'
  },
  {
    file: 'WhatsApp Audio 2026-03-29 at 12.34.57 PM (1).mpeg',
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
  if (TRACKS.length === 0) return;
  const safeIdx = ((idx % TRACKS.length) + TRACKS.length) % TRACKS.length;
  currentTrackIdx = safeIdx;
  const tr = TRACKS[safeIdx];
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

// ===== INIT =====
window.onload = () => {
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


