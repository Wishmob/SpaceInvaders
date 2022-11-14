//class contains logic for the game time displayed at the top
class Stopwatch {
    constructor() {
        this.millisecs;
        this.seconds;
        this.minutes;
        this.started = false;
    }


    start(){
        this.millisecs = 0;
        this.seconds = 0;
        this.minutes = 0;
        this.started = true;
    }

    update(){
        if (this.started) {
            if (int(millis() / 100) % 10 != this.millisecs) {
              this.millisecs++;
        
            }
            if (this.millisecs >= 10) {
              this.millisecs -= 10;
              this.seconds++;
            }
            if (this.seconds >= 60) {
              this.seconds -= 60;
              this.minutes++;
            }
          }
    }
}