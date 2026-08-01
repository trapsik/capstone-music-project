// pending-redirect.js

// ★★★ 변경됨: 내 서버(Spring Boot)로 요청을 보냅니다. ★★★
const RECOMMEND_API_URL = '/api/music-recommend';
const NUM_RECS = 10;

const emotionValue = (window.GLOBAL_EMOTION_PARAM || '기본').replace(/'|"/g, '');

/**
 * 음악 추천 API를 호출하고 성공 시 페이지를 전환합니다.
 */
async function triggerRecommendationAndRedirect() {
    console.log(`추천 API 호출 시작. 감정: ${emotionValue}`);

	if (emotionValue === '기본' || emotionValue === '' || emotionValue === null) {
	        console.error('감정 정보를 찾을 수 없어 리다이렉트 할 수 없습니다.');
	        return; 
	}
    
    try {
        const requestBody = JSON.stringify({
            "emotion": emotionValue,
            "num_recs": NUM_RECS
        });
        
        // 변경된 URL로 요청
        const response = await fetch(RECOMMEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });
        
        if (!response.ok) {
            throw new Error(`API 호출 실패! 상태 코드: ${response.status}`);
        }
        
        console.log('음악 추천 API 호출 완료 및 성공 응답 수신.', response);
        
        // 페이지 전환
        window.location.href = `/recommend-result?emotion=${emotionValue}`;

    } catch (error) {
        console.error('API 호출 중 치명적인 오류 발생:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(triggerRecommendationAndRedirect, 5000); // 5초 대기 후 API 호출
});