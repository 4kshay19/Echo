const API_URL = "http://localhost:8080";

let currentCallId = null;
let peerConnection = null;
let localStream = null;
let callTimer = null;
let callSeconds = 0;
let isMuted = false;

const rtcConfig = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

function get(id) {
    return document.getElementById(id);
}

function showCallScreen() {

    const overlay = get("callOverlay");

    if (overlay) {
        overlay.style.display = "flex";
    }

    startTimer();
}

function hideCallScreen() {

    const overlay = get("callOverlay");

    if (overlay) {
        overlay.style.display = "none";
    }
}

function showIncomingCall(call) {

    const overlay = get("incomingOverlay");
    const callUser = get("callUser");
    const callStatus = get("callStatus");

    if (!overlay) {
        return;
    }

    if (callUser) {
        callUser.textContent = call.callerId || "User A";
    }

    if (callStatus) {
        callStatus.textContent = "Incoming call...";
    }

    overlay.style.display = "flex";
}

function hideIncomingCall() {

    const overlay = get("incomingOverlay");

    if (overlay) {
        overlay.style.display = "none";
    }
}

function startTimer() {

    clearInterval(callTimer);

    callSeconds = 0;

    updateTimer();

    callTimer = setInterval(() => {

        callSeconds++;

        updateTimer();

    }, 1000);
}

function updateTimer() {

    const timer = get("callTimer");

    if (!timer) {
        return;
    }

    const minutes =
        String(Math.floor(callSeconds / 60)).padStart(2, "0");

    const seconds =
        String(callSeconds % 60).padStart(2, "0");

    timer.textContent = `${minutes}:${seconds}`;
}

function stopTimer() {

    clearInterval(callTimer);

    callTimer = null;
}

async function startMicrophone() {

    try {

        localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
        });

        console.log("Microphone access granted");

        return localStream;

    } catch (error) {

        console.error("Microphone access failed:", error);

        alert("Please allow microphone access.");

        return null;
    }
}

function createPeerConnection() {

    peerConnection = new RTCPeerConnection(rtcConfig);

    if (localStream) {

        localStream.getTracks().forEach(track => {

            peerConnection.addTrack(
                track,
                localStream
            );

        });
    }

    peerConnection.ontrack = event => {

        console.log("Remote audio received");

        let audio = get("remoteAudio");

        if (!audio) {

            audio = document.createElement("audio");

            audio.id = "remoteAudio";

            audio.autoplay = true;

            document.body.appendChild(audio);
        }

        audio.srcObject = event.streams[0];
    };

    peerConnection.onicecandidate = event => {

        if (event.candidate) {

            console.log(
                "ICE candidate generated:",
                event.candidate
            );

        }
    };

    peerConnection.onconnectionstatechange = () => {

        console.log(
            "WebRTC connection:",
            peerConnection.connectionState
        );

        if (
            peerConnection.connectionState ===
            "connected"
        ) {

            console.log("WebRTC voice connection established");
        }

        if (
            peerConnection.connectionState ===
            "failed"
        ) {

            console.error("WebRTC connection failed");
        }
    };

    console.log("WebRTC peer connection created");

    return peerConnection;
}

async function sendOfferToBackend(offer) {

    try {

        const response = await fetch(
            `${API_URL}/api/calls/${currentCallId}/offer`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(offer)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to send offer");
        }

        const call = await response.json();

        console.log(
            "WebRTC offer sent to backend:",
            call
        );

        return call;

    } catch (error) {

        console.error(
            "Offer signaling failed:",
            error
        );

        return null;
    }
}

async function sendAnswerToBackend(answer) {

    try {

        const response = await fetch(
            `${API_URL}/api/calls/${currentCallId}/answer`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(answer)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to send answer");
        }

        const call = await response.json();

        console.log(
            "WebRTC answer sent to backend:",
            call
        );

        return call;

    } catch (error) {

        console.error(
            "Answer signaling failed:",
            error
        );

        return null;
    }
}

