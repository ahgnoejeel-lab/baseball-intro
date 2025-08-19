// 게임 상태 관리
let gameState = {
    swingCount: 0,
    hitCount: 0,
    revealedItems: [],
    isAnimating: false
};

// DOM 요소들
const bat = document.getElementById('bat');
const ball = document.getElementById('ball');
const infoCard = document.getElementById('info-card');
const swingCountElement = document.getElementById('swing-count');
const hitCountElement = document.getElementById('hit-count');
const progressElement = document.getElementById('progress');
const resetBtn = document.getElementById('reset-btn');
const introItems = document.querySelectorAll('.intro-item');

// 소개 내용 배열
const introContents = [
    {
        title: "👋 이름",
        content: "안녕하세요! 저는 <strong>이정하</strong>입니다."
    },
    {
        title: "💼 직장",
        content: "인사조직실 글로벌교육팀에서 일하고 있습니다."
    },
    {
        title: "📊 전공",
        content: "통계학을 전공했고, 테크에 관심이 많습니다."
    },
    {
        title: "💕 관심사",
        content: "심리학을 전공해서 연애 프로그램도 좋아합니다."
    },
    {
        title: "🏊‍♂️ 싫어하는 것",
        content: "물놀이는 안좋아합니다."
    },
    {
        title: "🍎 아침 습관",
        content: "아침에는 사과를 먹습니다."
    }
];

// 게임 초기화
function initGame() {
    gameState = {
        swingCount: 0,
        hitCount: 0,
        revealedItems: [],
        isAnimating: false
    };
    
    updateScoreBoard();
    hideAllIntroItems();
    showWelcomeMessage();
    
    // 배트 클릭 이벤트 리스너 추가
    bat.addEventListener('click', handleBatSwing);
    bat.addEventListener('touchstart', handleBatSwing);
    
    // 리셋 버튼 이벤트 리스너
    resetBtn.addEventListener('click', resetGame);
}

// 배트 스윙 처리
function handleBatSwing(event) {
    event.preventDefault();
    
    if (gameState.isAnimating) return;
    
    gameState.isAnimating = true;
    gameState.swingCount++;
    
    // 배트 스윙 애니메이션
    bat.classList.add('swing');
    
    // 공이 날아가는 애니메이션
    ball.classList.add('ball-hit');
    
    // 스윙 사운드 효과 (선택사항)
    playSwingSound();
    
    setTimeout(() => {
        // 애니메이션 완료 후 처리
        bat.classList.remove('swing');
        ball.classList.remove('ball-hit');
        
        // 안타 확률 계산 (80% 확률로 안타)
        const isHit = Math.random() < 0.8;
        
        if (isHit) {
            gameState.hitCount++;
            showRandomIntro();
        } else {
            showMissMessage();
        }
        
        updateScoreBoard();
        gameState.isAnimating = false;
    }, 500);
}

// 랜덤 소개 내용 표시
function showRandomIntro() {
    const availableItems = introContents.filter((_, index) => 
        !gameState.revealedItems.includes(index)
    );
    
    if (availableItems.length === 0) {
        showCompleteMessage();
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableItems.length);
    const selectedItem = availableItems[randomIndex];
    const originalIndex = introContents.findIndex(item => 
        item.title === selectedItem.title
    );
    
    gameState.revealedItems.push(originalIndex);
    
    // 정보 카드에 내용 표시
    const cardContent = infoCard.querySelector('.card-content');
    cardContent.innerHTML = `
        <h3>${selectedItem.title}</h3>
        <p>${selectedItem.content}</p>
    `;
    
    // 카드 애니메이션
    infoCard.classList.add('show');
    infoCard.classList.add('hit-animation');
    
    // 해당 소개 아이템 표시
    setTimeout(() => {
        const introItem = document.querySelector(`[data-index="${originalIndex}"]`);
        if (introItem) {
            introItem.classList.add('revealed');
        }
    }, 300);
    
    // 3초 후 카드 숨기기
    setTimeout(() => {
        infoCard.classList.remove('show', 'hit-animation');
    }, 3000);
}

// 빗나감 메시지 표시
function showMissMessage() {
    const cardContent = infoCard.querySelector('.card-content');
    cardContent.innerHTML = `
        <h3>💨 빗나감!</h3>
        <p>다시 한번 시도해보세요!</p>
    `;
    
    infoCard.classList.add('show');
    
    setTimeout(() => {
        infoCard.classList.remove('show');
    }, 2000);
}

// 완료 메시지 표시
function showCompleteMessage() {
    const cardContent = infoCard.querySelector('.card-content');
    cardContent.innerHTML = `
        <h3>🎉 완료!</h3>
        <p>모든 소개를 확인했습니다!</p>
        <p>게임을 다시 시작하려면 아래 버튼을 클릭하세요.</p>
    `;
    
    infoCard.classList.add('show');
}

// 환영 메시지 표시
function showWelcomeMessage() {
    const cardContent = infoCard.querySelector('.card-content');
    cardContent.innerHTML = `
        <h3>안녕하세요!</h3>
        <p>배트를 휘둘러서 저에 대해 알아보세요!</p>
        <p class="instruction">마우스로 배트를 클릭하거나 터치하세요</p>
    `;
    
    infoCard.classList.add('show');
}

// 점수판 업데이트
function updateScoreBoard() {
    swingCountElement.textContent = gameState.swingCount;
    hitCountElement.textContent = gameState.hitCount;
    progressElement.textContent = `${gameState.revealedItems.length}/${introContents.length}`;
}

// 모든 소개 아이템 숨기기
function hideAllIntroItems() {
    introItems.forEach(item => {
        item.classList.remove('revealed');
    });
}

// 게임 리셋
function resetGame() {
    gameState = {
        swingCount: 0,
        hitCount: 0,
        revealedItems: [],
        isAnimating: false
    };
    
    updateScoreBoard();
    hideAllIntroItems();
    showWelcomeMessage();
    infoCard.classList.remove('show');
}

// 스윙 사운드 효과 (선택사항)
function playSwingSound() {
    // 실제 사운드 파일이 있다면 여기에 추가
    // const audio = new Audio('swing.mp3');
    // audio.play();
}

// 터치 이벤트 처리 (모바일 지원)
function handleTouchEvent(event) {
    event.preventDefault();
    handleBatSwing(event);
}

// 키보드 이벤트 처리 (접근성 지원)
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        handleBatSwing(event);
    }
});

// 페이지 로드 시 게임 초기화
document.addEventListener('DOMContentLoaded', initGame);

// 반응형 디자인을 위한 리사이즈 이벤트
window.addEventListener('resize', () => {
    // 필요한 경우 여기에 반응형 로직 추가
});

// 터치 디바이스 지원
if ('ontouchstart' in window) {
    bat.addEventListener('touchstart', handleTouchEvent, { passive: false });
}
