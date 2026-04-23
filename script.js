// Senin paylaştığın görseldeki özel Firebase bilgilerin
const firebaseConfig = {
  apiKey: "AIzaSyBtzTIQm1vvsyYZRHV6t9RsTBK3Uma6K8rA",
  authDomain: "imanpowerchat.firebaseapp.com",
  projectId: "imanpowerchat",
  storageBucket: "imanpowerchat.firebasestorage.app",
  messagingSenderId: "809946654937",
  appId: "1:809946654937:web:f34de2239ecdeb648036c8",
  measurementId: "G-EC5LJKKCPD",
  // ÖNEMLİ: Eğer veritabanını kurduysan URL şöyledir:
  databaseURL: "https://imanpowerchat-default-rtdb.firebaseio.com" 
};

// Firebase Başlatma
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
let currentUser = "";

function checkLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    
    // Teşkilat Üyeleri
    const members = { "admin": "12345", "zeki": "aslan", "berat": "ipt2026" };

    if (members[u.toLowerCase()] === p) {
        currentUser = u.toUpperCase();
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-panel').style.display = 'flex';
        listenMessages(); // Canlı mesajları dinlemeye başla
    } else {
        alert("ERİŞİM REDDEDİLDİ! Kod hatalı.");
    }
}

function showTab(id) {
    const tabs = document.getElementsByClassName('tab-content');
    for (let t of tabs) { t.style.display = 'none'; }
    document.getElementById(id).style.display = (id === 'chat-tab') ? 'flex' : 'block';
}

// MESAJ GÖNDERME (Yazma butonu burada!)
function sendLiveMessage() {
    const inp = document.getElementById('chat-message');
    if (inp.value.trim() === "") return;

    db.ref("messages").push().set({
        user: currentUser,
        text: inp.value,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });
    inp.value = "";
}

// MESAJLARI CANLI DİNLEME
function listenMessages() {
    db.ref("messages").on("child_added", (snap) => {
        const d = snap.val();
        const display = document.getElementById('chat-display');
        
        display.innerHTML += `
            <div class="msg-box">
                <span class="msg-meta">${d.user} • ${d.time}</span>
                <div class="msg-text">${d.text}</div>
            </div>
        `;
        display.scrollTop = display.scrollHeight; // Hep en alta kaydır
    });
}
