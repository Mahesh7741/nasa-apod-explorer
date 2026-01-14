package com.example.nasa.controller;

import com.example.nasa.dto.ApodResponse;
import com.example.nasa.service.ApodService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apod")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ApodController {

    private final ApodService apodService;

    @GetMapping("/today")
    public ApodResponse today() {
        return apodService.getApod(null);
    }

    @GetMapping
    public ApodResponse byDate(@RequestParam String date) {
        return apodService.getApod(date);
    }

    @GetMapping("/recent")
    public List<ApodResponse> recent(@RequestParam(defaultValue = "10") int count) {
        return apodService.getRecent(count);
    }
}
