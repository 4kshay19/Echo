package com.echo.backend.service;

import org.springframework.stereotype.Service;

@Service
public class TranslationService {

    public String translate(String message, String sourceLanguage, String targetLanguage) {

        if (message == null || message.isBlank()) {
            return "[Empty message]";
        }

        if (sourceLanguage == null || targetLanguage == null) {
            return "[Language not specified]";
        }

        // Same language - no translation required
        if (sourceLanguage.equalsIgnoreCase(targetLanguage)) {
            return message;
        }

        // English -> Tamil
        if (sourceLanguage.equalsIgnoreCase("en")
                && targetLanguage.equalsIgnoreCase("ta")) {

            if (message.equalsIgnoreCase("hello")) {
                return "வணக்கம்";
            }

            if (message.equalsIgnoreCase("good morning")) {
                return "காலை வணக்கம்";
            }

            if (message.equalsIgnoreCase("thank you")) {
                return "நன்றி";
            }

            return "[Translation pending]";
        }

        // Tamil -> English
        if (sourceLanguage.equalsIgnoreCase("ta")
                && targetLanguage.equalsIgnoreCase("en")) {

            if (message.equals("வணக்கம்")) {
                return "Hello";
            }

            if (message.equals("நன்றி")) {
                return "Thank you";
            }

            if (message.equals("காலை வணக்கம்")) {
                return "Good morning";
            }

            return "[Translation pending]";
        }

        return "[Unsupported language pair]";
    }
}