// randomTen.js

// ★★★ 변경됨: 내 서버(Spring Boot)로 요청을 보냅니다. ★★★★
const API_URL = '/api/random-ten';

async function fetchRandomAlbums() {
    try {
        // ★★★ 변경됨: 상수로 정의한 API_URL 사용 ★★★
        const url = API_URL;
        console.log(`Fetch 요청 URL: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - 서버 응답 상태 불량`);
        }
        
        const data = await response.json();
        console.log(`성공적으로 가져온 앨범 데이터 개수: ${data.length}`);
        
        return data;

    } catch (error) {
        console.error('랜덤 앨범 데이터를 가져오는 중 치명적인 오류 발생:', error);
        return []; 
    }
}

function renderAlbumCovers(albums) {
    const allSliderItems = document.querySelectorAll('.slider-track > .col');
    
    // 원본 10개 항목에 데이터를 매핑합니다.
    for (let i = 0; i < 10; i++) {
        const albumData = albums[i];
        const itemDiv = allSliderItems[i]; 

        if (albumData && itemDiv) {
            let contentContainer = itemDiv.querySelector('.rounded-3');
            
            if (!contentContainer) {
                contentContainer = itemDiv;
            }
            
            // ★★★ [수정됨] 전체를 <a> 태그로 감싸서 클릭 시 유튜브로 이동하게 변경 ★★★
            contentContainer.innerHTML = `
                <a href="${albumData.youtube_url}" target="_blank" style="text-decoration: none; color: inherit; display: block; height: 100%;">
                    <div style="display: flex; flex-direction: column; height: 100%;">
                        <img src="${albumData.album_cover_url}" 
                             alt="${albumData.track_name}"
                             style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 8px; opacity: 0.9;">
                        
                        <div class="mt-3 text-start">
                            <h5 class="text-mute fw-bold mb-1 text-truncate" style="font-size: 1rem;">
                                ${albumData.track_name}
                            </h5>
                            <p class="text-white-50 small mb-0 text-truncate">
                                ${albumData.artist}
                            </p>
                        </div>
                    </div>
                </a>
            `;
        }
    }

    // 무한 루프를 위한 복제 항목 업데이트 (10~19번째)
    // 원본에 <a> 태그를 넣었으니 복제본에도 자동으로 링크가 걸립니다.
    for (let i = 0; i < 10; i++) {
        const originalItemHTML = allSliderItems[i].innerHTML;
        const clonedItemDiv = allSliderItems[i + 10]; 
        
        if (clonedItemDiv) {
            clonedItemDiv.innerHTML = originalItemHTML;
        }
    }
}

async function initSliderWithData() {
	console.log('--- 1. 데이터 로딩 시작 ---');
    const albums = await fetchRandomAlbums();
	console.log(albums);
    if (albums.length >= 10) {
        renderAlbumCovers(albums);
		document.getElementById('album-track').classList.add('loaded');
    } else {
        console.warn('API에서 10개의 앨범 데이터를 받지 못했습니다. 슬라이더를 채울 수 없습니다.');
    }
}

document.addEventListener('DOMContentLoaded', initSliderWithData);