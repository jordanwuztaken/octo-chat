// --- CONFIGURATION ---
// 1. Go to firebase.google.com and create a new project.
// 2. Add a "Web App" to get your config.
// 3. Enable "Realtime Database" in the console and set rules to "read: true, write: true" (for testing).
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

let currentUser = "";

// --- LOGIN LOGIC ---
function login() {
    const input = document.getElementById("usernameInput");
    const name = input.value.trim();
    
    if (name) {
        currentUser = name;
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("chatScreen").style.display = "flex";
        loadMessages();
    } else {
        alert("Please enter a username!");
    }
}

// --- SEND MESSAGE ---
function sendMessage(event) {
    event.preventDefault();
    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if (text !== "") {
        db.ref("chat").push({
            username: currentUser,
            message: text,
            timestamp: Date.now()
        });
        input.value = "";
    }
}

// --- RECEIVE MESSAGES ---
function loadMessages() {
    const messageList = document.getElementById("messagesList");
    
    // Listen for new child added to 'chat' node
    db.ref("chat").limitToLast(50).on("child_added", (snapshot) => {
        const data = snapshot.val();
        const msgDiv = document.createElement("div");
        
        // Add classes for styling
        msgDiv.classList.add("message");
        if (data.username === currentUser) {
            msgDiv.classList.add("self");
        }

        // Construct HTML content (sanitize inputs in a real app!)
        msgDiv.innerHTML = `<span class="user">${data.username}</span>${data.message}`;
        
        messageList.appendChild(msgDiv);
        messageList.scrollTop = messageList.scrollHeight; // Auto scroll to bottom
    });
}

function logout() {
    location.reload();
}
