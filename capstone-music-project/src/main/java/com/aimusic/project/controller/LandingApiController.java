package com.aimusic.project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.aimusic.project.service.LandingService;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class LandingApiController {

	private final LandingService landingService;

	// AI API 호출 전용 API
	@CrossOrigin(origins = "*") // CORS 설정: 모든 외부 주소에서의 요청을 허용
	@PostMapping("/feeling")
	// @RequestBody: JSON 형식의 데이터를 payload 변수에 담고, Map 자료형으로 변환
	public Mono<String> receiveFeeling(@RequestBody Map<String, String> payload) {
		String feeling = payload.get("feeling"); // 'feeling' 항목의 값을 추출
		log.info("userFeeling = {}", feeling); // 로그로 출력(콘솔)
		// TODO : AI 연동 시 서비스 호출 추가 예정
		// return "사용자 감정: " + feeling;

		// LadingService의 forwardToAi 메소드 호출
		return landingService.forwardToAi(feeling);
	}

}
