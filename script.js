function checkLogin() {
    const user = document.getElementById('username').value.toLowerCase();
    const pass = document.getElementById('password').value;

    // Şifreleri buradan yönetebilirsin
    if ((user === "admin" && pass === "12345") || (user === "zeki" && pass === "aslan")) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
    } else {
        alert("GEÇERSİZ KİMLİK!");
    }
}

// Sekmeler Arası Geçiş Fonksiyonu
function showTab(tabId) {
    // Önce tüm sekmeleri gizle
    const tabs = document.getElementsByClassName('tab-content');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].style.display = 'none';
    }
    // Seçilen sekmeyi göster
    document.getElementById(tabId).style.display = 'block';
}
