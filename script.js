function checkLogin() {
    const user = document.getElementById('username').value.toLowerCase();
    const pass = document.getElementById('password').value;

    // Teşkilat Üyeleri
    const database = {
        "admin": "12345",
        "zeki": "aslan",
        "berat": "ipt2026"
    };

    if (database[user] && database[user] === pass) {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        document.getElementById('display-name').innerText = "OPERATÖR: " + user.toUpperCase();
    } else {
        alert("YETKİSİZ ERİŞİM! Teşkilat dışı giriş denemesi kaydedildi.");
    }
}
