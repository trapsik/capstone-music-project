package com.aimusic.project.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiRequestDto {
	// 감정 분석 요청 텍스트
	private String text;

}
