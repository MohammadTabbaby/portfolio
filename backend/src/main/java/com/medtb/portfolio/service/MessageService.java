package com.medtb.portfolio.service;

import com.medtb.portfolio.entity.Message;
import com.medtb.portfolio.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageService {

    private final MessageRepository repository;

    public MessageService(MessageRepository repository) {
        this.repository = repository;
    }

    public Message save(Message message) {
        message.setCreatedAt(LocalDateTime.now());
        return repository.save(message);
    }
    public List<Message> getAll() {
        return repository.findAll();
    }
}
