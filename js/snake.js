class Snake {

  queueDirections = [];
  queueEatenFood = [];
  body = [];
  countEatenFood = 0;


  constructor(playArea, speed, color, initLength, xdir, ydir) {
    this.playArea = playArea;
    this.speed = speed;
    this.color = color;
    this.initLength = initLength;
    this.xdir = xdir;
    this.ydir = ydir;
    let startPoint = playArea.getStartPoint();
    let cp, dp;
    let xd = playArea.space * this.xdir;
    let yd = playArea.space * this.ydir
    for(let i = 0; i < this.initLength; i++) {
      if(i === 0) {
        cp = startPoint;
        dp = new Point(startPoint.x + xd, startPoint.y + yd);
      } else {
        cp = new Point(this.body[i-1].cp.x - xd, this.body[i-1].cp.y - yd);
        dp = new Point(this.body[i-1].cp.x, this.body[i-1].cp.y);
      }
      this.body[i] = new Part(cp, dp);
    }
  }

  draw() {
    stroke(this.color);
    strokeWeight(this.playArea.weight);
    for(let i = 0; i < this.body.length - 1; i++) {
      // noStroke();
      // fill(this.color);
      // circle(this.body[i].cp.x, this.body[i].cp.y, this.playArea.weight);
      if(this.body[i].cp.x === this.body[i+1].cp.x ||
         this.body[i].cp.y === this.body[i+1].cp.y) {
        line(this.body[i].cp.x,   this.body[i].cp.y,
           this.body[i+1].cp.x, this.body[i+1].cp.y);
      } else {
        line(this.body[i].cp.x,   this.body[i].cp.y,
             this.body[i+1].dp.x, this.body[i+1].dp.y);
        line(this.body[i+1].dp.x, this.body[i+1].dp.y,
             this.body[i+1].cp.x, this.body[i+1].cp.y);
      }
    }
  }

  move() {
    let cp, dp, xd, yd;
    for(let i = 0; i < this.body.length; i++) {
      cp = this.body[i].cp;
      dp = this.body[i].dp;

      if(this.body[i].isGrowTail) {
        if(dp.equals(this.body[this.body.length - 2].cp)) {
          this.body[i].isGrowTail = false;
        }
        continue;
      }

      if(cp.x === dp.x) { // UP or DOWN
        xd = 0;
        yd = cp.y < dp.y ? 1 : -1;
      } else { // LEFT or RIGHT
        yd = 0;
        xd = cp.x < dp.x ? 1 : -1;
      }

      cp.x += xd * this.speed;
      cp.y += yd * this.speed;

      if(cp.equals(dp)) {
        if(i === 0) {
          if(this.queueDirections.length > 0) {
            this.changeDirection(this.queueDirections.shift());
          }
          dp.x += this.xdir * this.playArea.space;
          dp.y += this.ydir * this.playArea.space;
          continue;
        }
        dp.x = this.body[i - 1].cp.x;
        dp.y = this.body[i - 1].cp.y;
      }
    }
    this.grow();
  }

  grow() {
    if(this.queueEatenFood.length > 0) {
      let firstFood = this.queueEatenFood[0];
      if(firstFood.point.equals(this.body[this.body.length - 1].cp)) {
        let cp = firstFood.point;
        let dp = new Point(this.body[this.body.length - 1].dp.x,
                           this.body[this.body.length - 1].dp.y);
        let growTail = new Part(cp, dp);
        growTail.isGrowTail = true;
        this.body.push(growTail);
        this.queueEatenFood.shift();
      }
    }
  }

  eat(food) {
    if(food.point.equals(this.body[0].cp)) {
       this.queueEatenFood.push(food);
       this.countEatenFood++;
       return true;
    }
    return false;
  }

  isAlive() {
    let head = this.body[0].cp;
    if(head.x < this.playArea.x ||
       head.y < this.playArea.y ||
       head.x > this.playArea.width ||
       head.y > this.playArea.height + this.playArea.y) {
      return false;
    }
    for(let i = 1; i < this.body.length; i++) {
      if(head.equals(this.body[i].cp)) return false;
    }
    return true;
  }

  changeDirection(keyCode) {
    switch (keyCode) {
      case LEFT_ARROW:
        if(this.xdir !== 1)  this.setDir(-1, 0);
        break;
      case RIGHT_ARROW:
        if(this.xdir !== -1) this.setDir(1, 0);
        break;
      case UP_ARROW:
        if(this.ydir !== 1)  this.setDir(0, -1);
        break;
      case DOWN_ARROW:
        if(this.ydir !== -1) this.setDir(0, 1);
        break;
      default:
    }
  }

  setDir(xdir, ydir) {
    this.xdir = xdir;
    this.ydir = ydir;
  }
}

class Part {
  isGrowTail = false;
  constructor(cp, dp) {
    this.cp = cp;
    this.dp = dp;
  }
}
