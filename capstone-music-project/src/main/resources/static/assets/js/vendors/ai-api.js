document.getElementById('feelingForm').addEventListener('submit', function(event) {
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
});