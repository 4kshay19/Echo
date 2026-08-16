package com.echo.backend.service;

import com.echo.backend.model.Message;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

    private final List<Message> messages = new ArrayList<>();

    public void saveMessage(Message message) {
        messages.add(message);
    }

    public List<Message> getMessagesByUser(String userId) {
        return messages.stream()
                .filter(message -> message.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public List<Message> getAllMessages() {
        return new ArrayList<>(messages);
    }
}