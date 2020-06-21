var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width / 2;
var y = canvas.height - 30;
var xIncrement = 0.3;
var yIncrement = 2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 3;
var brickColumnCount = 5;
var brickHeight = 20;
var brickWidth = 75;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
        //status is a boolean 0 means hit by ball
    }
}

function keyDownHandler(pressed) {

    if (pressed.key == "Right" || pressed.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (pressed.key == "Left" || pressed.key == "ArrowLeft") {
        leftPressed = true
    }
}

function keyUpHandler(unpressed) {

    if (unpressed.key == "Right" || unpressed.key == "ArrowRight") {
        rightPressed = false;
    }

    else if (unpressed.key == "Left" || unpressed.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            //calculations
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    yIncrement = -yIncrement;
                    b.status = 0;
                    score++;
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        clearInterval(interval); // Needed for Chrome to end game
                    }
                    
                }
            }

        }
    }
}



function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#DD6100";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    //side to side bounce
    if (x + xIncrement > canvas.width - ballRadius || x + xIncrement < ballRadius) {
        xIncrement = -xIncrement;
    }

    //bounce off of only the top edge
    if (y + yIncrement < ballRadius) {
        yIncrement = -yIncrement;
    }

    /* Collides with bottom edge game over condition, 
    containing paddle collision condition */
    else if (y + yIncrement > canvas.height - ballRadius) {
        /* another way of saying, if it lands on the paddle then 
        rebound the ball. 
        intersect, between these two  ordered pairs. */
        if (x > paddleX && x < paddleX + paddleWidth) {
            yIncrement = -yIncrement;
        }
        else {
            alert("Game Over");
            document.location.reload();
            clearInterval(interval);
        }
    }

    //stops paddle from scrolling off of canvas, sets boundary
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        //paddle speed and fluidity
        paddleX += 3;
    }
    else if (leftPressed && paddleX > 0) {
        //paddle speed and fluidity
        paddleX -= 3;
    }

    /*  set the positionary speed variable to the 
     place holding positionary variable */
    x += xIncrement;
    y += yIncrement;
}

var interval = setInterval(draw, 10);