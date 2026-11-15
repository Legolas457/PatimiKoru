// --- UYGULAMA VERİLERİ VE DURUMU ---
let currentUser = null;
let userPoints = 120;
let userCompletedCount = 0;
let activeTab = 'tasks';

// Örnek Görevler (Fotoğraf yükleme özellikli)
const tasksData = [
  { id: 1, title: 'Bir Kap Su Koy', desc: 'Sokaktaki canlar için kapı önüne taze su bırak ve fotoğrafını ekle.', points: 30, completed: false, image: null },
  { id: 2, title: 'Mama Desteği Sağla', desc: 'Kediler ve köpekler için uygun bir mama bırakarak beslenmelerine destek ol.', points: 50, completed: false, image: null },
  { id: 3, title: 'Güvenli Sığınak Oluştur', desc: 'Soğuk ve yağışlı havalar için korunaklı bir alan veya karton yuva yap.', points: 40, completed: false, image: null }
];

// Örnek Akış Gönderileri
let feedData = [
  { id: 1, author: 'PatiDostu_21', text: 'Bugün mahallemizdeki dostlar için iki farklı noktaya taze su ve mama bıraktık. İyi ki varsınız! 🐾', image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80', likes: 14, liked: false }
];

// Örnek Arkadaşlar
const friendsData = [
  { name: 'Zeynep Kaya', points: 340, badge: 'Pati Muhafızı' },
  { name: 'Mehmet Demir', points: 210, badge: 'Sokak Kahramanı' },
  { name: 'Elif Şahin', points: 180, badge: 'Pati Gönüllüsü' }
];

// Örnek Mağaza Ürünleri
const shopData = [
  { id: 1, title: 'Altın Pati Rozeti', desc: 'Profilinde sergileyebileceğin özel dijital rozet', cost: 100, icon: '🏅' },
  { id: 2, title: '1 Kilo Mama Bağışı', desc: 'Barınaktaki dostlarımız için mama bağışında bulun', cost: 150, icon: '🥣' },
  { id: 3, title: 'Süper Gönüllü Unvanı', desc: 'Profil kartında özel renkli unvan', cost: 250, icon: '⭐' }
];

// Geçici yeni gönderi fotoğraf tutucusu
let currentPostImageBase64 = null;

// --- SAYFA VE MODAL YÖNETİMİ ---
function showLanding() {
  document.getElementById('landing-view').classList.remove('hidden');
  document.getElementById('app-view').classList.add('hidden');
}

function showApp() {
  document.getElementById('landing-view').classList.add('hidden');
  document.getElementById('auth-modal').classList.add('hidden');
  document.getElementById('app-view').classList.remove('hidden');
  renderTasks();
  renderFeed();
  renderFriends();
  renderShop();
  updateHeaderStats();
}

function scrollToSteps() {
  document.getElementById('steps-section').scrollIntoView({ behavior: 'smooth' });
}

// --- GİRİŞ / KAYIT MODALI ---
let authMode = 'login'; // 'login', 'register', 'admin'

function openAuthModal(mode) {
  authMode = mode;
  const modal = document.getElementById('auth-modal');
  const title = document.getElementById('auth-title');
  const subtitle = document.getElementById('auth-subtitle');
  const nameGroup = document.getElementById('register-name-group');
  const submitBtn = document.getElementById('auth-submit-btn');
  const switchArea = document.getElementById('auth-switch-area');

  modal.classList.remove('hidden');

  if (mode === 'login') {
    title.innerText = 'Tekrar hoş geldin!';
    subtitle.innerText = 'İyilik yolculuğuna devam etmek için giriş yap.';
    nameGroup.classList.add('hidden');
    submitBtn.innerText = 'Giriş yap';
    switchArea.classList.remove('hidden');
  } else if (mode === 'register') {
    title.innerText = 'Aramıza katıl!';
    subtitle.innerText = 'Sokaktaki canlar için birlikte bir şeyler yapalım.';
    nameGroup.classList.remove('hidden');
    submitBtn.innerText = 'Kayıt ol ve Başla';
    switchArea.classList.remove('hidden');
  } else if (mode === 'admin') {
    title.innerText = 'Yönetici Girişi';
    subtitle.innerText = 'Sistem yönetim paneline erişmek için şifreni gir.';
    nameGroup.classList.add('hidden');
    submitBtn.innerText = 'Yönetici Olarak Gir';
    switchArea.classList.add('hidden');
  }
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.add('hidden');
}

function toggleAuthMode() {
  openAuthModal(authMode === 'login' ? 'register' : 'login');
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('auth-email').value;
  const nameInput = document.getElementById('auth-name').value;

  currentUser = {
    name: nameInput || email.split('@')[0],
    email: email
  };

  document.getElementById('profile-name').innerText = currentUser.name;
  document.getElementById('profile-email').innerText = currentUser.email;
  document.getElementById('profile-avatar').innerText = currentUser.name.charAt(0).toUpperCase();

  showToast('Başarıyla giriş yapıldı! Hoş geldin, ' + currentUser.name);
  showApp();
}

function logoutUser() {
  currentUser = null;
  showToast('Çıkış yapıldı.');
  showLanding();
}

// --- SEKME GEÇİŞLERİ ---
function switchTab(tabId, btnElement) {
  activeTab = tabId;
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.add('hidden'));
  document.getElementById('tab-' + tabId).classList.remove('hidden');

  document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');
}

