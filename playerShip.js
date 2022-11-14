class PlayerShip extends Box {
  constructor(location, width, height, img) {
    super(location, width, height, img);
    this.lives = 3;
    const speed = 8;
    this.speed = {
      right: createVector(speed, 0),
      left: createVector(speed * -1, 0)
    }
  }

  //shows mini player ships in the top left corner representing the players
  //remaining lives
  displayLives() {
    for (let i = 1; i <= this.lives; i++) {
      image(this.img, i * 40 - 15, 20, 35, 30)
    }
  }

  //move & stop movement of player ship at r&l edges of the screen
  move(direction) {
    super.move(direction);
    if (this.location.x < 0) {
      this.location.x = 0
    } else if (this.location.x + this.width > width) {
      this.location.x = width - this.width
    }
  }


}