async function getCallFromBackend(callId) {

    try {

        const response = await fetch(
            `${API_URL}/api/calls/${callId}`
        );

        if (!response.ok) {
            throw new Error("Failed to get call");
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Get call failed:",
            error
        );

        return null;
    }
}

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

        const stream = await startMicrophone();

        if (!stream) {
            return;
        }

        createPeerConnection();

        const offer =
            await peerConnection.createOffer();

        await peerConnection.setLocalDescription(
            offer
        );

        console.log(
            "WebRTC offer created:",
            offer
        );

        await sendOfferToBackend(offer);

        showCallScreen();

        console.log("Waiting for User B to accept...");

    } catch (error) {

        console.error(
            "Call start failed:",
            error
        );

        alert("Unable to start call");
    }
}

async function checkIncomingCall() {

    try {

        const response = await fetch(
            `${API_URL}/api/calls/incoming/userB`
        );

        if (
            response.status === 204 ||
            !response.ok
        ) {
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

            currentCallId = call.callId;

            showIncomingCall(call);
        }

    } catch (error) {

        console.error(
            "Incoming call check failed:",
            error
        );
    }
}

async function acceptIncomingCall() {

    try {

        if (!currentCallId) {

            console.error(
                "No active call ID"
            );

            return;
        }

        console.log(
            "Accepting call:",
            currentCallId
        );

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

        console.log(
            "Call accepted:",
            call
        );

        const stream =
            await startMicrophone();

        if (!stream) {
            return;
        }

        createPeerConnection();

        const latestCall =
            await getCallFromBackend(
                currentCallId
            );

        if (
            !latestCall ||
            !latestCall.offer
        ) {

            console.error(
                "No WebRTC offer received"
            );

            return;
        }

        console.log(
            "WebRTC offer received"
        );

        const offer =
            JSON.parse(latestCall.offer);

        await peerConnection.setRemoteDescription(
            new RTCSessionDescription(offer)
        );

        console.log(
            "Remote offer applied"
        );

        const answer =
            await peerConnection.createAnswer();

        await peerConnection.setLocalDescription(
            answer
        );

        console.log(
            "WebRTC answer created"
        );

        await sendAnswerToBackend(answer);

        hideIncomingCall();

        showCallScreen();

        console.log(
            "Call connected"
        );

    } catch (error) {

        console.error(
            "Accept call failed:",
            error
        );

        alert("Unable to accept call");
    }
}

async function rejectIncomingCall() {

    try {

        if (!currentCallId) {
            return;
        }

        const response = await fetch(
            `${API_URL}/api/calls/${currentCallId}/reject`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to reject call");
        }

        console.log("Call rejected");

        hideIncomingCall();

        currentCallId = null;

    } catch (error) {

        console.error(
            "Reject call failed:",
            error
        );
    }
}

async function endCall() {

    try {

        if (!currentCallId) {
            return;
        }

        const response = await fetch(
            `${API_URL}/api/calls/${currentCallId}/end`,
            {
                method: "POST"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to end call");
        }

        const call = await response.json();

        console.log(
            "Call ended:",
            call
        );

    } catch (error) {

        console.error(
            "End call failed:",
            error
        );

    } finally {

        stopTimer();

        hideCallScreen();

        if (peerConnection) {

            peerConnection.close();

            peerConnection = null;
        }

        if (localStream) {

            localStream.getTracks().forEach(
                track => track.stop()
            );

            localStream = null;
        }

        currentCallId = null;

        const timer = get("callTimer");

        if (timer) {
            timer.textContent = "00:00";
        }
    }
}

setInterval(
    checkIncomingCall,
    2000
);

async function toggleMute() {
    try {
        if (!localStream) {
            localStream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
        }

        const audioTrack = localStream.getAudioTracks()[0];

        isMuted = !isMuted;
        audioTrack.enabled = !isMuted;

        console.log(isMuted ? "Microphone muted" : "Microphone unmuted");

    } catch (error) {
        console.error("Microphone error:", error);
    }
}