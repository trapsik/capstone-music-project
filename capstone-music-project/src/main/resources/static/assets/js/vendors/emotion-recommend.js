// emotion-recommend.js

// ★★★ 변경됨: 내 서버(Spring Boot)로 요청을 보냅니다. ★★★
const RECOMMEND_API_URL = '/api/music-recommend';
const NUM_RECS = 10;

/**
 * URL 쿼리 파라미터에서 'emotion' 값을 가져옵니다.
 * @returns {string|null} 감정 값 또는 null
 */
function getEmotionFromUrl() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('emotion');
}

function renderSliderCovers(albums) {
	const allSliderItems = document.querySelectorAll('.slider-track > .col');

	if (albums.length < 10 || allSliderItems.length < 20) {
		console.warn('슬라이더를 채우기 위한 앨범 데이터(10개) 또는 HTML 항목(20개)이 부족합니다.');
		return;
	}

	// 1. 원본 10개 항목에 데이터를 매핑 (인덱스 0~9)
	for (let i = 0; i < 10; i++) {
		const albumData = albums[i];
		const itemDiv = allSliderItems[i]; 

		if (albumData && itemDiv) {
			// 1. 앨범 커버 이미지 업데이트
			const img = itemDiv.querySelector('.track-cover');
			if (img) {
				img.src = albumData.album_cover_url;
				img.alt = `${albumData.track_name} - ${albumData.artist} 앨범 커버`;
				img.style.opacity = '0.9';
			}

			// 2. 노래 제목 업데이트
			const titleElement = itemDiv.querySelector('.track-title');
			if (titleElement) {
				titleElement.textContent = albumData.track_name;
			}

			// 3. 아티스트 이름 업데이트
			const artistElement = itemDiv.querySelector('.track-artist');
			if (artistElement) {
				artistElement.textContent = albumData.artist;
			}

			// 링크 설정
			itemDiv.style.cursor = 'pointer'; 
			itemDiv.onclick = () => {
				window.open(albumData.youtube_url, '_blank');
			};
		}
	}

	// 2. 무한 루프를 위한 복제 항목 업데이트 (인덱스 10~19)
	for (let i = 0; i < 10; i++) {
		const originalItemHTML = allSliderItems[i].innerHTML;
		const clonedItemDiv = allSliderItems[i + 10]; 

		if (clonedItemDiv) {
			clonedItemDiv.innerHTML = originalItemHTML;
			const albumData = albums[i];
			clonedItemDiv.style.cursor = 'pointer';
			clonedItemDiv.onclick = () => {
				window.open(albumData.youtube_url, '_blank');
			};
		}
	}
	console.log('슬라이더에 추천 앨범 커버 매핑 완료.');
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

        // 변경된 URL(/api/music-recommend)로 요청
		const response = await fetch(RECOMMEND_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: requestBody
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('API 호출 실패 상세:', errorText);
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();
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
 */
function renderTrackList(tracks) {
	const listContainer = document.getElementById('recommendation-list');
	if (!listContainer) return;

	if (tracks.length === 0) {
		listContainer.innerHTML = '<p>추천할 만한 음악을 찾지 못했습니다.</p>';
		return;
	}

	listContainer.innerHTML = '';

	tracks.forEach((track, index) => {
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
		coverImg.style.width = '80px'; 
		coverImg.style.height = '80px';
		coverImg.style.objectFit = 'cover';
		coverImg.style.borderRadius = '5px';
		coverImg.style.border = "0";

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

async function initRecommendation() {
	console.log('--- 추천 결과 페이지 데이터 로딩 시작 ---');
	const analyzedEmotion = getEmotionFromUrl();
	const tracks = await fetchEmotionRecommendations(analyzedEmotion);

	if (tracks.length >= 10) {
		renderSliderCovers(tracks);
	} else {
		console.warn('API에서 10개의 트랙 데이터를 받지 못했습니다.');
	}
	renderTrackList(tracks);
	document.getElementById('album-track').classList.add('loaded');
	
	console.log('--- 추천 결과 페이지 초기화 완료 ---');
}

document.addEventListener('DOMContentLoaded', initRecommendation);