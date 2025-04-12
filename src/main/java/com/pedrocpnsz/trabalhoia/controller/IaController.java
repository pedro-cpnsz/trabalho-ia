package com.pedrocpnsz.trabalhoia.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/ia")
public class IaController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/chat")
    public ResponseEntity<String> perguntar(@RequestBody Map<String, String> body) {
        String prompt = body.get("prompt");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> payload = new HashMap<>();
        payload.put("prompt", prompt);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

        String resposta = restTemplate.postForObject("http://localhost:5000/prompt", request, String.class);
        return ResponseEntity.ok(resposta);
    }
}

