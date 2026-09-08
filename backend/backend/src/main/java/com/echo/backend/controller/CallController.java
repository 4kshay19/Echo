package com.echo.backend.controller;

import com.echo.backend.model.Call;
import com.echo.backend.service.CallService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calls")
@CrossOrigin(origins = "*")
public class CallController {

    private final CallService callService;

    public CallController(CallService callService) {
        this.callService = callService;
    }

    @PostMapping("/start")
    public ResponseEntity<Call> startCall(
            @RequestParam String callerId,
            @RequestParam String receiverId) {

        Call call = callService.startCall(callerId, receiverId);

        return ResponseEntity.ok(call);
    }

    @GetMapping("/incoming/{receiverId}")
    public ResponseEntity<?> getIncomingCall(
            @PathVariable String receiverId) {

        List<Call> calls = callService.getIncomingCalls(receiverId);

        if (calls == null || calls.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(calls.get(0));
    }

    @PostMapping("/{callId}/accept")
    public ResponseEntity<Call> acceptCall(
            @PathVariable String callId) {

        Call call = callService.acceptCall(callId);

        if (call == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(call);
    }

    @PostMapping("/{callId}/reject")
    public ResponseEntity<Call> rejectCall(
            @PathVariable String callId) {

        Call call = callService.rejectCall(callId);

        if (call == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(call);
    }

    @PostMapping("/{callId}/end")
    public ResponseEntity<Call> endCall(
            @PathVariable String callId) {

        Call call = callService.endCall(callId);

        if (call == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(call);
    }
    @PostMapping("/{callId}/offer")
public ResponseEntity<Call> saveOffer(
        @PathVariable String callId,
        @RequestBody String offer) {

    Call call = callService.saveOffer(callId, offer);

    if (call == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(call);
}

@PostMapping("/{callId}/answer")
public ResponseEntity<Call> saveAnswer(
        @PathVariable String callId,
        @RequestBody String answer) {

    Call call = callService.saveAnswer(callId, answer);

    if (call == null) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.ok(call);
}
}