package com.aimusic.project.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient aiWebClient(WebClient.Builder builder,
                                 @Value("${ai.base-url:}") String aiBaseUrl) {
        if (aiBaseUrl == null || aiBaseUrl.isBlank()) {
            return builder.build(); // 나중에 절대 URI로 호출
        }
        return builder.baseUrl(aiBaseUrl).build(); // 기본 baseUrl 지정
    }
}
