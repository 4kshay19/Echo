package com.echo.backend.model;

public class Call {

    private String callId;
    private String callerId;
    private String receiverId;
    private String status;

    public Call() {
    }

    public Call(
            String callId,
            String callerId,
            String receiverId,
            String status) {

        this.callId = callId;
        this.callerId = callerId;
        this.receiverId = receiverId;
        this.status = status;
    }

    public String getCallId() {
        return callId;
    }

    public void setCallId(String callId) {
        this.callId = callId;
    }

    public String getCallerId() {
        return callerId;
    }

    public void setCallerId(String callerId) {
        this.callerId = callerId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}