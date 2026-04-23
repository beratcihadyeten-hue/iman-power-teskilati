function checkLogin() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Buraya kendi şifrelerini ekle
    if ((user === "admin" && pass === "ipt2026") || (user === "zeki" && pass === "aslan")) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'block';
    } else {
        alert("YETKİSİZ GİRİŞ ENGELLENDİ!");
    }
}
