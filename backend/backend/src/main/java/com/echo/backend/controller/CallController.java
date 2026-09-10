package com.echo.backend.controller;

import com.echo.backend.model.Call;
import com.echo.backend.service.CallService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/calls")
@CrossOrigin(origins = "*")
public class CallController {

    private final CallService callService;

    public CallController(CallService callService) {
        this.callService = callService;
    }

    @PostMapping("/start")
    public Call startCall(
            @RequestParam String callerId,
            @RequestParam String receiverId) {

        return callService.startCall(callerId, receiverId);
    }

    @GetMapping("/incoming/{receiverId}")
    public Call getIncomingCall(
            @PathVariable String receiverId) {

        return callService.getIncomingCall(receiverId);
    }

    @GetMapping("/{callId}")
    public Call getCall(
            @PathVariable String callId) {

        return callService.getCall(callId);
    }

    @PostMapping("/{callId}/accept")
    public Call acceptCall(
            @PathVariable String callId) {

        return callService.acceptCall(callId);
    }

    @PostMapping("/{callId}/reject")
    public Call rejectCall(
            @PathVariable String callId) {

        return callService.rejectCall(callId);
    }

    @PostMapping("/{callId}/end")
    public Call endCall(
            @PathVariable String callId) {

        return callService.endCall(callId);
    }
}