// --- GÖREVLER SEKMESİ & FOTOĞRAF YÜKLEME ---
function renderTasks() {
  const container = document.getElementById('tasks-list');
  container.innerHTML = '';

  tasksData.forEach(task => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-card-header">
        <div>
          <div class="item-card-title">${task.title}</div>
          <div class="item-card-desc">${task.desc}</div>
        </div>
        <span class="reward-badge">+${task.points} Puan</span>
      </div>

      ${task.image ? `
        <div class="image-preview-box" style="margin-bottom: 12px;">
          <img src="${task.image}" alt="Kanıt Fotoğrafı" />
        </div>
      ` : ''}

      <div class="composer-actions" style="border-top: none; padding-top: 0; margin-top: 8px;">
        <label class="photo-upload-label">
          📷 ${task.image ? 'Fotoğrafı Değiştir' : 'Kanıt Fotoğrafı Ekle'}
          <input type="file" accept="image/*" hidden onchange="handleTaskImage(event, ${task.id})" />
        </label>
        <button class="btn-primary btn-sm" ${task.completed ? 'disabled style="opacity:0.6"' : ''} onclick="completeTask(${task.id})">
          ${task.completed ? 'Tamamlandı ✓' : 'Görevi Tamamla'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function handleTaskImage(event, taskId) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const task = tasksData.find(t => t.id === taskId);
      if (task) {
        task.image = e.target.result;
        renderTasks();
        showToast('Kanıt fotoğrafı eklendi!');
      }
    };
    reader.readAsDataURL(file);
  }
}

function completeTask(taskId) {
  const task = tasksData.find(t => t.id === taskId);
  if (task && !task.completed) {
    task.completed = true;
    userPoints += task.points;
    userCompletedCount++;
    updateHeaderStats();
    renderTasks();
    showToast(`Tebrikler! +${task.points} Pati Puanı kazandın 🎉`);
  }
}

// --- AKIŞ (HİKAYELER) SEKMESİ ---
function previewPostImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      currentPostImageBase64 = e.target.result;
      const previewBox = document.getElementById('post-preview-box');
      const previewImg = document.getElementById('post-preview-img');
      previewImg.src = currentPostImageBase64;
      previewBox.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
}

function clearPostImage() {
  currentPostImageBase64 = null;
  document.getElementById('post-preview-box').classList.add('hidden');
  document.getElementById('post-image-input').value = '';
}

function publishPost() {
  const text = document.getElementById('post-text').value.trim();
  if (!text && !currentPostImageBase64) {
    showToast('Lütfen bir metin veya fotoğraf ekleyin.');
    return;
  }

  const newPost = {
    id: Date.now(),
    author: currentUser ? currentUser.name : 'PatiGönüllüsü',
    text: text,
    image: currentPostImageBase64,
    likes: 0,
    liked: false
  };

  feedData.unshift(newPost);
  document.getElementById('post-text').value = '';
  clearPostImage();
  renderFeed();
  showToast('Hikâyen toplulukla paylaşıldı! 🌿');
}

