package com.aimusic.project.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Service
public class LandingService {
	// AI API 호출용 WebClient
	private final WebClient aiWebClient;
	
	@Value("${ai.base-url:}")
	private String aiBaseUrl;	// AI API URL
	
	public String forwardToAi(String feeling) {
		// .yml에 ai.endpoint가 비어있으면 AI API 호출 안함 (임시 설정)
		if (aiBaseUrl == null || aiBaseUrl.isBlank()) {
			return "AI API URL이 설정되지 않았습니다.";
		}
		
		String payload = "{\"text\":\"" + feeling.replace("\"", "\\\"") + "\"}";
		
		// 임시 엔드포인트: "/ai-feeling" 지정 (나중에 "endpoint"로 변경)
		return aiWebClient.post()
				.uri("/ai-feeling")
				.contentType(MediaType.APPLICATION_JSON)
				.bodyValue(payload)
				.retrieve()
				.bodyToMono(String.class)
				.block();
	}
}
