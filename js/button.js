class Button {

  overBox = false;
  locked = false;
  toogle = false;
  swtch = false;

  constructor(x, y, width, height, name, toogle) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.name = name;
    this.toogle = toogle;
  }

  draw() {
   let focusOn = mouseX > this.x - this.width &&
          mouseX < this.x + this.width &&
          mouseY > this.y - this.height &&
          mouseY < this.y + this.height;
   this.overBox = focusOn;
   if(this.toogle && this.swtch) {
     this.show('pressed');
   } else if(focusOn) {
     this.show(this.locked ? 'pressed' : 'focusOn');
   } else {
     this.show('focusOff');
   }
  }

  show(state) {
    strokeWeight(4);
    switch (state) {
      case 'focusOn':
        stroke(105, 138, 118);
        fill(164, 255, 201);
        break;
      case 'focusOff':
        stroke(236, 255, 244);
        fill(164, 255, 201);
        break;
      case 'pressed':
        noStroke();
        fill(105, 138, 118);
        break;
      default:
    }
    rect(this.x, this.y, this.width, this.height, 20);
    state !== 'pressed' ? fill(105, 138, 118) : fill(236, 255, 244);
    noStroke();
    textSize(this.height * 1.2);
    textAlign(CENTER, CENTER);
    text(this.name, this.x, this.y);
  }
}
