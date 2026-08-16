package com.echo.backend.service;

import com.echo.backend.dto.CommunicationResponse;
import com.echo.backend.model.CommunicationRequest;
import com.echo.backend.model.Message;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommunicationService {

    private final TranslationService translationService;
    private final MessageService messageService;

    public CommunicationService(
            TranslationService translationService,
            MessageService messageService) {

        this.translationService = translationService;
        this.messageService = messageService;
    }

    public CommunicationResponse processMessage(
            CommunicationRequest request) {

        String translatedMessage = translationService.translate(
                request.getMessage(),
                request.getSourceLanguage(),
                request.getTargetLanguage()
        );

        Message message = new Message(
                request.getUserId(),
                request.getMessage(),
                translatedMessage,
                request.getSourceLanguage(),
                request.getTargetLanguage()
        );

        messageService.saveMessage(message);

        return new CommunicationResponse(
                request.getMessage(),
                translatedMessage,
                request.getSourceLanguage(),
                request.getTargetLanguage()
        );
    }

    public List<Message> getHistory(String userId) {
        return messageService.getMessagesByUser(userId);
    }
}