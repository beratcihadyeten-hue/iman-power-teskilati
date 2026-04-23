/* Firebase Ayarların Olduğu Gibi Duruyor */
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
let userPass = "";

function checkLogin() {
    const u = document.getElementById('username').value.trim().toLowerCase();
    const p = document.getElementById('password').value;
    // İstediğin isimler ve şifreler onarıldı
    const team = { "güney": "123", "berat": "ipt2026", "reşit": "resit123", "mustafa": "mus123" };

    if (team[u] === p) {
        user = u.toUpperCase();
        userPass = p;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        document.getElementById('op-name').innerText = "👤 OP: " + user;
        startTeşkilat();
    } else { alert("YETKİSİZ ERİŞİM!"); }
}

function startTeşkilat() {
    // MOBİL KONUM ONARIMI (GPS + IP Yedekli)
    function setLoc(city) {
        const c = city.toUpperCase();
        document.getElementById('op-location').innerText = "📍 " + c;
        const ref = db.ref('presence/' + user);
        ref.set({ loc: c, p: userPass, last: new Date().toLocaleTimeString() });
        ref.onDisconnect().remove();
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                .then(r => r.json()).then(d => setLoc(d.address.province || d.address.city || "MERKEZ"))
                .catch(() => fallback());
        }, () => fallback());
    } else { fallback(); }

    function fallback() {
        fetch('https://ipapi.co/json/').then(r => r.json())
            .then(d => setLoc(d.city)).catch(() => setLoc("GİZLİ"));
    }

    // AKTİFLİK VE CHAT SİSTEMİ
    db.ref('presence').on('value', s => {
        document.getElementById('active-count').innerText = (s.numChildren() || 0) + " AKTİF";
    });
    
    db.ref("messages").limitToLast(50).on("child_added", s => {
        const d = s.val();
        const display = document.getElementById('chat-display');
        display.innerHTML += `<div class="msg"><small>${d.u}</small><div>${d.t}</div></div>`;
        // Mobilde otomatik en aşağı kaydırma onarıldı
        setTimeout(() => { display.scrollTop = display.scrollHeight; }, 100);
    });
}

function sendLiveMessage() {
    const i = document.getElementById('chat-message');
    if (!i.value.trim()) return;
    db.ref("messages").push().set({ u: user, t: i.value, h: new Date().toLocaleTimeString() });
    i.value = "";
}

function showTab(id) {
    document.querySelectorAll('.tab-pane').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).style.display = (id === 'chat-tab') ? 'flex' : 'block';
    document.getElementById('btn-' + id.split('-')[0]).classList.add('active');
}

/* Üst Mevki Şifre Onarımı */
function unlockSecret() {
    if (document.getElementById('secret-key').value === "IPT99") {
        document.getElementById('secret-lock').style.display = 'none';
        document.getElementById('secret-data').style.display = 'grid';
        db.ref('presence').on('value', s => {
            const data = s.val();
            let h = "";
            for (let n in data) h += `<div style="border:1px solid var(--neon); padding:10px; margin:5px;"><h4>${n}</h4><p>Konum: ${data[n].loc}</p><p>Pass: ${data[n].p}</p></div>`;
            document.getElementById('secret-data').innerHTML = h;
        });
    } else { alert("ŞİFRE HATALI!"); }
}
