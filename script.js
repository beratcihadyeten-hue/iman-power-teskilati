const firebaseConfig = {
    apiKey: "AIzaSyBtzTIQm1vvsyYZRHV6t9RsTBK3Uma6K8rA",
    authDomain: "imanpowerchat.firebaseapp.com",
    projectId: "imanpowerchat",
    storageBucket: "imanpowerchat.firebasestorage.app",
    messagingSenderId: "809946654937",
    appId: "1:809946654937:web:f34de2239ecdeb648036c8",
    databaseURL: "https://imanpowerchat-default-rtdb.firebaseio.com"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let user = "";

function checkLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const team = { "admin": "12345", "zeki": "aslan", "berat": "ipt2026" };

    if (team[u.toLowerCase()] === p) {
        user = u.toUpperCase();
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        document.getElementById('op-name').innerText = "👤 OP: " + user;
        
        initPresence();
        initChat();
        getProLocation();
    } else { alert("ERİŞİM REDDEDİLDİ."); }
}

// Konumu Girişten Sonra Profesyonelce Sorar
function getProLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                .then(r => r.json())
                .then(data => {
                    const loc = data.address.province || data.address.city || "MERKEZ";
                    document.getElementById('op-location').innerText = "📍 " + loc.toUpperCase();
                });
        });
    }
}

function initPresence() {
    const ref = db.ref('presence/' + user);
    ref.set(true);
    ref.onDisconnect().remove();
    db.ref('presence').on('value', s => {
        document.getElementById('active-count').innerText = s.numChildren() + " OPERATÖR AKTİF";
    });
}

function initChat() {
    const disp = document.getElementById('chat-display');
    db.ref("messages").limitToLast(40).on("child_added", s => {
        const d = s.val();
        disp.innerHTML += `<div class="msg-item"><small>${d.u} • ${d.h}</small><div>${d.t}</div></div>`;
        disp.scrollTop = disp.scrollHeight;
    });
}

function sendLiveMessage() {
    const i = document.getElementById('chat-message');
    if (i.value.trim() === "") return;
    db.ref("messages").push().set({
        u: user, t: i.value, h: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})
    });
    i.value = "";
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = (id === 'chat-tab') ? 'flex' : 'block';
    event.currentTarget.classList.add('active');
}
