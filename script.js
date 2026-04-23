function checkLogin() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    const auth = { "admin": "12345", "zeki": "aslan", "berat": "ipt2026" };

    if (auth[user.toLowerCase()] === pass) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        document.getElementById('op-id').innerText = "OPERATÖR: " + user.toUpperCase();
        loadAnnouncements();
    } else {
        alert("Erişim Reddedildi! Geçersiz Teşkilat Kodu.");
    }
}

function showTab(id) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let t of tabs) { t.style.display = 'none'; }
    document.getElementById(id).style.display = 'block';
}

const notifications = [
    { t: "GÜVENLİK PROTOKOLÜ", c: "Site GitHub üzerinden şifrelendi. Chat artık aktif." },
    { t: "ZEKİLER GRUBU", c: "Yeni logo ve operasyon planı 'Dosyalar' sekmesine eklenecek." }
];

function loadAnnouncements() {
    const list = document.getElementById('ann-list');
    list.innerHTML = "";
    notifications.forEach(n => {
        list.innerHTML += `<div class="ann-card"><h4>${n.t}</h4><p>${n.c}</p></div>`;
    });
}
