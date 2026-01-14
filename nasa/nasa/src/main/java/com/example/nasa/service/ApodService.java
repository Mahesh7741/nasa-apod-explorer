package com.example.nasa.service;


import com.example.nasa.dto.ApodResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApodService {
    private final WebClient webClient;
    @Value("${nasa.api.key}")
    private String apiKey;

    @Cacheable(value = "apod", key = "#date != null ? #date : 'today'")
    public ApodResponse getApod(String date) {
        return webClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.scheme("https")
                            .host("api.nasa.gov")
                            .path("/planetary/apod")
                            .queryParam("api_key", apiKey);
                    if (date != null) {
                        uriBuilder.queryParam("date", date);
                    }
                    return uriBuilder.build();
                })
                .retrieve()
                .bodyToMono(ApodResponse.class)
                .block();
    }

    @Cacheable(value = "apod-recent", key = "#count")
    public List<ApodResponse> getRecent(int count) {
        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host("api.nasa.gov")
                        .path("/planetary/apod")
                        .queryParam("api_key", apiKey)
                        .queryParam("count", count)
                        .build())
                .retrieve()
                .bodyToFlux(ApodResponse.class)
                .collectList()
                .block();
    }
}
