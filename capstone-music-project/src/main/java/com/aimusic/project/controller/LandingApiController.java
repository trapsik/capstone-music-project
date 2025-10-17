package com.aimusic.project.controller;

//========================================================================
//LandingApiController.java: 손님(프론트엔드)의 요청을 가장 먼저 받는 '웨이터'
//손님의 요청을 받고, 메인 셰프에게 전달하는 역할만 합니다.
//========================================================================

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.util.Map;
//필요한 import 추가
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap; // 추가

import org.springframework.web.bind.annotation.*;

import com.aimusic.project.service.LandingService;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class LandingApiController {

	// 메인 셰프(LandingService) 지정
	private final LandingService landingService;

	// AI API 호출 전용 API
	// '/feeling' 이라는 테이블로 'POST' 방식의 주문이 들어왔을 때 처리하는 방법
	@CrossOrigin(origins = "*") // CORS 설정: 모든 외부 주소에서의 요청을 허용
	@PostMapping("/feeling")
	// @RequestBody: 손님이 보낸 주문서(JSON 형식의 데이터)를 payload 변수에 담고, Map 자료형으로 변환
	public Mono<Map<String, String>> receiveFeeling(@RequestBody Map<String, String> payload) { // RedirectAttributes를 인자로 받음/ 2. 제거 
		String feeling = payload.get("feeling"); // 주문서에서 'feeling' 항목의 값을 추출
		log.info("userFeeling = {}", feeling); // 주문서 내용 로그로 출력(콘솔)
		// TODO : AI 연동 시 서비스 호출 추가 예정
		// return "사용자 감정: " + feeling;

		// 메인 셰프(landingService)에게 'forwardToAi' 요리를 해달라고 재료(feeling)를 전달
	    // 셰프가 "나중에 결과가 담길 진동벨(Mono<String>)"을 주면, 그대로 손님에게 전달
		return landingService.forwardToAi(feeling) // Mono<String> (감정 결과, 예: "기쁨") 반환
				.map(emotion -> {
					log.info("AI 분석 완료 감정: {}", emotion);
					// ----------------------------------------------------
	                // ★★★ 핵심 수정: emotion 값을 UTF-8로 인코딩 ★★★
	                // ----------------------------------------------------
	                String encodedEmotion;
	                try {
	                    encodedEmotion = URLEncoder.encode(emotion, StandardCharsets.UTF_8.toString());
	                } catch (Exception e) {
	                    log.error("URL 인코딩 실패", e);
	                    encodedEmotion = "기본"; // 인코딩 실패 시 대체 값
	                }
	                
	             // 2. 응답할 JSON 데이터 Map을 만듭니다.
					Map<String, String> response = new HashMap<>();
					// 클라이언트가 이동할 URL을 JSON 데이터에 직접 포함시킵니다.
					response.put("redirectUrl", "/recommend-pending?emotion=" + encodedEmotion); 
					response.put("emotion", emotion); // 클라이언트에서 확인용
					
					// 3. Spring이 이 Map을 JSON으로 변환하여 클라이언트에게 200 OK 응답으로 전송합니다.
					return response;
				});
	}

}
