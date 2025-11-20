package com.aimusic.project.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

// ★★★ 추가된 Import ★★★
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import com.aimusic.project.service.LandingService;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api")
public class LandingApiController {

    private final LandingService landingService;

    // ★★★ 추가된 부분: Flask 서버 주소 및 통신 도구 정의 ★★★
    private final RestTemplate restTemplate = new RestTemplate();
    private final String FLASK_URL = "http://43.203.93.14:5000"; 

    // 1. 감정 분석 요청 (기존 코드 유지)
    @CrossOrigin(origins = "*") 
    @PostMapping("/feeling")
    public Mono<Map<String, String>> receiveFeeling(@RequestBody Map<String, String> payload) {
        String feeling = payload.get("feeling"); 
        log.info("userFeeling = {}", feeling); 

        return landingService.forwardToAi(feeling) 
                .map(emotion -> {
                    log.info("AI 분석 완료 감정: {}", emotion);
                    String encodedEmotion;
                    try {
                        encodedEmotion = URLEncoder.encode(emotion, StandardCharsets.UTF_8.toString());
                    } catch (Exception e) {
                        log.error("URL 인코딩 실패", e);
                        encodedEmotion = "기본"; 
                    }
                    
                    Map<String, String> response = new HashMap<>();
                    response.put("redirectUrl", "/recommend-pending?emotion=" + encodedEmotion); 
                    response.put("emotion", emotion); 
                    
                    return response;
                });
    }

    // ============================================================================
    // ★★★ [신규] 음악 추천 중계 메서드 (Proxy) ★★★
    // JS(/api/music-recommend) -> Spring -> Flask(/emotion-recommend)
    // ============================================================================
    @PostMapping("/music-recommend")
    public ResponseEntity<String> proxyMusicRecommend(@RequestBody Map<String, Object> body) {
        String flaskEndpoint = FLASK_URL + "/emotion-recommend";
        log.info("Proxy 요청: Spring -> Flask (음악 추천): {}", flaskEndpoint);

        try {
            // Flask로 데이터를 그대로 토스하고, 결과를 받음
            ResponseEntity<String> response = restTemplate.postForEntity(flaskEndpoint, body, String.class);
            return response; // 받은 결과를 브라우저에게 그대로 전달
        } catch (Exception e) {
            log.error("Flask 통신 에러 (음악 추천)", e);
            return ResponseEntity.internalServerError().body("Flask Server Error");
        }
    }

    // ============================================================================
    // ★★★ [신규] 랜덤 10곡 중계 메서드 (Proxy) ★★★
    // JS(/api/random-ten) -> Spring -> Flask(/randomten)
    // ============================================================================
    @GetMapping("/random-ten")
    public ResponseEntity<String> proxyRandomTen() {
        String flaskEndpoint = FLASK_URL + "/randomten";
        log.info("Proxy 요청: Spring -> Flask (랜덤 10곡): {}", flaskEndpoint);

        try {
            String result = restTemplate.getForObject(flaskEndpoint, String.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Flask 통신 에러 (랜덤 10곡)", e);
            return ResponseEntity.internalServerError().body("Flask Server Error");
        }
    }
}