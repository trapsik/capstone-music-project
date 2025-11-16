package com.aimusic.project.dto;

//========================================================================
//AiRequestDto.java: AI 서버에 '요청'을 보낼 때 사용
//========================================================================

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AiRequestDto {
	// 감정 분석 요청 텍스트
	private String text;

}