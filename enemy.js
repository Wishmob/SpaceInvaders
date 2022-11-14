class Enemy extends Box {
    constructor(location, width, height, img) {
        super(location, width, height, img);
        this.points = 40;
        const speed = 1;
        this.speed = {
            right: createVector(speed, 0),
            left: createVector(speed * -1, 0),
            down: createVector(0, 6)
        }
    }

    move(direction) {
        super.move(direction);
        //if enemy hits either side set flag to true to be used to switch direction
        //of all enemies at the exact same time
        if (this.location.x < 0 || this.location.x + this.width > width) {
            enemiesHitWall = true;
        }
        //lose game when enemies reach the height of the player ship
        if (this.location.y + this.height > height - 70) {
            loseGame();
        }
    }

}