let startTime = null;
let timerInterval = null;
let matchedPairs = 0;
const totalPairs = 6; 

const timerEl = document.getElementById("timer");
const bestTimeEl = document.getElementById("best-time");

// Load best time from localStorage
const savedBest = localStorage.getItem("bestTime");
if (savedBest) {
  bestTimeEl.textContent = savedBest;
}

const cards = document.querySelectorAll('.card');
let flippedCards = [];
let lock = false;

cards.forEach(card => {
  card.addEventListener('click', () => {
    if (card.classList.contains('flipped') || lock) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    // Start timer on first flip
    if (!startTime) {
      startTime = Date.now();
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerEl.textContent = elapsed;
      }, 1000);
    }

    // Match logic
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const match = first.dataset.country === second.dataset.country;

      if (!match) {
        document.getElementById("sound-wrong").play();
        lock = true;
        setTimeout(() => {
          first.classList.remove('flipped');
          second.classList.remove('flipped');
          flippedCards = [];
          lock = false;
        }, 1000);
      } else {
        document.getElementById("sound-correct").play();
        matchedPairs++;
        flippedCards = [];

     
        if (matchedPairs === totalPairs) {
         setTimeout(() => {
          clearInterval(timerInterval);
          const finalTime = Math.floor((Date.now() - startTime) / 1000);

          const bestTime = localStorage.getItem("bestTime");
          if (!bestTime || finalTime < parseInt(bestTime)) {
            localStorage.setItem("bestTime", finalTime);
            bestTimeEl.textContent = finalTime;
            alert(`🎉 New Best Time: ${finalTime}s!`);
          } else {
            alert(`🎉 You finished in ${finalTime}s!`);
          }
        },  600);
      }
    }
    }
  });
});

// Shuffle on load
window.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const cards = Array.from(grid.children);

  const shuffled = cards.sort(() => Math.random() - 0.5);
  shuffled.forEach(card => grid.appendChild(card));
});

