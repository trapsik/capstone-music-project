package com.aimusic.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor  // 매개변수가 없는 기본 생성자
@AllArgsConstructor // 모든 필드를 매개변수로 받는 생성자
public class AiResponseDto {
	// 감정 분석 결과 필드 (성공)
	private String emotion;
	
	// 오류 발생 필드 (실패)
	private String error;
	private String traceback;
}
