class Timer {

  constructor(interval, time) {
    this.interval = interval;
    this.time = time;
    this.value = 0;
  }

  start() {
    this.value = this.time;
    let interval = this.interval;
    let timerId = setInterval(() => {
      if(this.value > 0) {
        this.value -= interval;
      } else {
        clearInterval(timerId);
      }
    }, interval);
  }

  reset() {
    this.value = 0;
  }

  isActive() {
    return this.value > 0;
  }
}
