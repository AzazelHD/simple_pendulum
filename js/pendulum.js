import { GUI } from "./GUI.js";
import { $, $$ } from "./script.js";
import { gravity, friction } from "./physics.js";

export class Pendulum {
  constructor(origin, length, angle, color, real = true) {
    this.origin = origin;
    this.length = length;
    this.angle = radians(angle);
    this.color = color;
    this.real = real;
    this.wave = [];
    this.velocity = 0;
    this.acceleration = 0;
    this.dumping = 1 - friction;
    this.pos = {
      x: this.origin.x + this.length * sin(this.angle),
      y: this.origin.y + this.length * cos(this.angle),
    };
    this.mass = 32;
  }

  show() {
    stroke(255);
    strokeWeight(this.mass * 0.1);
    line(this.origin.x, this.origin.y, this.pos.x, this.pos.y);
    stroke(0);
    fill(this.color);
    circle(this.pos.x, this.pos.y, 2 * this.mass);
  }

  show_graphics() {}

  update() {
    var aprox_term = this.real ? sin(this.angle) : this.angle;
    this.acceleration = (-gravity * aprox_term) / this.length;
    this.velocity += this.acceleration;
    // this.velocity *= this.dumping; // Friction
    this.angle += this.velocity;
    this.angle = Math.max(-90, Math.min(90, this.angle));

    this.wave.push(this.angle);

    this.pos.x = this.origin.x + this.length * sin(this.angle);
    this.pos.y = this.origin.y + this.length * cos(this.angle);
  }

  mousePressed() {}

  mouseReleased() {}
}
