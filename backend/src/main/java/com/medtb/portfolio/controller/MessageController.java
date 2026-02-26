package com.medtb.portfolio.controller;

import com.medtb.portfolio.entity.Message;
import com.medtb.portfolio.service.MessageService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    @PostMapping
    public Message send(@RequestBody Message message) {
        return service.save(message);
    }
}
