package com.aimusic.project.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class LandingController {

    @GetMapping("/landing")
    public String landingPage() {
        return "landing-ai-studio"; // http://localhost:8088/landing으로 접속
    }
    
    @GetMapping("/signup")
    public String signupPage() {
        return "signup";  // signup.html 호출
    }
}
