# Wordle 게임 🎮
웹 기반의 워들 클론 게임으로, **HTML**, **CSS**, **JavaScript**로 제작되었습니다.

플레이 : https://jeongsunghan.github.io/wordle-game/

## 주요 기능 🚀
- **반응형 디자인**: 모바일, 태블릿, 데스크탑에서 작동합니다.
- **리더 보드**: 이전 기록과 성과를 확인할 수 있습니다.
- **랜덤 단어 생성**: https://random-word-api.herokuapp.com/home API에서 단어을 받아와 각 게임마다 랜덤한 5글자 단어가 출제됩니다.


## 게임 방법 🎯

1. 닉네임을 입력하여 게임을 시작하세요.
2. 5글자 단어를 추측하세요:
   - **초록색**은 위치와 글자가 모두 맞았을 때.
   - **노란색**은 글자는 맞지만 위치가 틀렸을 때.
   - **회색**은 틀린 글자일 때.
3. 총 **6번**의 기회가 주어집니다.

## 프로젝트 구조 🏗️
```bash
wordle-game/
│
├── css/                     # 게임 스타일 시트
│   ├── wordle.css            # 주요 게임 스타일
│   ├── movewordle.css        # 배경 단어 움직임 스타일
│   ├── title.css             # 타이틀 타이핑 애니메이션
│   └── responsive.css        # 다양한 디바이스에 대한 반응형 스타일
│
├── js/                      # 자바스크립트 파일
│   ├── wordle.js             # 게임 핵심 로직
│   ├── movewordle.js         # 배경 움직임 로직
│   └── wordleStorageRest.js  # 리더보드 기록 초기화 로직
│
├── image/                   # 이미지 파일
│   └── leaderboard.png       # 리더보드 아이콘
│
├── wordle.html               # 주요 HTML 파일
├── README.md                 # 프로젝트 설명서
└── proxy-server.js           # 선택 사항인 프록시 서버 (CORS 문제 해결용)
```

## 향후 개선 사항(목표) 🔮
1. 테마 추가: 라이트 모드와 다크 모드 테마를 추가할 예정.
2. 힌트 시스템: 플레이어가 힌트를 받을 수 있는 옵션 제공.
3. EASY, HARD 모드 추가 
3. 멀티플레이 모드: 친구들과 대결할 수 있는 멀티플레이 기능 추가.

❤️ by Jeong Sunghan
