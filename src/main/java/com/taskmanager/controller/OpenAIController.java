package com.taskmanager.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.net.http.*;
import java.util.List;

@RestController
@RequestMapping("/api/ai")
public class OpenAIController {

    @PostMapping("/suggest")
    public ResponseEntity<String> suggestTask(@RequestBody List<String> tasks) {
        try {
            String prompt = "Suggest a new productive task for someone who already has these tasks: " + String.join(", ", tasks) + ".";
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/completions"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer sk-...MHMA") // <-- Replace with your key
                .POST(HttpRequest.BodyPublishers.ofString("{\"model\":\"text-davinci-003\",\"prompt\":\"" + prompt + "\",\"max_tokens\":30}"))
                .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return ResponseEntity.ok(response.body());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}