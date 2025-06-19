package com.example.test_mess;

import com.example.test_mess.User;
import com.example.test_mess.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository repo;

    public AuthController(UserRepository repo) {
        this.repo = repo;
    }

    // Регистрация
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam String name,
            @RequestParam String lastname,
            @RequestParam String username,
            @RequestParam String birthday,
            @RequestParam String password,
            @RequestParam("avatar") MultipartFile avatarFile
    ) throws IOException {
        if (repo.findByUsername(username).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Username already exists");
        }
        User u = new User();
        u.setName(name);
        u.setLastname(lastname);
        u.setUsername(username);
        u.setBirthday(LocalDate.parse(birthday));
        u.setPassword(password);  // plain-text!
        u.setAvatar(avatarFile.isEmpty() ? null : avatarFile.getBytes());
        repo.save(u);
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(
            @RequestParam String username,
            @RequestParam String password
    ) {
        return repo.findByUsername(username)
                .filter(u -> u.getPassword().equals(password))
                // Успех — 200 OK + User
                .map(u -> ResponseEntity.ok(u))
                // Ошибка — 401 Unauthorized, без тела
                .orElseGet(() -> ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .build());
    }
}
