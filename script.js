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
      const task
