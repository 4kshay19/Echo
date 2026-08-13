package com.echo.backend.controller;

import com.echo.backend.dto.CommunicationResponse;
import com.echo.backend.model.CommunicationRequest;
import com.echo.backend.service.CommunicationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/communication")
public class CommunicationController {

    private final CommunicationService communicationService;

    public CommunicationController(
            CommunicationService communicationService) {

        this.communicationService = communicationService;
    }

    @PostMapping("/message")
    public CommunicationResponse sendMessage(
            @RequestBody CommunicationRequest request) {

        return communicationService.processMessage(request);
    }
}