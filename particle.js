function p2pdistance(p1, p2, x, y) {
  const num = abs(
    (p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x
  );
  const den = p5.Vector.dist(p1, p2);
  return num / den;
}

class Particle {
  constructor(brain) {
    this.fitness = 0;
    this.dead = false;
    this.finished = false;
    this.pos = createVector(start.x, start.y);
    this.vel = createVector();
    this.acc = createVector();
    this.maxspeed = 5;
    this.maxforce = 0.2;
    this.sight = SIGHT;
    this.rays = [];
    this.closestPoints = [];
    this.index = 0;
    this.counter = 0;

    for (let a = -45; a < 45; a += 10) {
      this.rays.push(new Ray(this.pos, radians(a)));
    }
    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(this.rays.length, this.rays.length * 2, 2);
    }
  }

  dispose() {
    this.brain.dispose();
  }

  mutate() {
    this.brain.mutate(MUTATION_RATE);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    if (!this.dead && !this.finished) {
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(this.maxspeed);
      this.acc.set(0, 0);
      this.counter++;
      if (this.counter > LIFESPAN) {
        this.dead = true;
      }

      for (let i = 0; i < this.rays.length; i++) {
        this.rays[i].rotate(this.vel.heading());
      }
    }
  }

  check(checkpoints) {
    if (!this.finished) {
      this.goal = checkpoints[this.index];
      const d = p2pdistance(this.goal.a, this.goal.b, this.pos.x, this.pos.y);
      if (d < 5) {
        this.index = (this.index + 1) % checkpoints.length;
        this.fitness++;
        this.counter = 0;
      }
    }
  }

  // if (this.finished) {
  // } else {
  //   const d = p5.Vector.dist(this.pos, target);
  //   this.fitness = constrain(1 / d, 0, 1);
  // }

  calculateFitness() {
    this.fitness = pow(2, this.fitness);
  }

  look(walls) {
    const inputs = [];
    this.closestPoints = [];

    for (let i = 0; i < this.rays.length; i++) {
      const ray = this.rays[i];
      let closest = null;
      let record = SIGHT;
      for (let wall of walls) {
        const pt = ray.cast(wall);
        if (pt) {
          const d = p5.Vector.dist(this.pos, pt);
          if (d < record && d < SIGHT) {
            record = d;
            closest = pt;
            this.rays[i].closestPt = pt;
            this.closestPoints.push(closest);
          } else {
            this.rays[i].closestPt = createVector(
              this.rays[i].pos.x + this.rays[i].dir.x * SIGHT,
              this.rays[i].pos.y + this.rays[i].dir.y * SIGHT
            );
          }
        }
      }

      if (record < 5) {
        this.dead = true;
      }

      inputs[i] = map(record, 0, SIGHT, 1, 0);

      if (closest) {
        // colorMode(HSB);
        // stroke((i + frameCount * 2) % 360, 255, 255, 50);
        // stroke(255);
        // line(this.pos.x, this.pos.y, closest.x, closest.y);
      }
    }
    // const vel = this.vel.copy();
    // vel.normalize();
    // inputs.push(vel.x);
    // inputs.push(vel.y);
    const output = this.brain.predict(inputs);
    let angle = map(output[0], 0, 1, -PI, PI);
    let speed = map(output[1], 0, 1, 0, this.maxspeed);
    angle += this.vel.heading();
    const steering = p5.Vector.fromAngle(angle);
    steering.setMag(speed);
    steering.sub(this.vel);
    steering.limit(this.maxforce);
    this.applyForce(steering);
    // console.log(output);
  }

  bounds() {
    if (
      this.pos.x > width ||
      this.pos.x < 0 ||
      this.pos.y > height ||
      this.pos.y < 0
    ) {
      this.dead = true;
    }
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    const heading = this.vel.heading();
    rotate(heading);

    noStroke();
    fill(0, 200, 255);
    rectMode(CENTER);
    //rect(0, 0, 30, 20);

    image(img2, -15, -10, 35, 20);

    pop();

    /*for (let i = 0; i < this.rays.length - 1; i++) {
      fill("rgba(0,160,255,0.1)");
      noStroke();
      triangle(
        this.pos.x,
        this.pos.y,
        this.rays[i].pos.x + this.rays[i].dir.x * SIGHT,
        this.rays[i].pos.y + this.rays[i].dir.y * SIGHT,
        this.rays[i + 1].pos.x + this.rays[i + 1].dir.x * SIGHT,
        this.rays[i + 1].pos.y + this.rays[i + 1].dir.y * SIGHT
      );
    }*/
  }

  drawTrail() {
    let points = [];
    let points2 = [];
    let points3 = [];
    let points4 = [];

    if (this.index < checkpoints.length - 1) {
      points.push(checkpoints[this.index + 1].a);
      points.push(checkpoints[this.index + 1].b);
    }

    if (this.index < checkpoints.length - 2) {
      points.push(checkpoints[this.index + 2].b);
      points.push(checkpoints[this.index + 2].a);

      points2.push(checkpoints[this.index + 2].a);
      points2.push(checkpoints[this.index + 2].b);
    }

    if (this.index < checkpoints.length - 3) {
      points2.push(checkpoints[this.index + 3].b);
      points2.push(checkpoints[this.index + 3].a);

      points3.push(checkpoints[this.index + 3].a);
      points3.push(checkpoints[this.index + 3].b);
    }

    if (this.index < checkpoints.length - 4) {
      points3.push(checkpoints[this.index + 4].b);
      points3.push(checkpoints[this.index + 4].a);

      points4.push(checkpoints[this.index + 4].a);
      points4.push(checkpoints[this.index + 4].b);
    }

    if (this.index < checkpoints.length - 5) {
      points4.push(checkpoints[this.index + 5].b);
      points4.push(checkpoints[this.index + 5].a);
    }

    //stroke(72, 219, 224);
    noStroke();
    strokeWeight(1);
    fill("rgba(72, 219, 224,0.5)");
    beginShape();
    for (let point of points) {
      vertex(point.x, point.y);
    }
    endShape(CLOSE);

    //stroke(124, 226, 230);
    noStroke();
    fill("rgba(124, 226, 230,0.5)");
    beginShape();
    for (let point of points2) {
      vertex(point.x, point.y);
    }
    endShape(CLOSE);

    //stroke(169, 218, 219);
    noStroke();

    strokeWeight(1);
    fill("rgba(165, 237, 240,0.5)");
    beginShape();
    for (let point of points3) {
      vertex(point.x, point.y);
    }
    endShape(CLOSE);

    noStroke();

    strokeWeight(1);
    fill("rgba(200, 245, 247,0.5)");
    beginShape();
    for (let point of points4) {
      vertex(point.x, point.y);
    }
    endShape(CLOSE);
  }

  highlight() {
    push();
    translate(this.pos.x, this.pos.y);
    const heading = this.vel.heading();
    rotate(heading);
    pop();
    this.drawTrail();
    for (let i = 0; i < this.rays.length - 1; i++) {
      fill("rgba(0, 100, 255,0.6)");
      noStroke();
      triangle(
        this.pos.x,
        this.pos.y,
        this.rays[i].pos.x + this.rays[i].dir.x * SIGHT,
        this.rays[i].pos.y + this.rays[i].dir.y * SIGHT,
        this.rays[i + 1].pos.x + this.rays[i + 1].dir.x * SIGHT,
        this.rays[i + 1].pos.y + this.rays[i + 1].dir.y * SIGHT
      );
    }
    for (let i = 0; i < this.closestPoints.length; i++) {
      noStroke();
      fill(0, 255, 0);
      ellipse(this.closestPoints[i].x, this.closestPoints[i].y, 8, 8);
    }
    if (this.goal) {
      this.goal.show(0, 0, 255, 2);
    }
  }
}
