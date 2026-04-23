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
let me = "";
let myLoc = "BİLİNMİYOR";

function checkLogin() {
    const u = document.getElementById('username').value.trim().toLowerCase();
    const p = document.getElementById('password').value;
    // Yeni İsimler
    const operators = { "güney": "123", "berat": "ipt2026", "reşit": "resit123", "mustafa": "mus123" };

    if (operators[u] === p) {
        me = u.toUpperCase();
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        document.getElementById('op-name').innerText = "👤 OP: " + me;
        startSystems();
    } else { alert("YETKİSİZ ERİŞİM!"); }
}

function startSystems() {
    // 1. Konum İsteme (Girişten Hemen Sonra)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                .then(r => r.json()).then(data => {
                    myLoc = data.address.province || data.address.city || "BİLİNMİYOR";
                    document.getElementById('op-location').innerText = "📍 " + myLoc.toUpperCase();
                    // Üst Mevki için konumu ve şifreyi DB'ye yaz
                    db.ref('presence/' + me).set({ loc: myLoc, active: true });
                });
        });
    }

    // 2. Chat ve Duyuruları Yükle
    initChat();
    initAnnouncements();
    initPresence();
}

function initPresence() {
    db.ref('presence').on('value', s => {
        document.getElementById('active-count').innerText = s.numChildren() + " AKTİF";
    });
}

function initChat() {
    db.ref("messages").limitToLast(50).on("child_added", s => {
        const d = s.val();
        const display = document.getElementById('chat-display');
        display.innerHTML += `<div class="msg-box" style="background:rgba(255,255,255,0.02); padding:10px; border-left:2px solid var(--neon);"><small>${d.u} • ${d.h}</small><div>${d.t}</div></div>`;
        display.scrollTop = display.scrollHeight;
    });
}

function sendLiveMessage() {
    const i = document.getElementById('chat-message');
    if (!i.value.trim()) return;
    db.ref("messages").push().set({ u: me, t: i.value, h: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) });
    i.value = "";
}

// ÜST MEVKİ ŞİFRELİ GİRİŞ
function unlockSecret() {
    const key = document.getElementById('secret-key').value;
    if (key === "IPT99") { // Üst Mevki Şifresi
        document.getElementById('secret-auth').style.display = 'none';
        document.getElementById('secret-content').style.display = 'grid';
        
        db.ref('presence').on('value', s => {
            const data = s.val();
            let html = "";
            for (let name in data) {
                html += `<div class="pro-card"><h4>${name}</h4><p>Konum: ${data[name].loc}</p><p>Durum: AKTİF</p></div>`;
            }
            document.getElementById('secret-content').innerHTML = html;
        });
    } else { alert("ÜST MEVKİ YETKİSİ YOK!"); }
}

function initAnnouncements() {
    const list = document.getElementById('ann-list');
    const bulten = [
        { t: "V10 PRO DEVREDE", c: "Üst Mevki paneli ve konum doğrulama aktif edildi." },
        { t: "GÜVENLİK", c: "Tüm operasyonlar kriptolu hat üzerinden izleniyor." }
    ];
    list.innerHTML = bulten.map(b => `<div class="pro-card"><h4>${b.t}</h4><p>${b.c}</p></div>`).join('');
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.n-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = (id === 'chat-tab') ? 'flex' : 'block';
    document.getElementById('btn-' + id.split('-')[0]).classList.add('active');
}
