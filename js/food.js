class Food {
  point;
  angle = 0;
  constructor(playArea, snake, color, price, isRegular) {
    this.playArea = playArea;
    this.color = color;
    this.price = price;
    this.isRegular = isRegular;
    this.d = isRegular ? playArea.weight : playArea.weight * 1.5;

    outer: while (true) {
      this.point = playArea.getRandomPoint();
      for(let i = 0; i < snake.body.length - 1; i++) {
        if(snake.body[i].cp.x === snake.body[i+1].cp.x ||
           snake.body[i].cp.y === snake.body[i+1].cp.y) {
          if(isOnLine(this.point, snake.body[i].cp, snake.body[i+1].cp)) {
            continue outer;
          }
        } else {
          if(isOnLine(this.point, snake.body[i].cp, snake.body[i+1].dp) ||
             isOnLine(this.point, snake.body[i+1].cp, snake.body[i+1].dp)) {
            continue outer;
          }
        }
      }
      break;
    }
  }

  draw() {
    let d = abs(sin(this.angle)) * this.d * 0.2  + this.d * 0.8;
    noStroke();
    fill(this.color);
    circle(this.point.x, this.point.y, d);
    this.angle += 0.05;
    if(!this.isRegular) {
      fill(0);
      circle(this.point.x, this.point.y, this.playArea.weight * 0.7);
    }
  }
}

// //(x-x1)*(y2-y1)-(y-y1)*(x2-x1) === 0
function isOnLine(p, p1, p2) {
  if(p1.x === p2.x && p1.y === p2.y) { // dot
    if(p.x === p1.x && p.y === p1.y) {
      // print('d p('+ p.x + ':' + p.y + ') p1(' + p1.x + ':' + p1.y + ') p2(' + p2.x + ':' + p2.y + ')');
      return true;
    }
  } else if((p.x - p1.x)*(p2.y - p1.y)-(p.y - p1.y)*(p2.x - p1.x) === 0) { // on ray
      if(p1.x === p2.x) { // vertical line
        if((p1.y <= p.y && p.y <= p2.y)||(p2.y <= p.y && p.y <= p1.y)) {
          // print('v p('+ p.x + ':' + p.y + ') p1(' + p1.x + ':' + p1.y + ') p2(' + p2.x + ':' + p2.y + ')');
          return true;
        }
      }
      if(p1.y === p2.y) { // horizontal line
        if((p1.x <= p.x && p.x <= p2.x) ||(p2.x <= p.x && p.x <= p1.x)) {
          // print('h p('+ p.x + ':' + p.y + ') p1(' + p1.x + ':' + p1.y + ') p2(' + p2.x + ':' + p2.y + ')');
          return true;
        }
      }
    }
    return false;
}
