package com.echo.backend.dto;

public class CommunicationResponse {

    private String originalMessage;
    private String translatedMessage;
    private String sourceLanguage;
    private String targetLanguage;

    public CommunicationResponse(
            String originalMessage,
            String translatedMessage,
            String sourceLanguage,
            String targetLanguage) {

        this.originalMessage = originalMessage;
        this.translatedMessage = translatedMessage;
        this.sourceLanguage = sourceLanguage;
        this.targetLanguage = targetLanguage;
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
