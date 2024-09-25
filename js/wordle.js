// 변수 초기화 및 변경
let answer = "";
let attempts = 0;
const maxAttempts = 6;  // 단어 맞추는 최대 횟수(기본 값 : 6)
let startTime, endTime;
let hintUsage = 0; // 힌트 사용 횟수
const maxHints = 2; // 힌트 사용 가능 횟수

// 단어를 가져오는 함수 - 전체 단어를 가져와서 5글자 단어만 필터링
function fetchAllWords() {
  const apiUrl = "https://random-word-api.herokuapp.com/all";

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      // 5글자 단어만 필터링하여 랜덤으로 선택
      const fiveLetterWords = data.filter(word => word.length === 5);
      if (fiveLetterWords.length > 0) {
        answer = fiveLetterWords[Math.floor(Math.random() * fiveLetterWords.length)].toLowerCase();

        // ** 콘솔 나중에 지우기 디버깅용입니다!  **
        // console.log("오늘의 5글자 랜덤 단어:", answer);

      } else {
        console.error("5글자 단어를 찾을 수 없습니다.");
      }
    })
    .catch((error) => {
      //새로고침 여러번 하면 종종 발생 혹은 api 주소 자체에서 문제 발생
      alert("단어를 불러오는 데 실패했습니다. 다시 시도해주세요.");
    });
}


// 게임 초기화 함수
function resetGame() {
  document.querySelector("#previousAttemptsContainer").innerHTML = "<h3>이전 시도:</h3>";

  const inputs = document.querySelectorAll(".input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].value = "";
    inputs[i].style.background = "";
  }

  attempts = 0;
  hintUsage = 0;  // 힌트 사용 횟수 초기화
  startTime = null;
  fetchAllWords();

  document.getElementById("gameContainer").style.display = "none";
  document.getElementById("playerForm").style.display = "block";
  document.getElementById("nickname").value = "";
}

// 페이지가 로드될 때 단어를 가져옴
fetchAllWords();

// 닉네임 확인 후 게임을 시작
document.getElementById("playerForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const nickname = document.getElementById("nickname").value;
  if (!nickname) {
    alert("닉네임을 입력해주세요.");
    return;
  }

  // 닉네임 중복 체크
  if (!isNicknameUnique(nickname)) {
    alert("닉네임이 이미 사용 중입니다. 다른 닉네임을 입력하세요.");
    return;
  }

  // 게임 시작
  document.getElementById("gameContainer").style.display = "block";
  startTime = new Date(); // 시작 시간 기록
  document.getElementById("playerForm").style.display = "none"; // 닉네임 입력 숨기기
});

// 닉네임 중복 확인 함수
function isNicknameUnique(nickname) {
  const results = JSON.parse(localStorage.getItem("results")) || [];
  return !results.some(result => result.nickname === nickname);
}


//================================== 게임 시작 함수 ==================================

// 제출 버튼 클릭 시 실행
document.querySelector("#submitBtn").addEventListener("click", function () {
  const inputs = document.querySelectorAll(".input");
  let userGuess = "";

  // 사용자 입력 값을 저장
  for (let i = 0; i < inputs.length; i++) {
    userGuess += inputs[i].value.toLowerCase();
  }

  const previousAttempt = document.createElement('div'); // 새로운 시도 기록을 위한 div 생성
  previousAttempt.classList.add('attempt-row'); // 시도를 가로로 나열하기 위한 클래스 추가

  // 각 칸을 비교하여 시각적 피드백 제공
  let correctGuessCount = 0; // 정답 맞춘 칸 수

  for (let i = 0; i < answer.length; i++) {
    const resultBox = document.createElement('div'); // div로 수정해서 이전 시도 표시
    resultBox.classList.add("input-box"); // 스타일을 적용할 클래스 추가

    // 입력값이 없는 경우 처리 (빈 값도 회색 처리)
    if (inputs[i].value.trim() === "") {
      resultBox.classList.add("grey"); // 아무것도 입력하지 않은 칸을 회색으로 처리
    } else if (inputs[i].value.toLowerCase() === answer[i]) {
      resultBox.classList.add("green"); // 정답 위치
      correctGuessCount++; // 맞춘 칸 수 증가
    } else if (answer.includes(inputs[i].value.toLowerCase())) {
      resultBox.classList.add("yellow"); // 정답 포함, 위치 다름
    } else {
      resultBox.classList.add("grey"); // 정답 아님
    }

    resultBox.textContent = inputs[i].value.toLowerCase() || "_"; // 입력한 값이 없을 경우 '_'로 표시
    previousAttempt.appendChild(resultBox); // 이전 시도에 추가
  }

  // 이전 시도 기록을 추가 (기존 기록 유지)
  const previousAttemptsContainer = document.querySelector("#previousAttemptsContainer");
  previousAttemptsContainer.appendChild(previousAttempt);

  // 모든 칸이 정답인 경우 게임 종료
  if (correctGuessCount === answer.length) {
    endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;
    saveResult(timeTaken, attempts + 1); // 시도 횟수 +1
    alert("정답! 경과 시간: " + timeTaken + "초");
    resetGame(); // 정답을 맞추면 즉시 게임 종료
    return; // 종료 후 더 이상 진행X
  }

  // 시도 횟수 증가
  attempts++;

  // 게임 종료 조건: 시도 횟수 초과
  if (attempts >= maxAttempts) {
    alert("게임 종료! 정답은: " + answer);
    resetGame(); // 시도 횟수를 모두 소진하면 게임 종료
    return;
  } else {
    // 새로운 입력을 위해 기존 필드 초기화
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = "";
      inputs[i].style.background = "";
    }
    inputs[0].focus();
  }
});

