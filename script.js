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
let myName = "";

function checkLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const auth = { "güney": "1zksz45", "reşit": "llpr2121", "berat": "iptz2026" };

    if (auth[u.toLowerCase()] === p) {
        myName = u.toUpperCase();
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        document.getElementById('op-name').innerText = "OPERATÖR: " + myName;
        
        startSystem();
    } else { alert("YETKİSİZ ERİŞİM DENEMESİ!"); }
}

function startSystem() {
    getOperationLocation();
    updatePresence();
    listenMessages();
    loadAnnouncements();
}

// 1. GERÇEK KONUM SİSTEMİ
function getOperationLocation() {
    fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
            document.getElementById('op-location').innerText = `📍 ${data.city} / ${data.country_name}`;
        })
        .catch(() => {
            document.getElementById('op-location').innerText = "📍 KONUM: GİZLİ HAT";
        });
}

// 2. AKTİFLİK SİSTEMİ (Kimler içerde?)
function updatePresence() {
    const userRef = db.ref('presence/' + myName);
    userRef.set(true);
    userRef.onDisconnect().remove();

    db.ref('presence').on('value', snap => {
        const count = snap.numChildren();
        document.getElementById('active-count').innerText = `${count} OPERATÖR ÇEVRİMİÇİ`;
    });
}

// 3. SOHBET
function sendLiveMessage() {
    const inp = document.getElementById('chat-message');
    if (inp.value.trim() === "") return;
    db.ref("messages").push().set({
        u: myName,
        t: inp.value,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    inp.value = "";
}

function listenMessages() {
    db.ref("messages").limitToLast(20).on("child_added", snap => {
        const d = snap.val();
        const display = document.getElementById('chat-display');
        display.innerHTML += `
            <div class="msg-box">
                <div style="font-size: 10px; color: #888; margin-bottom: 5px;">${d.u} • ${d.time}</div>
                <div style="color: #fff;">${d.t}</div>
            </div>
        `;
        display.scrollTop = display.scrollHeight;
    });
}

// 4. DUYURULAR
function loadAnnouncements() {
    const list = document.getElementById('ann-list');
    const news = [
        { h: "GÜVENLİK PROTOKOLÜ", c: "Sistem V7 (Elite) sürümüne yükseltildi. Konum takibi aktif." },
        { h: "MERKEZİ EMİR", c: "Tüm operasyonlar siber terminal üzerinden yönetilecektir." }
    ];
    list.innerHTML = news.map(n => `
        <div class="project-card" style="border-left: 4px solid var(--primary);">
            <h4 style="margin:0 0 10px 0;">${n.h}</h4>
            <p style="font-size: 13px; color: #aaa;">${n.c}</p>
        </div>
    `).join('');
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = (id === 'chat-tab') ? 'flex' : 'block';
    event.currentTarget.classList.add('active');
}
