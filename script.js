const firebaseConfig = {
  apiKey: "AIzaSyBtzTIQm1vvsyYZRHV6t9RsTBK3Uma6K8rA",
  authDomain: "imanpowerchat.firebaseapp.com",
  databaseURL: "https://imanpowerchat-default-rtdb.firebaseio.com", 
  projectId: "imanpowerchat",
  storageBucket: "imanpowerchat.firebasestorage.app",
  messagingSenderId: "809946654937",
  appId: "1:809946654937:web:f34de2239ecdeb648036c8"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let operator = "";

function checkLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const staff = { "admin": "12345", "zeki": "aslan", "berat": "ipt2026" };

    if (staff[u.toLowerCase()] === p) {
        operator = u.toUpperCase();
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        loadAnnouncements();
        listenMessages();
    } else {
        alert("GEÇERSİZ YETKİ!");
    }
}

function showTab(id) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let t of tabs) t.style.display = 'none';
    document.getElementById(id).style.display = (id === 'chat-tab') ? 'flex' : 'block';
}

function sendLiveMessage() {
    const input = document.getElementById('chat-message');
    if (input.value.trim() === "") return;

    db.ref("messages").push().set({
        sender: operator,
        body: input.value,
        clock: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    input.value = "";
}

function listenMessages() {
    db.ref("messages").on("child_added", (snap) => {
        const data = snap.val();
        const screen = document.getElementById('chat-display');
        screen.innerHTML += `
            <div class="msg-box">
                <div class="m-info"><span class="m-user">${data.sender}</span> • ${data.clock}</div>
                <div class="m-text">${data.body}</div>
            </div>
        `;
        screen.scrollTop = screen.scrollHeight;
    });
}

function loadAnnouncements() {
    const box = document.getElementById('ann-list');
    const news = [
        { h: "SİSTEM V6 PRO", c: "Firebase Realtime Database entegrasyonu tamamlandı." },
        { h: "DURUM RAPORU", c: "Roblox projeleri için kodlama süreci hızlandırıldı." }
    ];
    box.innerHTML = news.map(n => `<div style="border:1px solid #00ff41; padding:15px; margin-bottom:10px;"><h4>${n.h}</h4><p>${n.c}</p></div>`).join('');
}
