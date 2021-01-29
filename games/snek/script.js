var canv = document.getElementById("game");
var ctx = canv.getContext("2d");
var gameLoop;
var snake = {
	position_x: 10,
  position_y: 10,
  tail: [],
  direction: 0,
  size: 10
};

var score = 0;
var lastKey = 0;
var speed = 10;

var food = {
  x: 40,
  y: 40,
  size: 10
}

for(let i=0; i<4; i++){
  snake.tail.push({x: snake.position_x-(snake.size*(i+1)), y: snake.position_y});
}

function draw(){
	ctx.fillStyle = "#222222";
	ctx.fillRect(0, 0, canv.width, canv.height);

  // DRAW FOOD 
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, food.size, food.size);

  // FOOD EATING MECHANISM
  if(snake.position_x == food.x && snake.position_y == food.y){
    food.x = Math.floor(Math.random()*40)*10;
    food.y = Math.floor(Math.random()*40)*10;
    snake.tail.push({x: snake.position_x, y: snake.position_y});
    score += 1;
  }

  // DYING MECHANISM
  for(let tailpart of snake.tail){
    if(snake.tail.indexOf(tailpart)==snake.tail.length-1)continue;
    if(snake.position_x == tailpart.x && snake.position_y == tailpart.y){
      clearInterval(gameLoop);
      ctx.fillStyle="red";
      ctx.textAlign="center";
      ctx.font = "50px Arial";
      ctx.fillText("GAME OVER", canv.width/2, canv.height/2);
    }
  }

  // LIMIT BOUNDARIES
  if(snake.position_x > canv.width - snake.size){
    snake.position_x = 0;
  }
  if(snake.position_x < 0){
    snake.position_x = canv.width - snake.size;
  }

  if(snake.position_y > canv.height - snake.size){
    snake.position_y = 0;
  }
  if(snake.position_y < 0){
    snake.position_y = canv.height - snake.size;
  }

  // DRAW SCORE 
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.textAlign="left";
  ctx.fillText("Score: "+score, 5, 20)

  // DRAW THE TAIL 
  let t = snake.tail.pop();
  t.x = snake.position_x;
  t.y = snake.position_y;
  snake.tail.unshift(t);
  for(let tailpart of snake.tail){
    ctx.fillStyle = "lime";
    ctx.fillRect(tailpart.x, tailpart.y, snake.size, snake.size);
  }

  // MOVEMENT OF THE SNEK
  if(snake.direction == 0){
  	snake.position_x += speed;
  } else if (snake.direction == 1){
  	snake.position_y += speed;
  } else if (snake.direction == 2){
  	snake.position_x -= speed;
  } else if (snake.direction == 3){
    snake.position_y -= speed;
  }

  if((lastKey == 38 || lastKey == 87) && snake.direction != 1){ // up, w
    snake.direction = 3;
  } else if ((lastKey == 39 || lastKey == 68) && snake.direction != 2){ // right
    snake.direction = 0;
  } else if ((lastKey == 40 || lastKey == 83) && snake.direction != 3){ // down, s
    snake.direction = 1;
  } else if ((lastKey == 37 || lastKey == 65) && snake.direction != 0){ // left, a
    snake.direction = 2;
  }
  

  
}

// LET THE ARROWS MOVE THE SNEK
document.addEventListener("keydown", function(evt){
  lastKey = evt.keyCode;
});

gameLoop = setInterval(draw, 1000/15);