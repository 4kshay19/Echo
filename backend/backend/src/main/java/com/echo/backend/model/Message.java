package com.echo.backend.model;

public class Message {

    private String userId;
    private String originalMessage;
    private String translatedMessage;
    private String sourceLanguage;
    private String targetLanguage;

    public Message(
            String userId,
            String originalMessage,
            String translatedMessage,
            String sourceLanguage,
            String targetLanguage) {

        this.userId = userId;
        this.originalMessage = originalMessage;
        this.translatedMessage = translatedMessage;
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
    }

    public String getUserId() {
        return userId;
    }

    public String getOriginalMessage() {
        return originalMessage;
    }

    public String getTranslatedMessage() {
        return translatedMessage;
    }

    public String getSourceLanguage() {
        return sourceLanguage;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }
}