// update - 힌트 시스템
document.getElementById("hintBtn").addEventListener("click", function () {
  giveHint();
});

// 힌트 제공 함수 (사용자가 몇 번째 글자에 대한 힌트를 받을지 선택)
function giveHint() {
  if (hintUsage >= maxHints) {
    alert("더 이상 힌트를 사용할 수 없습니다.");
    return;
  }

  let hintIndex = prompt("몇 번째 글자의 힌트를 받으시겠습니까? (1~5 사이의 숫자를 입력하세요)");
  
  // 입력된 값이 유효 확인
  if (!hintIndex || isNaN(hintIndex) || hintIndex < 1 || hintIndex > 5) {
    alert("유효한 숫자를 입력하세요 (1~5).");
    return;
  }

  // 인덱스 값 조정
  hintIndex = parseInt(hintIndex) - 1;

  // 선택된 글자가 이미 맞춘 글자인지 확인
  const input = document.querySelectorAll(".input")[hintIndex];
  if (input.value.toLowerCase() === answer[hintIndex]) {
    alert("이미 맞춘 글자입니다! 다른 글자의 힌트를 선택해주세요.");
    return;
  }

  alert("힌트: 정답의 " + (hintIndex + 1) + "번째 글자는 '" + answer[hintIndex].toUpperCase() + "' 입니다.");
  
  hintUsage++; // 힌트 사용 횟수 증가
}


// 결과 저장 함수 (로컬 스토리지)
function saveResult(timeTaken, attempts) {
  const nickname = document.getElementById("nickname").value;
  const result = { nickname, attempts, timeTaken };
  let results = JSON.parse(localStorage.getItem("results")) || [];
  results.push(result);
  localStorage.setItem("results", JSON.stringify(results));
}
// ======================= 리더보드 함수 =======================

// 팝업 요소 가져오기
const leaderboardIcon = document.getElementById('leaderboardIcon');
const leaderboardPopup = document.getElementById('leaderboardPopup');
const closePopup = document.querySelector('.popup .close');

// 리더보드 아이콘 클릭 시 팝업 열기
leaderboardIcon.addEventListener('click', function () {
  leaderboardPopup.style.display = 'block';
  displayLeaderboard(); // 팝업 열릴 때 리더보드 내용 업데이트
});

// 팝업 닫기 버튼 클릭 시 팝업 닫기
closePopup.addEventListener('click', function () {
  leaderboardPopup.style.display = 'none';
});

// 팝업 바깥을 클릭하면 닫기
window.addEventListener('click', function (event) {
  if (event.target === leaderboardPopup) {
    leaderboardPopup.style.display = 'none';
  }
});

// 리더보드 내용 표시 함수
function displayLeaderboard() {
  let results = JSON.parse(localStorage.getItem("results")) || [];

  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = ''; // 기존 목록 초기화

  if (results.length === 0) {
    const noRecordItem = document.createElement('li');
    noRecordItem.textContent = " 아직 기록이 정해지지 않았어요! ";
    leaderboardList.appendChild(noRecordItem);
  } else {
    results.forEach((result, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${index + 1}. ${result.nickname} - ${result.attempts}회 시도, ${result.timeTaken}초 소요`;
      leaderboardList.appendChild(listItem);
    });
  }
}



// ======================= 기타 =======================

// 각 입력 필드에 대해 자동으로 다음 필드로 이동 + 백스페이스 누르면 이전 필드로 이동
document.querySelectorAll('.input').forEach((input, index, array) => {
  input.addEventListener('input', function () {
    if (this.value.length === 1 && index < array.length - 1) {
      // 너무 빠르게 넘어가서 지연시간 추가 해보기, 정안되면 버리기
      setTimeout(() => {
        array[index + 1].focus();
      }, 50);
    }
  });

  // 백스페이스를 눌렀을 때 이전 필드로 이동
  input.addEventListener('keydown', function (event) {
    if (event.key === "Backspace" && this.value === "" && index > 0) {
      array[index - 1].focus();
    }
  });
});

// 수정

