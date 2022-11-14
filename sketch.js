/// <reference path='./TSDef/p5.global-mode.d.ts' />

"use strict";

let score;
let stopwatch;
let playerShip;
let enemies;
let shields;

let enemyDirection = "right";
let enemiesHitWall;

let playerProjectile;
let enemyProjectileReady;
let enemyProjectiles = [];

let enemyIMG;
let playerShipIMG;
let shieldIMG;
let playerProjectileIMG;
let enemyProjectileIMG;
let backgroundIMG;
let laserSound;
let explosionSound;
let scoreFont;

//change to true to display hitboxes of objects
const showHitboxes = false;

const enemiesPerRow = 8;
const enemyRows = 3;
const spaceBtwEn = 35;
let enemyWidth;

function preload() {
  enemyIMG = loadImage("./assets/enemyShip.png");
  playerShipIMG = loadImage("./assets/ship1.png");
  playerProjectileIMG = loadImage("./assets/laser.png");
  enemyProjectileIMG = loadImage("./assets/missile.png");
  backgroundIMG = loadImage("./assets/space_background.png");
  shieldIMG = loadImage("./assets/asteroid.png");

  laserSound = loadSound("./assets/Laser Shot.wav");
  explosionSound = loadSound("./assets/Explosion.wav");

  scoreFont = loadFont("./assets/firefightbb_reg.ttf");
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER);
  score = 0;
  playerShip = new PlayerShip(
    createVector(width / 2 - 60 / 2, height - 70),
    70,
    60,
    playerShipIMG
  );

  //create enemies
  enemyWidth = width / enemiesPerRow / 2;
  enemies = createEnemies();

  //enemy fire projectile each time this is set to true.
  enemyProjectileReady = true;
  setInterval(reloadEnemyProjectile, 3000);

  //create the 3 asteroids
  shields = createShields();

  stopwatch = new Stopwatch();
  stopwatch.start();
}

function draw() {
  background(backgroundIMG);
  stopwatch.update();
  playerShip.display();
  playerShip.displayLives();

  //display shields and check if any gets hit by player projectile
  for (let i = shields.length - 1; i >= 0; i--) {
    const shield = shields[i];
    shield.display();
    if (playerProjectile && shield.gotHit(playerProjectile)) {
      if (shield.endurance > 0) {
        shield.endurance--;
        shield.handleHit();
      } else {
        shields.splice(i, 1);
      }
      playerProjectile = false;
      explosionSound.play();
    }
  }

  //display enemies and handle hits
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (playerProjectile && enemy.gotHit(playerProjectile)) {
      enemies.splice(i, 1);
      playerProjectile = false;
      score += enemy.points;
      explosionSound.play();
    } else {
      enemy.display();
      enemy.move(enemyDirection);
    }
  }

  //shoot enemy projectile from random enemy when ready
  if (enemyProjectileReady) {
    const enemy = enemies[floor(random(enemies.length))];
    enemyProjectiles.push(
      new Projectile(
        createVector(enemy.location.x + enemy.width / 2, enemy.location.y + 31),
        8,
        12,
        enemyProjectileIMG
      )
    );
    enemyProjectileReady = false;
  }

  if (enemiesHitWall) {
    switchEnemyDirection();
    advanceEnemies();
    enemiesHitWall = !enemiesHitWall;
  }

  //display player projectile if existing
  if (playerProjectile) {
    playerProjectile.display();
    playerProjectile.move("up");
    if (playerProjectile.hitEdges()) {
      playerProjectile = false;
    }
  }

  //display enemy projectiles and detect hits with player & shields
  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    const projectile = enemyProjectiles[i];
    projectile.display();
    projectile.move("down");
    //check if enemy projectile hits player or edges
    if (playerShip.gotHit(enemyProjectiles[i])) {
      playerShip.lives--;
      enemyProjectiles.splice(i, 1);
      //reset playership to middle after hit
      playerShip.location.x = width / 2 - 60 / 2;
    } else if (projectile.hitEdges()) {
      enemyProjectiles.splice(i, 1);
    }
    //check if enemy projectile hits any shield
    for (let j = shields.length - 1; j >= 0; j--) {
      const shield = shields[j];
      if (shield.gotHit(projectile)) {
        if (shield.endurance > 0) {
          shield.endurance--;
          shield.handleHit();
          explosionSound.play();
        } else {
          shields.splice(j, 1);
        }
        enemyProjectiles.splice(i, 1);
      }
    }
  }

  if (playerShip.lives <= 0) {
    loseGame();
  }

  //If all enemies destroyed end game ->win
  if (enemies.length === 0) {
    fill(255, 0, 0, 120);
    textSize(90);
    text("VICTORY!", width / 2, 300);
    textSize(40);
    text("Your score " + score, width / 2, 370);
    noLoop();
  }

  //move playerShip
  if (keyIsDown(LEFT_ARROW)) {
    playerShip.move("left");
  } else if (keyIsDown(RIGHT_ARROW)) {
    playerShip.move("right");
  }

  //display score & game time
  fill(255, 0, 0, 120);
  textSize(20);
  textFont(scoreFont);
  textAlign(LEFT);
  text(
    "Time " +
      nf(stopwatch.minutes, 2) +
      ":" +
      nf(stopwatch.seconds, 2) +
      ":" +
      stopwatch.millisecs,
    340,
    45
  );
  textAlign(CENTER);
  text("Score " + score, 700, 45);
  stroke(color(255, 0, 0, 120));
}

function createEnemies() {
  let enemies = [];
  let newEnemy;
  let enemyLocation;
  for (let i = 0; i < enemyRows; i++) {
    for (let j = 0; j < enemiesPerRow; j++) {
      //location's x = width of 1 enemy plus additional space between enemies +
      //exact space to centralize at start with any number of enemies / row
      enemyLocation = createVector(
        j * (enemyWidth + spaceBtwEn) +
          (width / 4 - (enemiesPerRow * spaceBtwEn) / 2 + spaceBtwEn / 2),
        80 + i * 50
      );
      newEnemy = new Enemy(enemyLocation, enemyWidth, 30, enemyIMG);
      enemies.push(newEnemy);
    }
  }
  return enemies;
}

function createShields() {
  let shields = [];
  shields.push(new Shield(createVector(150, 400), 100, 100, shieldIMG));
  shields.push(new Shield(createVector(350, 400), 100, 100, shieldIMG));
  shields.push(new Shield(createVector(550, 400), 100, 100, shieldIMG));
  return shields;
}

function switchEnemyDirection() {
  enemyDirection = enemyDirection === "right" ? "left" : "right";
}

function advanceEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].move("down");
  }
}

//shoot laser with playerShip
function keyPressed() {
  //spacebar
  if ((keyCode === 32) & !playerProjectile) {
    playerProjectile = new Projectile(
      createVector(
        playerShip.location.x + playerShip.width / 2 - 3,
        playerShip.location.y - 12
      ),
      8,
      12,
      playerProjectileIMG
    );
    laserSound.play();
  }
}

function loseGame() {
  fill(255, 0, 0, 120);
  textSize(90);
  text("GAME OVER", width / 2, 300);
  textSize(40);
  text("Your score " + score, width / 2, 370);
  noLoop();
}

function reloadEnemyProjectile() {
  enemyProjectileReady = true;
}
