let snake;
let food;
let playArea;
let mode;
let buttons = [];

const COLOR_SNAKE = '#40DA1D';
const COLOR_FOOD = ['#F1948A', '#C39BD3', '#85C1E9', '#76D7C4', '#F7DC6F', '#F4F6F7', '#D7DBDD'];
const COLOR_GOLD = '#FFF700';

const ROWS = 12;
const COLUMNS = 20;
const WEIGHT = 46;
const HEADER_HEIGHT = 40;
const X_PLAY_AREA = 0;
const Y_PLAY_AREA = HEADER_HEIGHT;

let score = 0;
let selector;

let speed = 4;
let speedTextValue = 'normal';
let lastSpeedTextValue = 'normal';

let timer;
let lifeTimeBonusFood;

let priceRegularFood;
let priceBonusFood;

const MAX_QUEUE_LENGTH = 3;
let lastKeyCode = null;
let offer = true;

function setup() {

    mode = 'lobby';

    playArea = new PlayArea(X_PLAY_AREA, Y_PLAY_AREA,
        WEIGHT, ROWS, COLUMNS);

    let canvas = createCanvas(playArea.width, playArea.height + HEADER_HEIGHT);
    canvas.parent('sketch-holder');

    button0 = new Button(playArea.width / 2, playArea.height * 0.7, 150, 60, 'play', false);
    button1 = new Button(button0.x / 2, playArea.height * 0.3, 110, 45, 'slow', true);
    button2 = new Button(button0.x, button1.y, button1.width, button1.height, 'normal', true);
    button3 = new Button(button1.x * 3, button1.y, button1.width, button1.height, 'fast', true);
    button2.swtch = true;
    selector = 2;
    buttons.push(button0);
    buttons.push(button1);
    buttons.push(button2);
    buttons.push(button3);

}

function draw() {
    switch (mode) {
        case 'lobby':
            background('#EFEFEF');
            rectMode(RADIUS);
            buttons.forEach(b => b.draw());
            break;
        case 'play':
            background(0);
            if (!timer.isActive() && !food.isRegular) {
                food = new Food(playArea, snake, random(COLOR_FOOD), priceRegularFood, true);
            }

            snake.move();

            if (snake.eat(food)) {
                if (!food.isRegular) {
                    timer.reset();
                }
                score += food.price;
                if (snake.countEatenFood % 10 === 0) {
                    food = new Food(playArea, snake, COLOR_GOLD, priceBonusFood, false);
                    timer.start();
                } else {
                    food = new Food(playArea, snake, random(COLOR_FOOD), priceRegularFood, true);
                }
            }

            food.draw();
            snake.draw();
            drawHeaderArea(score, speedTextValue, playArea);

            if (timer.isActive()) {
                stroke(COLOR_GOLD);
                strokeWeight(5);
                let t = map(timer.value, 0, timer.time, 0, playArea.width);
                line(0, HEADER_HEIGHT, t, HEADER_HEIGHT);
            }

            if (!snake.isAlive()) {
                lastSpeedTextValue = speedTextValue;
                mode = 'endGame';
            }

            break;
        case 'endGame':
            background('#EFEFEF');
            playArea.drawGrille();
            food.draw();
            snake.draw();
            drawHeaderArea(score, lastSpeedTextValue, playArea);
            rectMode(RADIUS);
            buttons.forEach(b => b.draw());
            if (offer && score > getBest()) {
                mode = 'offer';
                initAndShowMDRecord();
            }
            offer = false;
            break;
        default:
    }
}

function drawHeaderArea(score, speedTV, playArea) {
    fill(220);
    noStroke();
    rect(0, 0, playArea.width, HEADER_HEIGHT);
    textSize(30);
    fill(0);
    textAlign(LEFT, CENTER);
    let t1 = mode === 'play' ? 'score: ' : 'you score: ';
    text(t1 + score, 10, 20);
    textAlign(RIGHT, CENTER);
    text('speed: ' + speedTV, playArea.width - 10, 20);
}

function initNewGame() {
    offer = true;
    score = 0;
    switch (speed) {
        case 2:
            lifeTimeBonusFood = 6000;
            priceRegularFood = 10;
            priceBonusFood = 100;
            break;
        case 4:
            lifeTimeBonusFood = 4000;
            priceRegularFood = 20;
            priceBonusFood = 200;
            break;
        case 8:
            lifeTimeBonusFood = 2000;
            priceRegularFood = 40;
            priceBonusFood = 400;
            break;
        default:
    }
    timer = new Timer(50, lifeTimeBonusFood);
    snake = new Snake(playArea, speed, COLOR_SNAKE, 5, 1, 0);
    food = new Food(playArea, snake, random(COLOR_FOOD), priceRegularFood, true);
}

function keyPressed() {
    if (mode === 'play') {
        if (lastKeyCode !== keyCode || snake.queueDirections.length < MAX_QUEUE_LENGTH) {
            switch (keyCode) {
                case LEFT_ARROW:
                case RIGHT_ARROW:
                case UP_ARROW:
                case DOWN_ARROW:
                    lastKeyCode = keyCode;
                    snake.queueDirections.push(keyCode);
                    return false;
                case 32: // SPACE
                    initNewGame();
                    return false;
                default:
            }
        }
    } else if(mode !== 'offer') {
        switch (keyCode) {
            case LEFT_ARROW: // LEFT
                selector = selector === 1 ? 3 : selector - 1;
                buttons.forEach(b => {b.swtch = false; b.overBox = false;});
                buttons[selector].overBox = true;
                buttons[selector].swtch = true;
                switch (buttons[selector].name) {
                    case 'slow':
                        speed = 2;
                        speedTextValue = buttons[selector].name;
                        break;
                    case 'normal':
                        speed = 4;
                        speedTextValue = buttons[selector].name;
                        break;
                    case 'fast':
                        speed = 8;
                        speedTextValue = buttons[selector].name;
                        break;
                    default:
                }
                return false;
            case RIGHT_ARROW: // RIGHT;
                selector = selector === 3 ? 1 : selector + 1;
                buttons.forEach(b => {b.swtch = false; b.overBox = false;});
                buttons[selector].overBox = true;
                buttons[selector].swtch = true;
                switch (buttons[selector].name) {
                    case 'slow':
                        speed = 2;
                        speedTextValue = buttons[selector].name;
                        break;
                    case 'normal':
                        speed = 4;
                        speedTextValue = buttons[selector].name;
                        break;
                    case 'fast':
                        speed = 8;
                        speedTextValue = buttons[selector].name;
                        break;
                    default:
                }
                return false;
            case 32: // SPACE
                initNewGame();
                mode = 'play';
                return false;
                break;
            case UP_ARROW:
            case DOWN_ARROW:
                return false;
            default:
        }
    }
}

function mousePressed() {
    if (mode === 'lobby' || mode === 'endGame') {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].overBox) {
                buttons[i].locked = true;
                if (buttons[i].toogle) {
                    buttons.forEach(b => b.swtch = false);
                    buttons[i].swtch = true;
                }
                switch (buttons[i].name) {
                    case 'slow':
                        speed = 2;
                        speedTextValue = buttons[i].name;
                        break;
                    case 'normal':
                        speed = 4;
                        speedTextValue = buttons[i].name;
                        break;
                    case 'fast':
                        speed = 8;
                        speedTextValue = buttons[i].name;
                        break;
                    case 'play':
                        initNewGame();
                        mode = 'play';
                        break;
                    default:
                }
            } else {
                buttons[i].locked = false;
            }
        }
    }
}

function mouseReleased() {
    buttons.forEach(b => b.locked = false);
}
