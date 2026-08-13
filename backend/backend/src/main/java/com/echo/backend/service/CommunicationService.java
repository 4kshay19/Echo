package com.echo.backend.service;

import com.echo.backend.dto.CommunicationResponse;
import com.echo.backend.model.CommunicationRequest;
import org.springframework.stereotype.Service;

@Service
public class CommunicationService {

    public CommunicationResponse processMessage(
            CommunicationRequest request) {

        String translatedMessage =
                "[Translation pending] " + request.getMessage();

        return new CommunicationResponse(
                request.getMessage(),
                translatedMessage,
                request.getSourceLanguage(),
                request.getTargetLanguage()
        );
    }
}