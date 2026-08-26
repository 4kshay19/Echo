const API_URL = "http://localhost:8080";

let peerConnection = null;
let localStream = null;
let remoteStream = null;

const rtcConfiguration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

let currentCallId = null;
let callInterval = null;
let callSeconds = 0;


// ===============================
// MESSAGE FUNCTIONS
// ===============================

function handleEnter(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
}


async function sendMessage() {

    const input = document.getElementById("messageInput");

    if (!input) {
        return;
    }

    const message = input.value.trim();

    if (!message) {
        return;
    }

    const messages = document.getElementById("messages");

    try {

        const response = await fetch(
            `${API_URL}/api/communication/message`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: "userA",
                    message: message,
                    sourceLanguage: "en",
                    targetLanguage: "ta"
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        addMessage(
            data.translatedMessage || message,
            "sent"
        );

        input.value = "";

    } catch (error) {

        console.error("Message sending failed:", error);

        addMessage(message, "sent");

        input.value = "";
    }
}


function addMessage(text, type) {

    const messages = document.getElementById("messages");

    if (!messages) {
        return;
    }

    const message = document.createElement("div");

    message.className = `message ${type}`;

    const bubble = document.createElement("div");

    bubble.className = "bubble";

    const time = new Date().toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );

    bubble.innerHTML = `
        ${escapeHTML(text)}
        <span class="time">${time}</span>
    `;

    message.appendChild(bubble);

    messages.appendChild(message);

    messages.scrollTop = messages.scrollHeight;
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


// ===============================
// START VOICE CALL
// ===============================

async function startCall() {

    if (currentCallId) {

        console.log("A call is already active");

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/calls/start?callerId=userA&receiverId=userB`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const call = await response.json();

        console.log("Call started:", call);

        currentCallId = call.callId;

        const callOverlay =
            document.getElementById("callOverlay");

        const callUser =
            document.getElementById("callUser");

        const callStatus =
            document.getElementById("callStatus");

        const callTimer =
            document.getElementById("callTimer");

        if (callUser) {

            callUser.textContent =
                call.receiverId || "User B";
        }

        if (callStatus) {

            callStatus.textContent =
                "Calling...";
        }

        if (callTimer) {

            callTimer.textContent =
                "00:00";
        }

        if (callOverlay) {

            callOverlay.style.display =
                "flex";

        } else {

            console.error(
                "callOverlay not found"
            );
        }

    } catch (error) {

        console.error(
            "Start call failed:",
            error
        );
    }
}


// ===============================
// CHECK INCOMING CALL
// ===============================

async function checkIncomingCall() {

    try {

        const response = await fetch(
            `${API_URL}/api/calls/incoming/userB`
        );

        if (!response.ok) {

            return;
        }

        const call = await response.json();

        if (
            call &&
            call.status === "RINGING" &&
            !currentCallId
        ) {

            console.log(
                "Incoming call detected:",
                call
            );

            currentCallId =
                call.callId;

            showIncomingCall(call);
        }

    } catch (error) {

        console.error(
            "Incoming call check failed:",
            error
        );
    }
}


// Check for incoming calls every 2 seconds

setInterval(
    checkIncomingCall,
    2000
);


// ===============================
// SHOW INCOMING CALL
// ===============================

function showIncomingCall(call) {

    const overlay =
        document.getElementById(
            "incomingOverlay"
        );

    const callUser =
        document.getElementById(
            "incomingCallUser"
        );

    const callStatus =
        document.getElementById(
            "incomingCallStatus"
        );

    if (!overlay) {

        console.error(
            "incomingOverlay not found"
        );

        return;
    }

    if (callUser) {

        callUser.textContent =
            call.callerId || "User A";
    }

    if (callStatus) {

        callStatus.textContent =
            "Incoming call...";
    }

    overlay.style.display =
        "flex";
}


// ===============================
// ACCEPT INCOMING CALL
// ===============================

async function acceptIncomingCall() {

    if (!currentCallId) {

        console.error(
            "No incoming call found"
        );

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/calls/${currentCallId}/accept`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const call =
            await response.json();

        console.log(
            "Call accepted:",
            call
        );

        const incomingOverlay =
            document.getElementById(
                "incomingOverlay"
            );

        if (incomingOverlay) {

            incomingOverlay.style.display =
                "none";
        }

        openCallScreen(
            call.callerId || "User A",
            "Connected"
        );

        startCallTimer();

    } catch (error) {

        console.error(
            "Accept call failed:",
            error
        );
    }
}


// ===============================
// REJECT INCOMING CALL
// ===============================

async function rejectIncomingCall() {

    if (!currentCallId) {

        console.error(
            "No incoming call found"
        );

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/calls/${currentCallId}/reject`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const call =
            await response.json();

        console.log(
            "Call rejected:",
            call
        );

        const incomingOverlay =
            document.getElementById(
                "incomingOverlay"
            );

        if (incomingOverlay) {

            incomingOverlay.style.display =
                "none";
        }

        currentCallId = null;

    } catch (error) {

        console.error(
            "Reject call failed:",
            error
        );
    }
}


// ===============================
// OPEN CALL SCREEN
// ===============================

function openCallScreen(
    user,
    status
) {

    const callOverlay =
        document.getElementById(
            "callOverlay"
        );

    const callUser =
        document.getElementById(
            "callUser"
        );

    const callStatus =
        document.getElementById(
            "callStatus"
        );

    if (callUser) {

        callUser.textContent =
            user || "User B";
    }

    if (callStatus) {

        callStatus.textContent =
            status || "Connected";
    }

    if (callOverlay) {

        callOverlay.style.display =
            "flex";
    }
}


// ===============================
// CALL TIMER
// ===============================

function startCallTimer() {

    clearInterval(
        callInterval
    );

    callSeconds = 0;

    const timer =
        document.getElementById(
            "callTimer"
        );

    if (timer) {

        timer.textContent =
            "00:00";
    }

    callInterval =
        setInterval(
            () => {

                callSeconds++;

                const minutes =
                    Math.floor(
                        callSeconds / 60
                    );

                const seconds =
                    callSeconds % 60;

                if (timer) {

                    timer.textContent =
                        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                }

            },
            1000
        );
}


// ===============================
// END CALL
// ===============================

async function endCall() {

    if (!currentCallId) {

        console.error(
            "No active call"
        );

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/calls/${currentCallId}/end`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const call =
            await response.json();

        console.log(
            "Call ended:",
            call
        );

        // Stop timer

        clearInterval(
            callInterval
        );

        callInterval = null;

        // Reset timer

        callSeconds = 0;

        const timer =
            document.getElementById(
                "callTimer"
            );

        if (timer) {

            timer.textContent =
                "00:00";
        }

        // Hide call screen

        const callOverlay =
            document.getElementById(
                "callOverlay"
            );

        if (callOverlay) {

            callOverlay.style.display =
                "none";
        }

        // Clear current call

        currentCallId = null;

    } catch (error) {

        console.error(
            "End call failed:",
            error
        );
    }
}


// ===============================
// INITIALIZATION
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "Echo frontend initialized"
        );

    }
);
async function testCallButton() {
  
    try {

        const response = await fetch(
            `${API_URL}/api/calls/start?callerId=userA&receiverId=userB`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to start call");
        }

        const call = await response.json();

        currentCallId = call.callId;

        console.log("Call started:", call);

        showCallScreen();

    } catch (error) {

        console.error("Call start failed:", error);

        alert("Unable to start call");
    }
}
function showCallScreen() {

    const overlay = document.getElementById("callOverlay");

    if (!overlay) {
        console.error("callOverlay not found");
        return;
    }

    overlay.style.display = "flex";
}
async function initializeAudio() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });

        console.log("Microphone access granted");

        localStream.getAudioTracks().forEach(track => {
            console.log("Audio track:", track.label);
        });

    } catch (error) {
        console.error("Microphone access failed:", error);
        alert("Microphone permission is required for voice calls.");
    }
}
async function testMicrophone() {
    await initializeAudio();

    if (localStream) {
        createPeerConnection();
    }
}
function createPeerConnection() {

    peerConnection = new RTCPeerConnection(rtcConfiguration);

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = event => {

        remoteStream = event.streams[0];

        console.log("Remote audio stream received");
    };

    peerConnection.onicecandidate = event => {

        if (event.candidate) {
            console.log("ICE candidate:", event.candidate);
        }
    };

    peerConnection.onconnectionstatechange = () => {

        console.log(
            "WebRTC connection state:",
            peerConnection.connectionState
        );
    };

    console.log("WebRTC peer connection created");
}
async function testCallButton() {
    console.log("Voice Call button clicked");

    try {
        const response = await fetch(
            `${API_URL}/api/calls/start?callerId=userA&receiverId=userB`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error(`Call start failed: ${response.status}`);
        }

        const call = await response.json();

        console.log("Call started:", call);

        currentCallId = call.callId;

        showCallOverlay(call);

    } catch (error) {
        console.error("Unable to start call:", error);
        alert("Unable to start call. Make sure the Echo backend is running.");
    }
}