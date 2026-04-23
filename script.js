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
let user = "";
let pass = ""; // Üst mevki için saklayacağız

function checkLogin() {
    const u = document.getElementById('username').value.trim().toLowerCase();
    const p = document.getElementById('password').value;
    const team = { "güney": "123", "berat": "ipt2026", "reşit": "resit123", "mustafa": "mus123" };

    if (team[u] === p) {
        user = u.toUpperCase();
        pass = p;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        document.getElementById('op-name').innerText = "👤 OP: " + user;
        
        setupTeşkilat();
    } else { alert("YETKİSİZ ERİŞİM!"); }
}

function setupTeşkilat() {
    // 1. GERÇEK KONUM VE DB KAYDI
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                .then(r => r.json()).then(data => {
                    const city = data.address.province || data.address.city || "MERKEZ";
                    document.getElementById('op-location').innerText = "📍 " + city.toUpperCase();
                    
                    // Veritabanına aktiflik ve veri gönder
                    const ref = db.ref('presence/' + user);
                    ref.set({ loc: city, p: pass, last: new Date().toLocaleTimeString() });
                    ref.onDisconnect().remove();
                });
        }, () => {
            // Konum kapalıysa varsayılan yaz
            db.ref('presence/' + user).set({ loc: "GİZLİ", p: pass, last: "AKTİF" });
        });
    }

    // 2. AKTİFLİK SAYACI
    db.ref('presence').on('value', s => {
        document.getElementById('active-count').innerText = (s.numChildren() || 0) + " OPERATÖR AKTİF";
    });

    // 3. CHAT SİSTEMİ
    initChat();
    initAnnouncements();
}

function initChat() {
    db.ref("messages").limitToLast(50).on("child_added", s => {
        const d = s.val();
        const disp = document.getElementById('chat-display');
        disp.innerHTML += `<div class="msg" style="border-bottom:1px solid rgba(0,255,65,0.05); padding:10px 0;"><small style="color:#666">${d.u} • ${d.h}</small><div style="color:#fff">${d.t}</div></div>`;
        disp.scrollTop = disp.scrollHeight;
    });
}

function sendLiveMessage() {
    const i = document.getElementById('chat-message');
    if (!i.value.trim()) return;
    db.ref("messages").push().set({ u: user, t: i.value, h: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) });
    i.value = "";
}

// ÜST MEVKİ SİSTEMİ (TAMİR EDİLDİ)
function unlockSecret() {
    const key = document.getElementById('secret-key').value;
    if (key === "IPT99") {
        document.getElementById('secret-lock').style.display = 'none';
        document.getElementById('secret-data').style.display = 'grid';
        
        db.ref('presence').on('value', s => {
            const data = s.val();
            let html = "";
            for (let name in data) {
                html += `<div class="m-card" style="border-left:3px solid #ff003c;">
                            <h4>${name}</h4>
                            <p>Konum: ${data[name].loc}</p>
                            <p>Şifre: ${data[name].p}</p>
                            <small>Son Görülme: ${data[name].last}</small>
                         </div>`;
            }
            document.getElementById('secret-data').innerHTML = html;
        });
    } else { alert("ERİŞİM REDDEDİLDİ!"); }
}

function initAnnouncements() {
    const list = document.getElementById('ann-list');
    const news = [{ t: "SİSTEM V11 AKTİF", c: "Tüm hatalar giderildi, Üst Mevki paneli optimize edildi." }];
    list.innerHTML = news.map(n => `<div class="m-card"><h4>${n.t}</h4><p>${n.c}</p></div>`).join('');
}

function showTab(id) {
    document.querySelectorAll('.tab-pane').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = (id === 'chat-tab') ? 'flex' : 'block';
    document.getElementById('btn-' + id.split('-')[0]).classList.add('active');
}
