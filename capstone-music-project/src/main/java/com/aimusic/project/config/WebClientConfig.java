package com.aimusic.project.config;

//===================================================================================
//WebClientConfig.java: 서버가 시작될 때 필요한 도구들을 미리 준비하고 설정하는 '설정 전문가'
//여기서는 'AI API'와 통신할 전화기(WebClient)를 설치하고 설정합니다.
//===================================================================================

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient aiWebClient(WebClient.Builder builder,
                                 @Value("${ai.base-url:}") String aiBaseUrl) {
    		// ai.base-url이 설정되지 않았거나 비어있으면 절대 URI로 호출
        if (aiBaseUrl == null || aiBaseUrl.isBlank()) {
            return builder.build(); // 나중에 절대 URI로 호출
        }
        // ai.base-url이 설정되어 있으면 설정된 URL로 사용
        return builder.baseUrl(aiBaseUrl).build();
    }
}
