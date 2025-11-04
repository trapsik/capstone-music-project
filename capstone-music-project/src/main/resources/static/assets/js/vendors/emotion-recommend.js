// emotion-recommend.js

// 감정 기반 음악 추천 API 엔드포인트
const RECOMMEND_API_URL = 'http://3.39.142.192:5000/emotion-recommend';
const NUM_RECS = 10;
/**
 * 추천 받은 앨범 커버를 슬라이더 트랙에 렌더링합니다.
 * (randomTen.js의 renderAlbumCovers 함수 로직을 재활용)
 * @param {Array} albums - 앨범 데이터 배열 (최소 10개)
 */
/**
 * URL 쿼리 파라미터에서 'emotion' 값을 가져옵니다.
 * @returns {string|null} 감정 값 또는 null
 */

function renderSliderCovers(albums) {
    // 슬라이더 항목(.col)을 선택합니다. (원본 10개 + 복제본 10개 = 총 20개 가정)
    const allSliderItems = document.querySelectorAll('.slider-track > .col');
    
    if (albums.length < 10 || allSliderItems.length < 20) {
        console.warn('슬라이더를 채우기 위한 앨범 데이터(10개) 또는 HTML 항목(20개)이 부족합니다.');
        return;
    }
    
    // 1. 원본 10개 항목에 데이터를 매핑합니다. (인덱스 0~9)
    for (let i = 0; i < 10; i++) {
        const albumData = albums[i];
        const itemDiv = allSliderItems[i]; // 원본 항목 (i = 0~9)

        if (albumData && itemDiv) {
            let contentContainer = itemDiv.querySelector('.rounded-3');
            
            if (!contentContainer) {
                contentContainer = itemDiv;
            }
            
            contentContainer.innerHTML = ''; // 기존 콘텐츠 모두 삭제

            // 이미지 요소 생성
            const img = document.createElement('img');
            img.src = albumData.album_cover_url;
            img.alt = `${albumData.track_name} - ${albumData.artist} 앨범 커버`;
            
            // 이미지 스타일 지정 (randomTen.js 스타일 유지)
            img.style.width = '100%';
            //img.style.height = '100%';
			img.style.height = 'auto';
            img.style.objectFit = 'cover'; 
            img.style.borderRadius = '0.5rem';
			img.style.opacity = '0.9';
			
			// [수정] 앨범 커버를 위한 별도 wrapper를 만들어 텍스트와 분리
			const coverWrapper = document.createElement('div');
			coverWrapper.style.height = '100%';
			coverWrapper.style.marginBottom = '10px'; // 텍스트와의 간격
			coverWrapper.appendChild(img);

            contentContainer.appendChild(coverWrapper);
			
			// ★★★ [신규] 2. 트랙 정보 텍스트 영역 생성 및 삽입 ★★★
			const textInfo = document.createElement('div');
			textInfo.style.padding = '0 10px 10px 10px'; // 좌우 패딩
			textInfo.style.textAlign = 'center'; // 가운데 정렬
			
			// 곡 제목 (크게)
			const trackName = document.createElement('h5');
			trackName.textContent = albumData.track_name;
			trackName.style.fontSize = '1em';
			trackName.style.margin = '0';
			trackName.style.whiteSpace = 'nowrap'; // 한 줄 표시
			trackName.style.overflow = 'hidden';
			trackName.style.textOverflow = 'ellipsis'; // 넘치면 ... 처리
			            
			// 아티스트 (작게)
			const artistName = document.createElement('p');
			artistName.textContent = albumData.artist;
			artistName.style.fontSize = '0.8em';
			artistName.style.color = '#888'; // 회색
			artistName.style.margin = '0';
			artistName.style.whiteSpace = 'nowrap';
			artistName.style.overflow = 'hidden';
			artistName.style.textOverflow = 'ellipsis';
			
			textInfo.appendChild(trackName);
			textInfo.appendChild(artistName);
			            
			// 최종 컨테이너에 텍스트 정보 삽입
			contentContainer.appendChild(textInfo);
        }
    }

    // 2. 무한 루프를 위한 복제 항목 업데이트 (인덱스 10~19)
    for (let i = 0; i < 10; i++) {
        const originalItemHTML = allSliderItems[i].innerHTML;
        const clonedItemDiv = allSliderItems[i + 10]; // 복제 항목 (i + 10 = 10~19)
        
        if (clonedItemDiv) {
            clonedItemDiv.innerHTML = originalItemHTML;
        }
    }
    console.log('슬라이더에 추천 앨범 커버 매핑 완료.');
}

function getEmotionFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('emotion');
}

/**
 * 음악 추천 API를 호출하여 트랙 리스트를 가져옵니다.
 */
