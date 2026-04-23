// GİRİŞ KONTROLÜ
function checkLogin() {
    const user = document.getElementById('username').value.toLowerCase();
    const pass = document.getElementById('password').value;

    const database = { "admin": "12345", "zeki": "aslan" };

    if (database[user] && database[user] === pass) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
        loadAnnouncements(); // Giriş yapınca duyuruları yükle
    } else {
        alert("ERİŞİM REDDEDİLDİ!");
    }
}

// SEKMELER
function showTab(tabId) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) { tabs[i].style.display = 'none'; }
    document.getElementById(tabId).style.display = 'block';
}

// DUYURU SİSTEMİ
const duyurular = [
    { baslik: "TEŞKİLAT KURULDU", icerik: "İmanPowerTeşkilatı dijital üssü başarıyla aktif edildi. Tüm üyelere duyurulur." },
    { baslik: "GÜVENLİK UYARISI", icerik: "Şifrelerinizi kimseyle paylaşmayın. Sinyal takibi yapılıyor." }
];

function loadAnnouncements() {
    const list = document.getElementById('announcement-list');
    list.innerHTML = "";
    duyurular.forEach(item => {
        list.innerHTML += `
            <div class="ann-card">
                <h4>${item.baslik}</h4>
                <p>${item.icerik}</p>
            </div>
        `;
    });
}
