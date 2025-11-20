// pending-redirect.js (새로 만들거나 기존 JS 파일에 추가)

const RECOMMEND_API_URL = 'https://43.203.93.14:5000/emotion-recommend';
const NUM_RECS = 10;
// const EMOTION_PARAM = window.GLOBAL_EMOTION_PARAM || '기본';
const emotionValue = (window.GLOBAL_EMOTION_PARAM || '기본').replace(/'|"/g, '');

/**
 * 음악 추천 API를 호출하고 성공 시 페이지를 전환합니다.
 */
async function triggerRecommendationAndRedirect() {
    console.log(`추천 API 호출 시작. 감정: ${emotionValue}`);

    // 감정 값이 없으면 이동 불가
	if (emotionValue === '기본' || emotionValue === '' || emotionValue === null) {
	        console.error('감정 정보를 찾을 수 없어 리다이렉트 할 수 없습니다.');
	        // 사용자에게 메시지를 보여줄 수 있습니다.
	        return; 
	}
    
    try {
        const requestBody = JSON.stringify({
            "emotion": emotionValue,
            "num_recs": NUM_RECS
        });
        
        // API 호출 (결과 페이지에서 다시 호출할 것이므로, 여기서는 성공 여부만 확인)
        const response = await fetch(RECOMMEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });
        
        if (!response.ok) {
            // 서버에서 4xx, 5xx 응답이 온 경우
            throw new Error(`API 호출 실패! 상태 코드: ${response.status}`);
        }
        
        // 성공적으로 응답을 받으면 (JSON 파싱 성공 여부와 무관하게)
        console.log('음악 추천 API 호출 완료 및 성공 응답 수신.', response);
        
        // ★★★ 최종 목표: API 호출 완료 후 화면 전환 ★★★
        // /recommend-result 엔드포인트로 감정 파라미터와 함께 이동합니다.
        window.location.href = `/recommend-result?emotion=${emotionValue}`;

    } catch (error) {
        console.error('API 호출 중 치명적인 오류 발생:', error);
        // 사용자에게 오류 메시지를 보여주거나, 대기 페이지에 머물도록 할 수 있습니다.
        // 예: alert('음악 추천에 실패했습니다. 다시 시도해 주세요.');
    }
}

// DOM 로드 완료 후 랜덤 슬라이더 초기화와 함께 리다이렉트 로직 실행
document.addEventListener('DOMContentLoaded', () => {
    // 만약 randomTen.js의 initSliderWithData 함수가 있다면 여기에 같이 호출합니다.
    // initSliderWithData(); 
    
    // API 호출 및 리다이렉트 로직 실행
    // ★★★ 바로 실행하면 너무 빨라서 대기 페이지 의미가 없어지므로, 
    // 최소한의 로딩 시간을 주기 위해 setTimeout을 사용합니다. ★★★
    setTimeout(triggerRecommendationAndRedirect, 5000); // 3초 대기 후 API 호출 및 전환 시작
});