/*
 * 이 파일은 Plimo 프로젝트의 '.slider-track' 슬라이더를
 * 제어하기 위해 특별히 수정된 버전입니다.
 */
document.addEventListener('DOMContentLoaded', function () {
    
    // 1. 우리가 제어할 슬라이더 HTML 요소를 찾습니다.
    const sliderElement = document.querySelector('.slider-track');

    // 2. 해당 요소가 이 페이지에 없으면 아무것도 하지 않고 종료합니다.
    if (!sliderElement) {
        return;
    }

    // 3. Swiper (컨베이어 벨트)를 설정합니다.
    const swiper = new Swiper(sliderElement, {
        
        // --- 기본 설정 ---
        slidesPerView: 'auto', // 한 화면에 보이는 개수 (CSS에 따름)
        spaceBetween: 20,      // 앨범 사이 간격 (20px)
        loop: true,            // 무한 루프
        
        // --- 자동 재생 (컨베이어 벨트) 설정 ---
        autoplay: {
            delay: 1,                  // 딜레이 1ms (멈추지 않고 계속)
            disableOnInteraction: false, // 사용자가 건드려도 계속 재생
			pauseOnMouseEnter: true,
        },
        speed: 5000, // 5초에 걸쳐 한 바퀴 도는 속도 (숫자가 클수록 느림)
        observer: true,
		observeParents: true,
        // --- (중요!) 마우스 올리면 멈추기 ---
        // Swiper 라이브러리 자체 기능 활용
    
    });

    console.log("'.slider-track'에 대한 Swiper 초기화 및 호버 이벤트 부착 완료.");
});