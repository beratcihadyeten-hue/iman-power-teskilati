// Paylaştığın görseldeki bilgilerle güncellendi
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
let myOperatorName = "";

function checkLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const team = { "admin": "12345", "zeki": "aslan", "berat": "ipt2026" };

    if (team[u.toLowerCase()] === p) {
        myOperatorName = u.toUpperCase();
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        document.getElementById('op-name').innerText = "OPERATÖR: " + myOperatorName;
        
        // Giriş yaptıktan sonra sistemleri uyandır
        requestOperationData();
    } else {
        alert("GEÇERSİZ ERİŞİM ANAHTARI!");
    }
}

function requestOperationData() {
    // 1. GERÇEK KONUM TALEBİ
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`)
                .then(r => r.json())
                .then(data => {
                    const city = data.address.province || data.address.city || "BİLİNMİYOR";
                    document.getElementById('op-location').innerText = `📍 KONUM: ${city.toUpperCase()}`;
                });
        }, () => {
            document.getElementById('op-location').innerText = "📍 KONUM: ŞİFRELİ/GİZLİ";
        });
    }

    // 2. AKTİFLİK SİSTEMİ
    const pRef = db.ref('presence/' + myOperatorName);
    pRef.set(true);
    pRef.onDisconnect().remove();

    db.ref('presence').on('value', s => {
        document.getElementById('active-count').innerText = `${s.numChildren()} OPERATÖR AKTİF`;
    });

    // 3. SOHBET VE DUYURULARI BAŞLAT
    initLiveChat();
    initAnnouncements();
}

function initLiveChat() {
    db.ref("messages").limitToLast(30).on("child_added", snap => {
        const d = snap.val();
        const disp = document.getElementById('chat-display');
        disp.innerHTML += `
            <div class="msg-item">
                <span class="m-u">${d.u} • ${d.h}</span>
                <div class="m-t">${d.t}</div>
            </div>
        `;
        disp.scrollTop = disp.scrollHeight;
    });
}

function sendLiveMessage() {
    const inp = document.getElementById('chat-message');
    if (inp.value.trim() === "") return;
    db.ref("messages").push().set({
        u: myOperatorName,
        t: inp.value,
        h: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    inp.value = "";
}

function initAnnouncements() {
    const box = document.getElementById('ann-list');
    const bulten = [
        { t: "SİSTEM V8 PRO ON", c: "Tüm kaymalar ve bozulmalar giderildi. Konum tabanlı erişim aktif." },
        { t: "GÜVENLİK PROTOKOLÜ", c: "Firebase bağlantısı ultra güvenli moda alındı." }
    ];
    box.innerHTML = bulten.map(b => `
        <div class="pro-card" style="border-left: 4px solid var(--neon);">
            <h4>${b.t}</h4>
            <p style="font-size: 13px; color: #888; margin-top: 10px;">${b.c}</p>
        </div>
    `).join('');
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).style.display = (id === 'chat-tab') ? 'flex' : 'block';
    document.getElementById('btn-' + id.split('-')[0]).classList.add('active');
}
