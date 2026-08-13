package com.echo.backend.model;

public class CommunicationRequest {

    private String userId;
    private String message;
    private String sourceLanguage;
    private String targetLanguage;

    public CommunicationRequest() {
    }

    public CommunicationRequest(
            String userId,
            String message,
            String sourceLanguage,
            String targetLanguage) {

        this.userId = userId;
        this.message = message;
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSourceLanguage() {
        return sourceLanguage;
    }

    public void setSourceLanguage(String sourceLanguage) {
        this.sourceLanguage = sourceLanguage;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public void setTargetLanguage(String targetLanguage) {
        this.targetLanguage = targetLanguage;
    }
}