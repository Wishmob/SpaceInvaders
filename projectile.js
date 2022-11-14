class Projectile extends Box {
    constructor(location, width, height, img) {
        super(location, width, height, img);
        //speed of both player ('up') and enemy ('down') projectiles
        this.speed = {
            up: createVector(0, -6),
            down: createVector(0, 2)
        }
    }

    //used to dispose projectiles when hitting edges of canvas
    hitEdges() {
        if (this.location.y < 0 | this.location.y + this.height > height) {
            return true;
        }
    }
}