let xspacing = 46; // Distance between each horizontal location
let w; // Width of entire wave
let theta = 100; // Start angle at 0
let amplitude = 10; // Height of wave
let period = 400; // How many pixels before the wave repeats
let dx; // Value for incrementing x
let waves = []; // Using an array to store height values for the wave
let yvalues;
let Waves = [];
let numPoints = Math.floor(w / xspacing);
let thetas = [];

function setupConstants() {
  w = width + 18;
  dx = (TWO_PI / period) * xspacing;
  yvalues = new Array(floor(w / xspacing));
  for (let i = 0; i < 100; i += 5) {
    thetas.push(i);
  }
}

function drawWaves() {
  //fill(109, 134, 145);
  for (let i = 0; i < screenHeight + 120; i += 120) {
    waves = [];
    calcWave(i % thetas.length);
    renderWave(i);
  }
}

function calcWave(index) {
  // Increment theta (try different values for
  // 'angular velocity' here)
  for (let i = 0; i < thetas.length; i++) {
    thetas[i] += 0.007;
  }
  // For every x value, calculate a y value with sine function
  let x = thetas[index];
  for (let i = 0; i < yvalues.length; i++) {
    let yvalue = sin(x) * amplitude;
    waves.push(yvalue);
    x += dx;
  }
}

function renderWave(yposition) {
  strokeWeight(3);
  stroke(0, 191, 185);
  fill(0, 191, 185);
  for (let x = 0; x < waves.length - 1; x++) {
    line(
      x * xspacing,
      yposition + waves[x],
      (x + 1) * xspacing,
      yposition + waves[x + 1]
    );
  }
  noStroke();
  fill(0, 245, 215);
  for (let x = 0; x < waves.length; x++) {
    let width = random(1, 9);
    let height = random(1, 9);
    ellipse(x * xspacing, yposition + waves[x], 25, 25);
  }
}