async function fetchEmotionRecommendations(emotion) {
    const listContainer = document.getElementById('recommendation-list');
    if (!emotion) {
        listContainer.innerHTML = '<p style="color: red;">감정 정보가 누락되어 추천을 시작할 수 없습니다.</p>';
        return [];
    }
    
    try {
        const requestBody = JSON.stringify({
            "emotion": emotion,
            "num_recs": NUM_RECS
        });
        
        const response = await fetch(RECOMMEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        });
        
        if (!response.ok) {
			// 400 에러 등의 경우, 서버 응답 본문을 확인하여 상세 에러를 로그에 남길 수 있습니다.
			const errorText = await response.text();
			console.error('API 호출 실패 상세:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        // 응답 구조: { "count": 10, "emotion": "...", "tracks": [...] }
        return data.tracks || [];

    } catch (error) {
        console.error('음악 추천 데이터를 가져오는 중 오류 발생:', error);
		if (listContainer) {
		            listContainer.innerHTML = '<p style="color: red;">음악 추천 데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.</p>';
		}        
		return []; 
    }
}

/**
 * 추천 받은 트랙 리스트를 HTML로 렌더링합니다.
 * * (슬라이더 커버 렌더링과는 별개로, 상세 리스트를 별도 섹션에 표시)
 * 
 */
function renderTrackList(tracks) {
    const listContainer = document.getElementById('recommendation-list');
    // 이전에 슬라이더 커버에 사용된 로직이 HTML 본문의 리스트에 사용되도록 분리했습니다.
    if (!listContainer) return;

    if (tracks.length === 0) {
        listContainer.innerHTML = '<p>추천할 만한 음악을 찾지 못했습니다.</p>';
        return;
    }
    
    listContainer.innerHTML = '';
    
    tracks.forEach((track, index) => {
        // ... (기존 renderRecommendedTracks 내부의 상세 리스트 생성 로직) ...
        const trackDiv = document.createElement('div');
        trackDiv.className = 'recommend-track-item'; 
        trackDiv.style.marginBottom = '20px'; 
        trackDiv.style.padding = '15px';
        trackDiv.style.border = '1px solid #ddd'; 
        trackDiv.style.borderRadius = '8px';
        trackDiv.style.display = 'flex';
        trackDiv.style.gap = '20px';
        
        const coverImg = document.createElement('img');
        coverImg.src = track.album_cover_url;
        coverImg.alt = `${track.track_name} 앨범 커버`;
        coverImg.style.width = '80px'; // 상세 리스트에서는 크기 축소
        coverImg.style.height = '80px';
        coverImg.style.objectFit = 'cover';
        coverImg.style.borderRadius = '5px';
        
        const infoDiv = document.createElement('div');
        infoDiv.style.flexGrow = '1';
        infoDiv.innerHTML = `
            <h3 style="margin-top: 0;">${index + 1}. ${track.track_name}</h3>
            <p style="margin-bottom: 5px;"><strong>아티스트:</strong> ${track.artist}</p>
            <div style="font-size: 0.9em; margin-top: 10px;">
                <a href="${track.youtube_url}" target="_blank" style="margin-right: 15px;">▶️ YouTube에서 듣기</a>
                <a href="${track.album_url}" target="_blank">💿 앨범 정보 보기</a>
            </div>
        `;

        trackDiv.appendChild(coverImg);
        trackDiv.appendChild(infoDiv);
        
        listContainer.appendChild(trackDiv);
    });
    console.log('상세 추천 트랙 리스트 렌더링 완료.');
}



/**
 * 초기화 함수: 페이지 로드 시 실행됩니다.
 */
async function initRecommendation() {
	console.log('--- 추천 결과 페이지 데이터 로딩 시작 ---');
    // 1. 감정 값 가져오기
    const analyzedEmotion = getEmotionFromUrl();
    
    // 2. API 호출
    const tracks = await fetchEmotionRecommendations(analyzedEmotion);
    
	// 3. 슬라이더에 앨범 커버 렌더링 (visual)
	    if (tracks.length >= 10) {
	        renderSliderCovers(tracks);
	    } else {
	        // 데이터가 부족하면 슬라이더에 공백이 생길 수 있다는 경고
	        console.warn('API에서 10개의 트랙 데이터를 받지 못하여 슬라이더가 완전히 채워지지 않을 수 있습니다.');
	    }
		// 4. HTML 본문에 상세 트랙 리스트 렌더링 (main content)
		    renderTrackList(tracks);
		    
		    console.log('--- 추천 결과 페이지 초기화 완료 ---');
}

// DOM이 완전히 로드된 후 초기화 함수 실행
document.addEventListener('DOMContentLoaded', initRecommendation);