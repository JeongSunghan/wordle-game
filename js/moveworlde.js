document.addEventListener("DOMContentLoaded", () => {
    const movingWordsContainer = document.querySelector(".moving-words");
  
    const word = "WORDLE"; 
    const numberOfInstances = 2; 
  
    // 랜덤으로 Wordle의 각 문자를 생성하는 함수
    function createMovingLetter() {
      for (let i = 0; i < numberOfInstances; i++) {
        for (let letter of word) {
          const span = document.createElement("span");
          span.textContent = letter;
  
          // 랜덤한 위치와 애니메이션 속도를 설정
          const randomX = Math.floor(Math.random() * 100) + "vw";
          const randomY = Math.floor(Math.random() * 100) + "vh";
          const randomDuration = Math.random() * 10 + 10; // 속도 설정
  
          span.style.setProperty("--x", randomX); // CSS 커스텀 속성으로 이동할 위치 설정
          span.style.setProperty("--y", randomY);
          span.style.animationDuration = `${randomDuration}s`; 
  
          movingWordsContainer.appendChild(span);
  
          // 랜덤한 시간 간격으로 텍스트가 사라졌다가 다시 나타나도록 설정
          setTimeout(() => {
            movingWordsContainer.removeChild(span);
            createMovingLetter(); // 새로운 단어 생성
          }, randomDuration * 10000);    
        }
      }
    }
  
    // 시작 시 랜덤한 위치로 문자를 생성
    createMovingLetter();
  });
  