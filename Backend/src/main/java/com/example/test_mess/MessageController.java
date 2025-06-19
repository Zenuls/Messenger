package com.example.test_mess;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageRepository repo;

    public MessageController(MessageRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Message save(@RequestBody Message msg) {
        return repo.save(msg);
    }
}