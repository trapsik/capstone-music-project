package com.aimusic.project.service;

//=================================================================================
//LandingService.java: 실제 핵심 로직을 처리하는 '메인 셰프'
//외부 API 호출, 데이터 가공 등 복잡한 요리를 담당합니다.
//=================================================================================

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
	
	// 'forwardToAi' 라는 이름의 요리법
	// feeling(재료)를 받아서, Mono<String>(진동벨)을 돌려줌
	public Mono<String> forwardToAi(String feeling) {
		// 1. 요청 데이터(feeling)를 DTO 객체로 만들기
		AiRequestDto requestDto = new AiRequestDto(feeling);
		
		// 2. WebClient를 사용하여 AI API에 POST 요청 보내기
		return aiWebClient.post() // POST 방식 사용
				.uri("/predict")  // AI API의 엔드포인트 URI로 변경
				.bodyValue(requestDto) // DTO 객체를 보내면 WebClient가 JSON으로 변환
				.retrieve()		  // 응답 수신
				.bodyToMono(AiResponseDto.class) // 응답을 DTO로 변환
				.map(AiResponseDto::getEmotion); // DTO에서 getEmotion()으로 "emotion" 필드 추출 후 반환
	}
}
