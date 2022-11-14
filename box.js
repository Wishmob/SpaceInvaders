//Class to be inherited by all visible objects 
//Contains functions to display & move objects and detect hits among
//each other to be refined and individualized for each inheriting class
class Box {
    constructor(location, width, height, img) {
        this.location = location;
        this.width = width;
        this.height = height;
        this.img = img;
    }

    display() {
        //to show Hitboxes for debugging purpose or 4 FUN lol xD
        if (showHitboxes) {
            fill(50, 255, 0);
            rect(this.location.x, this.location.y, this.width, this.height);
        }
        image(this.img, this.location.x, this.location.y, this.width, this.height);
    }

    //all other inheriting classes but shields have got their own speed individual speed
    move(direction) {
        this.location.add(this.speed[direction]);
    }

    gotHit(projectile) {
        if (projectile.location.y <= this.location.y + this.height &&
            projectile.location.y + projectile.height >= this.location.y &&
            projectile.location.x + projectile.width >= this.location.x &&
            projectile.location.x <= this.location.x + this.width) {
            return true
        }
    }
}