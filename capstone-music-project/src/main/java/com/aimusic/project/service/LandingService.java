package com.aimusic.project.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.aimusic.project.dto.AiRequestDto;
import com.aimusic.project.dto.AiResponseDto;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

@Slf4j
@RequiredArgsConstructor
@Service
public class LandingService {
	// AI API 호출용 WebClient
	private final WebClient aiWebClient;
	
	public Mono<String> forwardToAi(String feeling) {
		// 요청 데이터를 DTO 객체로 만들기
		AiRequestDto requestDto = new AiRequestDto(feeling);
		
		// WebClient를 사용하여 AI API에 POST 요청 보내기
		return aiWebClient.post()
				.uri("/predict") // AI API의 엔드포인트 URI로 변경
				.bodyValue(requestDto) // DTO 객체를 보내면 WebClient가 JSON으로 변환
				.retrieve()	// 응답 수신
				.bodyToMono(AiResponseDto.class) // 응답을 DTO로 변환
				.map(AiResponseDto::getEmotion); // DTO에서 "emotion" 필드 추출 후 반환
	}
}
