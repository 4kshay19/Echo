package com.echo.backend.service;

import com.echo.backend.model.Call;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CallService {

    private final Map<String, Call> calls = new ConcurrentHashMap<>();

    public Call startCall(String callerId, String receiverId) {

        String callId = UUID.randomUUID().toString();

        Call call = new Call(
                callId,
                callerId,
                receiverId,
                "RINGING"
        );

        calls.put(callId, call);

        return call;
    }

    public Call acceptCall(String callId) {

        Call call = getCall(callId);

        call.setStatus("CONNECTED");

        return call;
    }

    public Call rejectCall(String callId) {

        Call call = getCall(callId);

        call.setStatus("REJECTED");

        return call;
    }

    public Call endCall(String callId) {

        Call call = getCall(callId);

        call.setStatus("ENDED");

        return call;
    }

    public Call getCall(String callId) {

        Call call = calls.get(callId);

        if (call == null) {
            throw new RuntimeException("Call not found: " + callId);
        }

        return call;
    }
}