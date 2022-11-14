//Class of the shields (in this case Asteroids)
class Shield extends Box {
    constructor(location, width, height, img) {
        super(location, width, height, img);
        //How often the shield (Asteroids) can get hit before being destroyed
        this.endurance = 3;
    }

    //check if given projectile hit this Shield (Asteroid)
    gotHit(projectile) {
        if (dist(projectile.location.x + projectile.width / 2, projectile.location.y + projectile.height / 2,
            this.location.x + this.width / 2, this.location.y + this.height / 2) < this.width / 2) {
            return true;
        }
    }

    //Decrease size and reposition when getting hit by a projectile
    handleHit() {
        this.location.x += this.width * 1 / 6;
        this.location.y += this.height * 1 / 6;
        this.width *= 2 / 3;
        this.height *= 2 / 3;
    }
}