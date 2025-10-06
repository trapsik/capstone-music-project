package com.aimusic.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LandingController {

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
	 
}
