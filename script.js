function checkLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    // Şifre Listesi
    const members = { "admin": "12345", "zeki": "aslan", "berat": "ipt2026" };

    if (members[user.toLowerCase()] === pass) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
        document.getElementById('op-name').innerText = "OPERATÖR: " + user.toUpperCase();
        loadAnnouncements();
    } else {
        alert("YETKİSİZ ERİŞİM! Sinyal Kesildi.");
    }
}

function showTab(id) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let t of tabs) { t.style.display = 'none'; }
    document.getElementById(id).style.display = 'block';
}

const duyurular = [
    { baslik: "SİSTEM GÜNCELLENDİ (V3)", icerik: "Chat yazma sorunu çözüldü, yeni butonlar eklendi." },
    { baslik: "OPERASYON EMRİ", icerik: "Zekiler ekibi GitHub üzerinde toplanıyor." }
];

function loadAnnouncements() {
    const box = document.getElementById('ann-list');
    box.innerHTML = "";
    duyurular.forEach(d => {
        box.innerHTML += `<div class="ann-item"><h3>${d.baslik}</h3><p>${d.icerik}</p></div>`;
    });
}
