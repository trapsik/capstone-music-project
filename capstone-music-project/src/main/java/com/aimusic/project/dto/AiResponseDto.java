package com.aimusic.project.dto;

//========================================================================
//AiResponseDto.java: AI 서버로부터 '응답'을 받을 때 사용
//========================================================================

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // 외부(AI)에서 온 응답(JSON)을 객체로 만들 때 필요한 '빈 객체 생성자'
@AllArgsConstructor // 모든 필드를 매개변수로 받는 생성자
public class AiResponseDto {
	// 감정 분석 결과 필드 (성공)
	private String emotion;
	
	// 오류 발생 필드 (실패)
	private String error;
	private String traceback;
}
