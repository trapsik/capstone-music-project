package com.aimusic.project.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model; // Model import 추가
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

@Controller
public class LandingController {

	// API 통신을 위한 RestTemplate 인스턴스 (필요 시 빈으로 등록하여 사용)
    private final RestTemplate restTemplate = new RestTemplate();
    private final String RECOMMEND_API_URL = "http://43.203.93.14:5000/emotion-recommend";
	
	// 랜딩 페이지
    @GetMapping("/")
    public String landingPage() {
        return "landing-ai-studio"; // '/' 루트 경로로 코드 변경 -> http://localhost:8088으로 접속
    }
    
	// 회원가입 페이지
	@GetMapping("/signup")
	public String signupPage() {
		return "signup"; // signup.html 호출
	}
	
	/*
	 * // 음악추천대기 페이지
	 * 
	 * @GetMapping("/recommend-pending") public String recommendPendingPage() { //
	 * Thymeleaf/JSP 등의 템플릿 엔진이 templates 폴더에서 "landing-product.html"을 찾습니다. return
	 * "landing-product"; }
	 */
	// 음악추천대기 페이지
		@GetMapping("/recommend-pending")
	 	public String recommendPendingPage(
	 			@RequestParam(name = "emotion", defaultValue = "기본") String analyzedEmotion, Model model) {
	        
	        // Model에 이미 담겨있는 Flash Attribute(감정)를 가져옵니다.
	        // 만약 Flash Attribute에 감정이 없다면 기본값("기본")을 사용합니다.
	        // String analyzedEmotion = (String) model.asMap().getOrDefault("analyzedEmotion", "기본");
	        
	        // 감정에 따른 텍스트 결정 로직
	        String emotionPhrase;
	        String recommendationPhrase;
	        
	        switch (analyzedEmotion) {
	            case "기쁨":
	                emotionPhrase = "오늘 즐겁고 행복하신 것 같아요.";
	                recommendationPhrase = "밝고 신나는 분위기의 음악";
	                break;
	            case "슬픔":
	                emotionPhrase = "오늘 많이 힘드셨군요.";
	                recommendationPhrase = "잔잔하고 위로가 되는 음악";
	                break;
	            case "분노":
	                emotionPhrase = "무슨 일 때문에 화가 나셨나요?";
	                recommendationPhrase = "스트레스를 해소할 강렬한 음악";
	                break;
	            case "편안":
	                emotionPhrase = "잔잔하고 여유로우신가요";
	                recommendationPhrase = "고요하고 릴렉스되는 음악";
	                break;
	            case "신남":
	                emotionPhrase = "활기찬 에너지가 넘치시네요.";
	                recommendationPhrase = "리듬감 좋은 파워풀한 음악";
	                break;
	            case "비장":
	                emotionPhrase = "중요한 일을 앞두셨나요?";
	                recommendationPhrase = "웅장하고 결연한 음악";
	                break;
	            case "감동":
	                emotionPhrase = "가슴 깊이 울림있는 하루였군요.";
	                recommendationPhrase = "여운이 남는 깊은 감성 음악";
	                break;
	            case "당황":
	                emotionPhrase = "예상치 못한 일에 정신없는 하루였군요.";
	                recommendationPhrase = "집중력을 높여줄 깔끔한 음악";
	                break;
	            case "상처":
	                emotionPhrase = "마음 아픈 일이 많으셨네요.";
	                recommendationPhrase = "마음을 치유할 수 있는 부드러운 음악";
	                break;
	            case "불안":
	                emotionPhrase = "가슴 한편이 조마조마한 하루였네요.";
	                recommendationPhrase = "마음을 다독여주는 차분한 음악";
	                break;
	            default:
	                // 감정 분석 실패 또는 '기본' 값일 경우
	                emotionPhrase = "괜찮으신가요";
	                recommendationPhrase = "당신의 감정에 맞는 음악";
	                break;
	        }

	        // Thymeleaf 템플릿으로 전달
	        model.addAttribute("emotionPhrase", emotionPhrase);
	        model.addAttribute("recommendationPhrase", recommendationPhrase);
	        model.addAttribute("analyzedEmotion", analyzedEmotion);
	        
	 		return "landing-product"; 
	 	}
	 
		// 음악 추천 결과 페이지
	    @GetMapping("/recommend-result")
	    public String recommendResultPage(
	            @RequestParam(name = "emotion") String analyzedEmotion, Model model) {
	    	
	    	// 1. 감정에 따른 추천 문구 결정 로직 (기존 /recommend-pending 로직 재사용)
	        String recommendationPhrase;
	        
	        switch (analyzedEmotion) {
	            case "기쁨":
	                recommendationPhrase = "기분이 좋은";
	                break;
	            case "슬픔":
	                recommendationPhrase = "위로가 필요한";
	                break;
	            case "분노":
	                recommendationPhrase = "스트레스 해소가 필요한";
	                break;
	            case "편안":
	                recommendationPhrase = "잔잔하고 여유로운";
	                break;
	            case "신남":
	                recommendationPhrase = "활기찬 에너지가 넘치는";
	                break;
	            case "비장":
	                recommendationPhrase = "결의를 다지는";
	                break;
	            case "감동":
	                recommendationPhrase = "가슴 벅찬";
	                break;
	            case "당황":
	                recommendationPhrase = "생각지도 못한 하루를 보낸";
	                break;
	            case "상처":
	                recommendationPhrase = "마음에 치유가 필요한";
	                break;
	            case "불안":
	                recommendationPhrase = "평온함을 찾는";
	                break;
	            default:
	                recommendationPhrase = "당신의 감정에 맞는 음악을";
	                break;
	        }

	        // 2. Thymeleaf 템플릿으로 전달
	        model.addAttribute("analyzedEmotion", analyzedEmotion);
	        model.addAttribute("recommendationPhrase", recommendationPhrase);
	        
	        
	        // 새로운 음악 추천 결과 템플릿 반환
	        return "landing-product2"; 
	    }
}
