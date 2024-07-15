const grid = document.querySelector('.grid');
const startBtn = document.getElementById('start-btn');
const difficultyOptions = document.getElementById('difficulty');
const levels = [100, 81, 49];
const endGame = document.querySelector('.popup-container');
const popup = document.querySelector('.popup-message');
const audioClick = new Audio('sounds/click.wav');
const audioBomb = new Audio('sounds/explosion.wav');
const audioOver = new Audio('sounds/game-over-voice.wav');
const audioWin = new Audio('sounds/jingle_win.wav');
const audioLoop = new Audio('sounds/music-loop.mp3')
const score = document.getElementById('points'); 
const refreshBtn = document.getElementById("refresh-btn");


startBtn.addEventListener('click', function(){
  grid.innerHTML='';
  const cellNumbers = levels[difficultyOptions.value];
  const difficulty = difficultyOptions.value;
  let points = 0;
  score.innerHTML = `${points}`;
  const bombs = [];
  startBtn.innerText = 'Restart';
  audioLoop.play();
  audioLoop.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);
  
  while (bombs.length < 16){
    bomba = Math.floor(Math.random() * cellNumbers) + 1;
    invalidBomb = bombs.includes(bomba);
    if(!invalidBomb){
      bombs.push(bomba)}
      console.log(bombs);
    }

  for (let i = 0; i < cellNumbers; i++){
    let box = genBox([i]);
      if(difficulty == 0){
        box.classList.add('easy');
      }else if(difficulty == '1'){
        box.classList.add('normal');
      }else{
        box.classList.add('hard');
      };
    grid.append(box);
    box.addEventListener('click', function(){
      if(!box.classList.contains('clicked') && !bombs.includes(box._boxNum)){
        audioClick.play();
        box.classList.add('clicked');
        box.classList.remove('suspect');
        const surroundingBombs = checkSurroundingBombs(box, cellNumbers, bombs);
        box.innerHTML = surroundingBombs > 0 ? surroundingBombs : '';
        points++
        score.innerHTML = `${points}`
      }
      if (points == cellNumbers - 16){
        setTimeout(gameWin, 1000)
      }
      if(bombs.includes(box._boxNum)) {
         const boxes = document.querySelectorAll('.box')
         audioBomb.play();
         for (let i = 0; i < cellNumbers; i++){
           if (bombs.includes(boxes[i]._boxNum)){
            boxes[i].classList.add('bomb');
          }else{
            boxes[i].classList.add('clicked');
          }
          setTimeout(gameOver, 1000)
        }
      }
    })
    box.addEventListener('contextmenu', function(){
      event.preventDefault();
      box.classList.toggle('suspect');
    })
  };
});
refreshBtn.addEventListener("click", function(){
  window.location.reload();
})



function genBox([i]) {
  const box = document.createElement("div");
  box.classList.add('box');
  box._boxNum = i + 1;
  return box;
}
function gameOver() {
  audioLoop.pause();
  audioOver.play();
  endGame.classList.remove('d-none');
  popup.innerHTML = "HAI PERSO";
}
function gameWin() {
  audioLoop.pause();
  audioWin.play();
  endGame.classList.remove('d-none');
  popup.innerHTML = "HAI VINTO";
}

function checkSurroundingBombs(clickedBox, cellNumbers, bombs) {
  const clickedBoxNum = clickedBox._boxNum;
  const gridWidth = Math.sqrt(cellNumbers);
  let bombCount = 0;

  // Convert box number to x, y coordinates
  const x = (clickedBoxNum - 1) % gridWidth;
  const y = Math.floor((clickedBoxNum - 1) / gridWidth);

  // Check surrounding cells
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newX = x + i;
      const newY = y + j;

      // Check if coordinates are within grid boundaries
      if (newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridWidth) {
        const neighborBoxNum = newY * gridWidth + newX + 1;
        if (bombs.includes(neighborBoxNum)) {
          bombCount++;
        }
      }
    }
  }

  return bombCount;
}