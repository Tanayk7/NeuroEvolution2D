let TOTAL = 100;
let MUTATION_RATE = 0.1;
const LIFESPAN = 25;
let SIGHT = 50;
let generationCount = 0;
let walls = [];
let ray;
let cycles = 1;
let population = [];
let savedParticles = [];
let start, end;
let inside = [];
let outside = [];
let checkpoints = [];
let maxFitness = 1200;
let changeMap = false;
let img1, img2;
let screenWidth = 1000;
let screenHeight = 650;
let trackWidth = 60;
let noiseLevel = 3;
let totalWalls = 150;
let appState = {
  simulate: false,
  pause: false,
  restart: false
};

function buildTrack(noiseLevel, numWalls, wallWidth) {
  checkpoints = [];
  inside = [];
  outside = [];
  let noiseMax = noiseLevel;
  const total = numWalls;
  const pathWidth = wallWidth;
  let startX = random(1000);
  let startY = random(1000);
  for (let i = 0; i < total; i++) {
    let a = map(i, 0, total, 0, TWO_PI);
    let xoff = map(cos(a), -1, 1, 0, noiseMax) + startX;
    let yoff = map(sin(a), -1, 1, 0, noiseMax) + startY;
    let xr = map(noise(xoff, yoff), 0, 1, 100, width * 0.5);
    let yr = map(noise(xoff, yoff), 0, 1, 100, height * 0.5);
    let x1 = width / 2 + (xr - pathWidth) * cos(a);
    let y1 = height / 2 + (yr - pathWidth) * sin(a);
    let x2 = width / 2 + (xr + pathWidth) * cos(a);
    let y2 = height / 2 + (yr + pathWidth) * sin(a);
    inside.push(createVector(x1, y1));
    outside.push(createVector(x2, y2));
    checkpoints.push(new Boundary(x1, y1, x2, y2));
  }
  walls = [];
  for (let i = 0; i < checkpoints.length; i++) {
    let a1 = inside[i];
    let b1 = inside[(i + 1) % checkpoints.length];
    walls.push(new Boundary(a1.x, a1.y, b1.x, b1.y));
    let a2 = outside[i];
    let b2 = outside[(i + 1) % checkpoints.length];
    walls.push(new Boundary(a2.x, a2.y, b2.x, b2.y));
  }
  start = checkpoints[0].midpoint();
  end = checkpoints[checkpoints.length - 1].midpoint();
}

function preload() {
  img1 = loadImage("images/Car1.png");
  img2 = loadImage("images/Car2.png");
  bg = loadImage("images/background.jpeg");
}

function initPopulation() {
  for (let i = 0; i < TOTAL; i++) {
    population[i] = new Particle();
  }
}

function setup() {
  var canvas = createCanvas(screenWidth, screenHeight);
  canvas.parent("sketch-holder");
  frameRate(60);

  tf.setBackend("cpu");

  setupEnvironment();
}

function setupEnvironment() {
  buildTrack(noiseLevel, totalWalls, trackWidth);
  setupConstants();
  initPopulation();
}

function updateWidgets() {
  let mutationRate = document.getElementById("mutationSlider").value;
  MUTATION_RATE = mutationRate / 10;
  document.getElementById("mutationStat").innerHTML =
    mutationRate.toString() + "%";

  let vision = document.getElementById("visionSlider").value;
  SIGHT = vision;
  document.getElementById("visionStat").innerHTML = vision.toString() + "%";

  let speed = document.getElementById("speedSlider").value;
  cycles = speed;
  document.getElementById("speedStat").innerHTML = cycles.toString() + "%";

  let maximumFitness = document.getElementById("fitnessSlider").value;
  maxFitness = maximumFitness;
  document.getElementById("fitnessStat").innerHTML = maxFitness.toString();
}

function drawMap() {
  fill("rgba(138, 186, 207,1)");
  stroke("rgba(0, 0, 0,1)");
  strokeWeight(4);
  beginShape();
  for (let a = 0; a < outside.length; a++) {
    vertex(outside[a].x, outside[a].y);
  }
  endShape(CLOSE);

  for (let i = 0; i < checkpoints.length; i += 3) {
    checkpoints[i].show(153, 224, 255);
  }
  stroke("rgba(0,0, 0,1)");
  strokeWeight(4);
  fill("rgba(71, 71, 71,1)");
  beginShape();
  for (let a = 0; a < inside.length; a++) {
    vertex(inside[a].x, inside[a].y);
  }
  endShape(CLOSE);

  noFill();
  stroke("rgba(0, 0, 0,1)");
  strokeWeight(4);
  beginShape();
  for (let a = 0; a < outside.length; a++) {
    vertex(outside[a].x, outside[a].y);
  }
  endShape(CLOSE);
}

function simulate() {
  let bestP = population[0];
  for (let n = 0; n < cycles; n++) {
    for (let particle of population) {
      particle.look(walls);
      particle.show();
      particle.check(checkpoints);
      particle.bounds();
      particle.update();

      // Get the best one
      if (particle.fitness > bestP.fitness) {
        bestP = particle;
      }
    }

    //save a copy of all the
    for (let i = population.length - 1; i >= 0; i--) {
      const particle = population[i];
      if (particle.dead || particle.finished) {
        savedParticles.push(population.splice(i, 1)[0]);
      }

      if (!changeMap && particle.fitness > maxFitness) {
        changeMap = true;
      }
    }

    if (population.length !== 0 && changeMap) {
      for (let i = population.length - 1; i >= 0; i--) {
        savedParticles.push(population.splice(i, 1)[0]);
      }
      buildTrack(noiseLevel, totalWalls, trackWidth);
      nextGeneration();
      generationCount++;
      changeMap = false;
    }
    if (population.length == 0) {
      buildTrack(noiseLevel, totalWalls, trackWidth);
      nextGeneration();
      generationCount++;
    }
  }
  bestP.highlight();

  for (let particle of population) {
    particle.show();
  }

  fill(0);
  textSize(29);
  noStroke();
  textAlign(LEFT);
  text("Generation: " + generationCount, 20, 30);
  text("Alive: " + population.length, 20, 60);
  text("Fittest: " + Math.floor(bestP.fitness), 20, 90);
  text("Vision: " + SIGHT, 20, 120);
  text("Mutation rate: " + MUTATION_RATE, 20, 150);
}

function restartSimulation() {
  generationCount = 0;
  setupEnvironment();
  simulate();
}

function draw() {
  updateWidgets();
  fill(0, 245, 215);
  rect(0, 0, screenWidth, screenHeight);
  drawWaves();
  drawMap();
  if (appState.pause) {
    fill("rgba(0,0,0,0.5)");
    noStroke();
    rect(0, 0, screenWidth, screenHeight);

    textSize(50);
    textAlign(CENTER);
    fill(255);
    text("Simulation paused", screenWidth / 2, screenHeight / 2);
    console.log("Simulation is paused!");
  }
  if (appState.simulate) {
    simulate();
  }
  if (appState.restart) {
    restartSimulation();
    appState.restart = false;
  }
}
