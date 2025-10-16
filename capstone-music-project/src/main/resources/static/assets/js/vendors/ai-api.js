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

// =======================================================
// ★★★ 신규: 랜덤 앨범 로딩 및 슬라이더 채우기 코드 (아래에 추가) ★★★
// =======================================================

const API_URL = 'http://3.39.142.192:5000/randomten';

async function fetchRandomAlbums() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP 오류! 상태 코드: ${response.status}`);
        }
        const data = await response.json();
        return data; 

    } catch (error) {
        console.error('랜덤 앨범 데이터를 가져오는 중 오류 발생:', error);
        return []; 
    }
}

function renderAlbumCovers(albums) {
    const allSliderItems = document.querySelectorAll('.slider-track > .col');
    
    // 원본 10개 항목에 데이터를 매핑합니다. (0번째부터 9번째 인덱스)
    for (let i = 0; i < 10; i++) {
        const albumData = albums[i];
        const itemDiv = allSliderItems[i]; // 원본 항목 (i = 0~9)

        if (albumData && itemDiv) {
            // 기존 콘텐츠를 앨범 커버로 대체하기 위해 내부 .rounded-3 div를 찾거나 생성
            // HTML 구조가 복잡할 경우, 가장 깊은 곳의 div (border rounded-3)를 타겟합니다.
            let contentContainer = itemDiv.querySelector('.rounded-3');
            
            // 안전하게 처리: 만약 .rounded-3를 못 찾으면 .col 자체를 사용
            if (!contentContainer) {
                contentContainer = itemDiv;
            }
            
            contentContainer.innerHTML = ''; // 기존 콘텐츠 모두 삭제 (SVG, 텍스트 등)

            // 이미지 요소 생성
            const img = document.createElement('img');
            img.src = albumData.album_cover_url;
            img.alt = `${albumData.track_name} - ${albumData.artist} 앨범 커버`;
            
            // 이미지 스타일 지정
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover'; 
            img.style.borderRadius = '0.5rem'; 

            // 박스에 이미지 삽입
            contentContainer.appendChild(img);
        }
    }

    // 무한 루프를 위한 복제 항목 업데이트 (10번째부터 19번째 인덱스)
    // 원본 10개의 HTML을 그대로 복사하여 복제본 10개에 붙여넣습니다.
    for (let i = 0; i < 10; i++) {
        const originalItemHTML = allSliderItems[i].innerHTML;
        const clonedItemDiv = allSliderItems[i + 10]; // 복제 항목 (i + 10 = 10~19)
        
        if (clonedItemDiv) {
            clonedItemDiv.innerHTML = originalItemHTML;
        }
    }
}

async function initSliderWithData() {
    const albums = await fetchRandomAlbums();
    // API가 10곡만 반환하므로, 앨범 데이터가 10개 이상인지 확인 (최소 10개 필요)
    if (albums.length >= 10) {
        renderAlbumCovers(albums);
    } else {
        console.warn('API에서 10개의 앨범 데이터를 받지 못했습니다. 슬라이더를 채울 수 없습니다.');
    }
}

// 페이지 로드 시 실행 (자동 슬라이더 채우기)
// DOMContentLoaded 이벤트가 더 안전합니다.
document.addEventListener('DOMContentLoaded', initSliderWithData);