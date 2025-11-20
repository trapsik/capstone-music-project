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
    
    for (let i = 0; i < 10; i++) {
        const albumData = albums[i];
        const itemDiv = allSliderItems[i]; 

        if (albumData && itemDiv) {
			console.log(`매핑 중: 인덱스 ${i}, 앨범명: ${albumData.track_name}`); 
            let contentContainer = itemDiv.querySelector('.rounded-3');
            
            if (!contentContainer) {
                contentContainer = itemDiv;
            }
            
			console.log(`인덱스 ${i}에 앨범 커버 삽입 시도: ${albumData.album_cover_url}`);
            contentContainer.innerHTML = ''; 

            const img = document.createElement('img');
            img.src = albumData.album_cover_url;
            img.alt = `${albumData.track_name} - ${albumData.artist} 앨범 커버`;
            
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover'; 
            img.style.borderRadius = '0.5rem';
			img.style.opacity = '0.9'; 

            contentContainer.appendChild(img);
        }
    }

    // 무한 루프용 복제
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