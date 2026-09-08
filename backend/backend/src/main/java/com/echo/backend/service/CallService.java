package com.echo.backend.service;

import com.echo.backend.model.Call;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CallService {

    private final ConcurrentHashMap<String, Call> calls = new ConcurrentHashMap<>();

    public Call startCall(String callerId, String receiverId) {

        String callId = UUID.randomUUID().toString();

        Call call = new Call();

        call.setCallId(callId);
        call.setCallerId(callerId);
        call.setReceiverId(receiverId);
        call.setStatus("RINGING");

        calls.put(callId, call);

        return call;
    }

    public List<Call> getIncomingCalls(String receiverId) {

        List<Call> incomingCalls = new ArrayList<>();

        for (Call call : calls.values()) {

            if (call.getReceiverId().equals(receiverId)
                    && "RINGING".equals(call.getStatus())) {

                incomingCalls.add(call);
            }
        }

        return incomingCalls;
    }

    public Call acceptCall(String callId) {

        Call call = calls.get(callId);

        if (call == null) {
            return null;
        }

        if ("RINGING".equals(call.getStatus())) {
            call.setStatus("CONNECTED");
        }

        return call;
    }

    public Call rejectCall(String callId) {

        Call call = calls.get(callId);

        if (call == null) {
            return null;
        }

        if ("RINGING".equals(call.getStatus())) {
            call.setStatus("REJECTED");
        }

        return call;
    }

    public Call endCall(String callId) {

        Call call = calls.get(callId);

        if (call == null) {
            return null;
        }

        call.setStatus("ENDED");

        return call;
    }

    public Call getCall(String callId) {

        return calls.get(callId);
    }
    public String getOffer() {
    return offer;
}

public void setOffer(String offer) {
    this.offer = offer;
}

public String getAnswer() {
    return answer;
}

public void setAnswer(String answer) {
    this.answer = answer;
}
public Call saveOffer(String callId, String offer) {

    Call call = calls.get(callId);

    if (call == null) {
        return null;
    }

    call.setOffer(offer);

    return call;
}

public Call saveAnswer(String callId, String answer) {

    Call call = calls.get(callId);

    if (call == null) {
        return null;
    }

    call.setAnswer(answer);

    return call;
}
}