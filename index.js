const canvas = document.getElementById('gamecanvas');
const context = canvas.getContext('2d');
const gameOverScreen = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');

const GRID_SIZE = 20;
const SNAKE_SIZE = GRID_SIZE;
const FOOD_SIZE = GRID_SIZE;

let snake, food, dx, dy, blinkCounter;

let gamePause = false;

let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

let currentScoreElem = document.getElementById('current-score');
let highScoreElem = document.getElementById('high-score');

// initilize game state

function initilizeGame(){

    snake = [
        {x:Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE, y:Math.floor(canvas.height / 2/ GRID_SIZE) * GRID_SIZE},
        {x:Math.floor(canvas.width / 2 / GRID_SIZE) * GRID_SIZE, y:(Math.floor(canvas.height / 2 / GRID_SIZE) + 1) * GRID_SIZE},

    ];
    food = {
        ...generateFoodPosition(),
        dx: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
        dy: (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE
    };

    dx = 0;
    dy = -GRID_SIZE;
    blinkCounter = 0;
    score = 0;
    currentScoreElem.textContent = score;
    highScoreElem.textContent = highScore;
}

initilizeGame();

document.addEventListener('keydown', function (event){
    switch (event.key){
        case 'ArrowUp':
            if (dy === 0){
                dx =0;
                dy = -GRID_SIZE;
            }
            break;

        case 'ArrowDown':
            if(dy === 0){
                dx =0;
                dy = GRID_SIZE;
            }
            break;
        
        case 'ArrowLeft':
            if(dx === 0){
                dx = -GRID_SIZE;
                dy = 0;
            }
            break;

        case 'ArrowRight':
            if(dx === 0){
                dx = GRID_SIZE;
                dy = 0;
            }
            break;
    }



});




function generateFoodPosition(){
    while(true){
        let newFoodPosition = {
            x:Math.floor(Math.random() * canvas.width / GRID_SIZE) * GRID_SIZE,
            y:Math.floor(Math.random() * canvas.height / GRID_SIZE) * GRID_SIZE
        };
        let collisionWithSnake = false;
        for (let segment of snake){
            if (segment.x === newFoodPosition.x && segment.y === newFoodPosition.y){
                collisionWithSnake = true;
                break;
            }
        }

        if (!collisionWithSnake){
            return newFoodPosition;
        }
    }
}

function checkCollision(){
    if(snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height){
        return true;
    }
    for (let i = 1;i<snake.lenght; i++){
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }

    return false;
}

function update(){
    if(gamePause) return;
    const head = {x:snake[0].x + dx , y:snake[0].y + dy};
    snake.unshift(head);

    if (checkCollision()){
        if (score > highScore){
            highScore = score;
            localStorage.setItem('highScore', highScore);
            highScoreElem.textContent = highScore;
        }
        gameOver();
        return;
    }

    if (head.x === food.x && head.y === food.y){
        score++;
        currentScoreElem.textContent = score;
        food = {
            ...generateFoodPosition(),
            dx : (Math.random() < 0.5 ? 1 : -1) * GRID_SIZE,
            dy : (Math.random() < 0.5 ? 1 :-1) * GRID_SIZE
        };

        if (snake.lenght === (canvas.width / GRID_SIZE) * (canvas.height / GRID_SIZE)){
            gameWin();
            return;
        }
    } else {
        snake.pop();
    }

    if (blinkCounter % 4 === 0){
        food.x += food.dx;
        food.y += food.dy;

        if (food.x < 0){
            food.dx = -food.dx;
            food.x = 0;
        }
        if (food.x >= canvas.width){
            food.dx = -food.dx;
            food.x = canvas.width - GRID_SIZE;
        }
        if (food.y < 0){
            food.dy = -food.dy;
            food.y = 0;
        }
        if (food.y >= canvas.height){
            food.dy = food.dy;
            food.y = canvas.height - GRID_SIZE;
        }
    }

    blinkCounter++;
    draw();
}



function drawGrid(){
    context.strokeStyle = "#AAA";
    for (let i = 0; i < canvas.width; i+= GRID_SIZE){
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
    }
    for (let j = 0; j < canvas.height; j += GRID_SIZE){
        context.beginPath();
        context.moveTo(0, j);
        context.lineTo(canvas.width, j);
        context.stroke();
    }
}

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    for (const segment of snake){
        context.fillStyle = 'yellow';
        context.fillRect(segment.x , segment.y , SNAKE_SIZE, SNAKE_SIZE);
    }
    context.fillStyle = 'aqua';
    context.fillRect(food.x, food.y, FOOD_SIZE, FOOD_SIZE);
}



function gameOver(){
    gamePause = true;
    gameOverScreen.style.display = 'flex';
}


function gameWin(){
    gamePause = true;
    alert('Congratulations! You WIN THE SNAKE GAME!');
    initilizeGame();
}

restartBtn.addEventListener('click', function (){
    gameOverScreen.style.display = 'none';
    gamePause = false;
    initilizeGame();
    update();
});


setInterval(update, 200);

window.addEventListener('blur' , function (){
    gamePause = true;
});


window.addEventListener('focus', function () {
    gamePause = false;
    update();
});