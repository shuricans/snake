class PlayArea {

  xAxisValues = [];
  yAxisValues = [];

  constructor(x, y, weight, rows, columns) {
    this.x = x;
    this.y = y;
    this.weight = weight;
    this.rows = rows;
    this.columns = columns;
    this.space = weight + 2;
    this.width = columns * this.space + 2;
    this.height = rows * this.space + 2;
    this.initAxis();
  }

  initAxis() {
    let d = 2 + this.weight;
    let y = this.y + 2 + this.weight / 2;
    for(let i = 0; i < this.rows; i++) {
      this.yAxisValues[i] = y;
      y += d;
    }
    let x = this.x + 2 + this.weight / 2;
    for(let i = 0; i < this.columns; i++) {
      this.xAxisValues[i] = x;
      x += d;
    }
  }

  getRandomPoint() {
    return new Point(random(this.xAxisValues), random(this.yAxisValues));
  }

  getStartPoint() {
    return new Point(this.xAxisValues[0],
                     this.yAxisValues[floor(this.rows/2)]);
  }

  drawGrille() {
    stroke(0);
    strokeWeight(1);
    for(let i = 0; i < this.rows; i++) {
      line(this.x, this.yAxisValues[i], this.width, this.yAxisValues[i]);
    }
    for(let i = 0; i < this.columns; i++) {
      line(this.xAxisValues[i], this.y, this.xAxisValues[i], this.height + 40);
    }
  }
}
