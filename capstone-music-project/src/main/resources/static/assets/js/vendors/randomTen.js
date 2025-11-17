
// =======================================================
// ★★★ 신규: 랜덤 앨범 로딩 및 슬라이더 채우기 코드 (아래에 추가) ★★★
// =======================================================

const API_URL = 'http://43.203.93.14:5000/randomten';

async function fetchRandomAlbums() {
    try {
        const url = 'http://43.203.93.14:5000/randomten';
        console.log(`Fetch 요청 URL: ${url}`);
        
        const response = await fetch(url);
        
        // 1. HTTP 상태 코드 확인 (404, 500 등 서버 오류 확인)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - 서버 응답 상태 불량`);
        }
        
        // 2. JSON 파싱 시도 (JSON 구문 오류 방지)
        const data = await response.json();
        console.log(`성공적으로 가져온 앨범 데이터 개수: ${data.length}`);
        
        return data;

    } catch (error) {
        // 네트워크 오류, JSON 파싱 오류 등을 여기서 잡습니다.
        console.error('랜덤 앨범 데이터를 가져오는 중 치명적인 오류 발생:', error);
        // 에러 발생 시 빈 배열을 반환하여 renderAlbumCovers 함수가 안전하게 종료되도록 합니다.
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
			console.log(`매핑 중: 인덱스 ${i}, 앨범명: ${albumData.track_name}`); // 데이터 매핑 확인
            let contentContainer = itemDiv.querySelector('.rounded-3');
            
            // 안전하게 처리: 만약 .rounded-3를 못 찾으면 .col 자체를 사용
            if (!contentContainer) {
                contentContainer = itemDiv;
            }
            
			console.log(`인덱스 ${i}에 앨범 커버 삽입 시도: ${albumData.album_cover_url}`);
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
			// ★★★ 투명도 설정 (0.9 = 90% 불투명) ★★★
			img.style.opacity = '0.9'; // 숫자를 낮출수록 더 투명해지고 덜 부각됩니다.
			//img.style.marginLeft = '4px';
			//img.style.marginRight = '4px';

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
			console.log(`복제 중: 인덱스 ${i} -> ${i + 10}`); // 복제본 업데이트 확인
            clonedItemDiv.innerHTML = originalItemHTML;
        }
    }
}

async function initSliderWithData() {
	console.log('--- 1. 데이터 로딩 시작 ---');
    const albums = await fetchRandomAlbums();
	console.log(albums);
    // API가 10곡만 반환하므로, 앨범 데이터가 10개 이상인지 확인 (최소 10개 필요)
    if (albums.length >= 10) {
        renderAlbumCovers(albums);
		document.getElementById('album-track').classList.add('loaded');
    } else {
        console.warn('API에서 10개의 앨범 데이터를 받지 못했습니다. 슬라이더를 채울 수 없습니다.');
    }
}

// 페이지 로드 시 실행 (자동 슬라이더 채우기)
// DOMContentLoaded 이벤트가 더 안전합니다.
document.addEventListener('DOMContentLoaded', initSliderWithData);