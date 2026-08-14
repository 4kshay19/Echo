package com.echo.backend.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class TranslationService {

    private final Map<String, String> englishToTamil = new HashMap<>();
    private final Map<String, String> tamilToEnglish = new HashMap<>();

    public TranslationService() {

        // English -> Tamil
        englishToTamil.put("hello", "வணக்கம்");
        englishToTamil.put("hi", "வணக்கம்");
        englishToTamil.put("good morning", "காலை வணக்கம்");
        englishToTamil.put("good night", "இனிய இரவு");
        englishToTamil.put("thank you", "நன்றி");
        englishToTamil.put("thanks", "நன்றி");
        englishToTamil.put("how are you", "எப்படி இருக்கிறீர்கள்?");
        englishToTamil.put("welcome", "வரவேற்கிறோம்");

        // Tamil -> English
        tamilToEnglish.put("வணக்கம்", "Hello");
        tamilToEnglish.put("காலை வணக்கம்", "Good morning");
        tamilToEnglish.put("இனிய இரவு", "Good night");
        tamilToEnglish.put("நன்றி", "Thank you");
        tamilToEnglish.put("எப்படி இருக்கிறீர்கள்?", "How are you?");
        tamilToEnglish.put("வரவேற்கிறோம்", "Welcome");
    }

    public String translate(
            String message,
            String sourceLanguage,
            String targetLanguage) {

        if (message == null || message.isBlank()) {
            return "[Translation unavailable]";
        }

        if (sourceLanguage.equalsIgnoreCase("en")
                && targetLanguage.equalsIgnoreCase("ta")) {

            return englishToTamil.getOrDefault(
                    message.toLowerCase(),
                    "[Translation unavailable]"
            );
        }

        if (sourceLanguage.equalsIgnoreCase("ta")
                && targetLanguage.equalsIgnoreCase("en")) {

            return tamilToEnglish.getOrDefault(
                    message.trim(),
                    "[Translation unavailable]"
            );
        }

        if (sourceLanguage.equalsIgnoreCase(targetLanguage)) {
            return message;
        }

        return "[Translation unavailable]";
    }
}