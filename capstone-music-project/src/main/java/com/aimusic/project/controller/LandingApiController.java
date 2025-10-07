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
	
	// 사용자 감정 정보 수신 API
	@PostMapping("/feeling")
	public Mono<String> receiveFeeling(@RequestBody Map<String,String> payload) {
	    String feeling = payload.get("feeling");
		log.info("userFeeling = {}", feeling);
	    // TODO : AI 연동 시 서비스 호출 추가 예정
	    // return "사용자 감정: " + feeling;
	    
	    // 현재 주석코드: AI API base-URL 변경 시 주석 제거
	    return landingService.forwardToAi(feeling);	// AI API 호출
	}

}
