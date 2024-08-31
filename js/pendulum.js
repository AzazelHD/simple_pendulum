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
    this.active = false;
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
    if (this.active) {
      this.angle = atan2(mouseX - this.origin.x, mouseY - this.origin.y);

      this.velocity = 0;

      this.pos = createVector(
        this.origin.x + this.length * cos(this.angle),
        this.origin.y + this.length * sin(this.angle)
      );
    }
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

  mousePressed() {
    const d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (d < 2 * this.mass) {
      this.active = true;
    }
  }

  mouseReleased() {
    this.active = false;
  }
}
