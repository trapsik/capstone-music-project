/*document.getElementById('feelingForm').addEventListener('submit', function(event) {
    // 폼의 기본 제출 동작(새로고침) 막기
    event.preventDefault(); 

    // 사용자가 입력한 텍스트 값 가져오기
    const feelingText = document.getElementById('feeling').value;

    // fetch API 사용해 백엔드로 POST 요청
    fetch('/api/feeling', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feeling: feelingText }) 
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log('Success:', data);
        alert('AI가 분석한 감정: ' + data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    });
});*/

document.getElementById('feelingForm').addEventListener('submit', function(event) {
    // 폼의 기본 제출 동작(새로고침) 막기
    event.preventDefault(); 

    // 사용자가 입력한 텍스트 값 가져오기
    const feelingText = document.getElementById('feeling').value.trim();
    
    // 입력값 유효성 검사 (추가)
    if (feelingText === "") {
        alert("기분을 입력해주세요.");
        return;
    }

    // fetch API 사용해 백엔드로 POST 요청
    fetch('/api/feeling', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feeling: feelingText }),
		// =======================================================
		// ★★★ 1번 안됨. 핵심 수정: 리다이렉트를 자동으로 따라가도록 설정 ★★★
		//redirect: 'manual'
		// ======================================================
		// 2번방법 redirect: 'manual' 또는 옵션 제거 (리다이렉트를 직접 처리)
    })
	.then(response => {
	        if (!response.ok) {
	            // 4xx, 5xx 에러 처리
	            throw new Error('서버 응답 오류: ' + response.statusText);
	        }
	        // [중요 수정!] JSON 응답을 읽습니다. (서버가 200 OK + JSON을 반환했기 때문)
	        return response.json(); 
	    })
	    .then(data => {
	        console.log('서버 응답 (감정):', data.emotion); 
	        
	        // [2] 응답 JSON 데이터에 있는 URL로 강제 이동합니다.
	        if (data.redirectUrl) {
	            window.location.href = data.redirectUrl; 
	        } else {
	            throw new Error("리다이렉트 URL을 받지 못했습니다.");
	        }
	    })
	    .catch((error) => {
	        console.error('Error:', error);
	        alert('처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
	    });
});