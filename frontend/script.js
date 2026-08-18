const API_URL = "http://localhost:8080";

let currentCallId = null;
let localStream = null;
let peerConnection = null;

const configuration = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

async function startCall() {

    try {

        const response = await fetch(
            `${API_URL}/api/calls/start?callerId=userA&receiverId=userB`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error("Unable to start call");
        }

        const call = await response.json();

        currentCallId = call.callId;

        console.log("Call started:", call);

        openCallScreen("Calling...");

        await initializeAudio();

    } catch (error) {

        console.error(error);

        alert(
            "Unable to start call. Make sure the backend is running."
        );
    }
}


async function initializeAudio() {

    try {

        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });

        console.log("Microphone access granted");

        peerConnection = new RTCPeerConnection(configuration);

        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(
                track,
                localStream
            );
        });

        peerConnection.onicecandidate = event => {

            if (event.candidate) {

                console.log(
                    "ICE Candidate:",
                    event.candidate
                );

            }

        };

        peerConnection.onconnectionstatechange = () => {

            console.log(
                "Connection state:",
                peerConnection.connectionState
            );

            if (
                peerConnection.connectionState === "connected"
            ) {

                updateCallStatus("Connected");

            }

        };

    } catch (error) {

        console.error(
            "Microphone error:",
            error
        );

        alert(
            "Microphone permission is required for voice calls."
        );
    }
}


async function acceptCall() {

    if (!currentCallId) {
        console.error("No active call");
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
            throw new Error("Unable to accept call");
        }

        const call = await response.json();

        console.log(
            "Call accepted:",
            call
        );

        updateCallStatus("Connected");

    } catch (error) {

        console.error(error);

        alert(
            "Unable to accept call."
        );
    }
}


async function endCall() {

    try {

        if (currentCallId) {

            await fetch(
                `${API_URL}/api/calls/${currentCallId}/end`,
                {
                    method: "POST"
                }
            );
        }

    } catch (error) {

        console.error(error);

    } finally {

        if (localStream) {

            localStream.getTracks().forEach(
                track => track.stop()
            );

            localStream = null;
        }

        if (peerConnection) {

            peerConnection.close();

            peerConnection = null;
        }

        currentCallId = null;

        closeCallScreen();
    }
}


function openCallScreen(status) {

    const overlay =
        document.getElementById("callOverlay");

    const callStatus =
        document.getElementById("callStatus");

    if (overlay) {
        overlay.classList.add("active");
    }

    if (callStatus) {
        callStatus.textContent = status;
    }
}


function closeCallScreen() {

    const overlay =
        document.getElementById("callOverlay");

    if (overlay) {
        overlay.classList.remove("active");
    }
}


function updateCallStatus(status) {

    const callStatus =
        document.getElementById("callStatus");

    if (callStatus) {
        callStatus.textContent = status;
    }
}


async function sendMessage() {

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();

    if (!message) {
        return;
    }

    const messages =
        document.getElementById("messages");

    const messageElement =
        document.createElement("div");

    messageElement.className =
        "message sent";

    messageElement.innerHTML = `
        <div class="bubble">
            ${message}
            <span class="time">
                ${new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })}
            </span>
        </div>
    `;

    messages.appendChild(messageElement);

    input.value = "";

    messages.scrollTop =
        messages.scrollHeight;
}


function handleEnter(event) {

    if (event.key === "Enter") {
        sendMessage();
    }
}

function addAttachment() {

    alert("Attachment feature will be added in a future step.");
}


function startVoiceInput() {

    if (!("webkitSpeechRecognition" in window)) {

        alert(
            "Voice input is not supported in this browser."
        );

        return;
    }

    const recognition =
        new webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.start();

    recognition.onresult = function(event) {

        const transcript =
            event.results[0][0].transcript;

        document.getElementById("messageInput").value =
            transcript;
    };
}

async function getMicrophone() {

    try {

        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });

        console.log("Microphone access granted");

        return localStream;

    } catch (error) {

        console.error("Microphone error:", error);

        alert(
            "Microphone permission is required for voice calls."
        );

        throw error;
    }
}

function createPeerConnection() {

    peerConnection = new RTCPeerConnection(rtcConfig);

    peerConnection.onicecandidate = function(event) {

        if (event.candidate) {

            console.log(
                "ICE candidate:",
                event.candidate
            );
        }
    };

    peerConnection.ontrack = function(event) {

        console.log("Remote audio received");

        let audio =
            document.getElementById("remoteAudio");

        if (!audio) {

            audio =
                document.createElement("audio");

            audio.id = "remoteAudio";
            audio.autoplay = true;

            document.body.appendChild(audio);
        }

        audio.srcObject = event.streams[0];
    };

    peerConnection.onconnectionstatechange = function() {

        console.log(
            "Connection state:",
            peerConnection.connectionState
        );

        if (
            peerConnection.connectionState ===
            "connected"
        ) {

            document.getElementById(
                "callStatus"
            ).textContent = "Connected";
        }
    };

    return peerConnection;
}

async function acceptIncomingCall() {

    if (!currentCallId) {
        alert("No incoming call found.");
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
            throw new Error("Failed to accept call");
        }

        const call = await response.json();

        console.log("Call accepted:", call);

        document
            .getElementById("incomingOverlay")
            .classList.remove("active");

        openCallScreen("Connected");

        await initializeAudio();

    } catch (error) {

        console.error(error);

        alert("Unable to accept call.");

    }
}

async function rejectIncomingCall() {

    if (currentCallId) {

        try {

            await fetch(
                `${API_URL}/api/calls/${currentCallId}/end`,
                {
                    method: "POST"
                }
            );

        } catch (error) {

            console.error(error);

        }
    }

    document
        .getElementById("incomingOverlay")
        .classList.remove("active");

    currentCallId = null;
}

let incomingCallCheck = null;

function startIncomingCallCheck() {

    if (incomingCallCheck) {
        clearInterval(incomingCallCheck);
    }

    incomingCallCheck = setInterval(async () => {

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
                call.callId &&
                call.status === "RINGING"
            ) {

                currentCallId = call.callId;

                showIncomingCall();

            }

        } catch (error) {

            console.log(
                "Incoming call check:",
                error
            );

        }

    }, 2000);
}


function showIncomingCall() {

    const overlay =
        document.getElementById("incomingOverlay");

    if (overlay) {
        overlay.classList.add("active");
    }
}


function stopIncomingCallCheck() {

    if (incomingCallCheck) {

        clearInterval(incomingCallCheck);

        incomingCallCheck = null;
    }
}


window.addEventListener(
    "load",
    () => {

        startIncomingCallCheck();

    }
);
