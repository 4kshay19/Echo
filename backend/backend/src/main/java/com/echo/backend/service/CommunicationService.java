package com.echo.backend.service;

import com.echo.backend.dto.CommunicationResponse;
import com.echo.backend.model.CommunicationRequest;
import org.springframework.stereotype.Service;

@Service
public class CommunicationService {

    private final TranslationService translationService;

    public CommunicationService(TranslationService translationService) {
        this.translationService = translationService;
    }

    public CommunicationResponse processMessage(
            CommunicationRequest request) {

        String translatedMessage =
                translationService.translate(
                        request.getMessage(),
                        request.getSourceLanguage(),
                        request.getTargetLanguage()
                );

        return new CommunicationResponse(
                request.getMessage(),
                translatedMessage,
                request.getSourceLanguage(),
                request.getTargetLanguage()
        );
    }
}