function renderFeed() {
  const container = document.getElementById('feed-list');
  container.innerHTML = '';

  feedData.forEach(post => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:10px;">
        <div class="avatar-circle" style="width:32px; height:32px; font-size:0.9rem; margin:0;">${post.author.charAt(0).toUpperCase()}</div>
        <strong>${post.author}</strong>
      </div>
      ${post.text ? `<p class="item-card-desc">${post.text}</p>` : ''}
      ${post.image ? `
        <div class="image-preview-box" style="margin-bottom: 12px;">
          <img src="${post.image}" alt="Gönderi Görseli" />
        </div>
      ` : ''}
      <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.85rem; color:var(--text-muted); border-top:1px solid var(--border-color); pt:8px; margin-top:8px;">
        <button onclick="likePost(${post.id})" style="background:none; border:none; cursor:pointer; color:${post.liked ? 'var(--accent)' : 'var(--text-muted)'}; font-weight:600;">
          🧡 ${post.likes} Beğeni
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function likePost(postId) {
  const post = feedData.find(p => p.id === postId);
  if (post) {
    if (post.liked) {
      post.likes--;
      post.liked = false;
    } else {
      post.likes++;
      post.liked = true;
    }
    renderFeed();
  }
}

// --- DOSTLAR SEKMESİ ---
function renderFriends() {
  const container = document.getElementById('friends-list');
  container.innerHTML = '';

  friendsData.forEach(friend => {
    const card = document.createElement('div');
    card.className = 'item-card';
    card.style.display = 'flex';
    card.style.justify0content = 'space-between';
    card.style.alignItems = 'center';
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <div class="avatar-circle" style="width:40px; height:40px; font-size:1.1rem; margin:0;">${friend.name.charAt(0)}</div>
        <div>
          <strong style="display:block; color:var(--primary); font-size:0.95rem;">${friend.name}</strong>
          <small style="color:var(--text-muted);">${friend.badge}</small>
        </div>
      </div>
      <span class="reward-badge">🐾 ${friend.points} Puan</span>
    `;
    container.appendChild(card);
  });
}

// --- MAĞAZA SEKMESİ ---
function renderShop() {
  const container = document.getElementById('shop-list');
  container.innerHTML = '';

  shopData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <span class="shop-icon">${item.icon}</span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <button class="btn-primary btn-sm btn-block" onclick="buyShopItem(${item.cost}, '${item.title}')">${item.cost} Puan</button>
    `;
    container.appendChild(card);
  });
}

function buyShopItem(cost, title) {
  if (userPoints >= cost) {
    userPoints -= cost;
    updateHeaderStats();
    showToast(`Tebrikler! "${title}" başarıyla alındı 🎁`);
  } else {
    showToast('Yeterli Pati Puanın bulunmuyor. Görevleri tamamlayarak puan kazanabilirsin!');
  }
}

// --- MİNİ OYUN (PATİ YAKALA) ---
let gameInterval = null;
let gameTimerInterval = null;
let gameScore = 0;
let timeLeft = 15;
let isGamePlaying = false;

function startMiniGame() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  gameScore = 0;
  timeLeft = 15;
  isGamePlaying = true;
  document.getElementById('game-score').innerText = gameScore;
  document.getElementById('game-timer').innerText = timeLeft;

  gameTimerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById('game-timer').innerText = timeLeft;
    if (timeLeft <= 0) {
      endMiniGame();
    }
  }, 1000);

  spawnTargetPaw();
  gameInterval = setInterval(spawnTargetPaw, 900);
}

function spawnTargetPaw() {
  if (!isGamePlaying) return;
  const board = document.getElementById('game-board');
  
  // Önceki patiyi temizle
  const oldPaw = document.getElementById('active-paw');
  if (oldPaw) oldPaw.remove();

  const paw = document.createElement('button');
  paw.id = 'active-paw';
  paw.className = 'target-paw';
  paw.innerHTML = '🐾';
  
  const maxX = board.clientWidth - 50;
  const maxY = board.clientHeight - 50;
  const randomX = Math.floor(Math.random() * Math.max(10, maxX));
  const randomY = Math.floor(Math.random() * Math.max(10, maxY));

  paw.style.left = randomX + 'px';
  paw.style.top = randomY + 'px';

  paw.onclick = () => {
    gameScore += 10;
    document.getElementById('game-score').innerText = gameScore;
    paw.remove();
  };

  board.appendChild(paw);
}

function endMiniGame() {
  isGamePlaying = false;
  clearInterval(gameInterval);
  clearInterval(gameTimerInterval);

  const board = document.getElementById('game-board');
  const earnedBonus = gameScore;
  userPoints += earnedBonus;
  updateHeaderStats();

  board.innerHTML = `
    <div style="text-align:center;">
      <h3 style="font-family:'Fraunces',serif; color:var(--primary); margin-bottom:8px;">Oyun Bitti!</h3>
      <p style="color:var(--text-muted); margin-bottom:14px;">Toplam Skor: <strong>${gameScore}</strong><br>Kazanılan Bonus: <strong>+${earnedBonus} Puan</strong></p>
      <button class="btn-primary" onclick="startMiniGame()">Tekrar Oyna</button>
    </div>
  `;
  showToast(`Tebrikler! Oyundan +${earnedBonus} Pati Puanı kazandın 🎮`);
}

// --- YARDIMCI / İSTATİSTİK GÜNCELLEME ---
function updateHeaderStats() {
  document.getElementById('header-points').innerText = userPoints;
  document.getElementById('profile-points').innerText = userPoints;
  document.getElementById('profile-completed').innerText = userCompletedCount;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.innerText = message;
  toast.classList.remove('hidden');
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}
