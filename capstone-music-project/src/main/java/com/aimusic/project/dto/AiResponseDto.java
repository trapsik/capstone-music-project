package com.aimusic.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiResponseDto {
	// 감정 분석 결과 필드 (성공)
	private String emotion;
	
	// 오류 발생 필드 (실패)
	private String error;
	private String traceback;
}
