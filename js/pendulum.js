import { $, $$ } from "./script.js";
import { gravity, friction } from "./physics.js";

export class Pendulum {
  constructor(r, angle = 90, real = true, c = color(255, 0, 0), anchor = null) {
    this.anchor = anchor || createVector(width / 2, 10);
    this.length = r;
    this.angle = radians(angle);
    this.start_angle = this.angle;
    this.max_angle = 90;
    this.velocity = 0;
    this.acceleration = 0;
    this.dumping = 1 - friction;
    this.pos = createVector(
      this.anchor.x + this.length * sin(this.angle),
      this.anchor.y + this.length * cos(this.angle)
    );
    this.wave = [];
    this.real = real;
    this.color = c;
    this.res = 5;
    this.scale = 100;
    this.waveLength = ceil((0.9 / this.res) * width);
    this.angle_slider = null;
    this.activeSlider = false;
  }

  show() {
    fill(255);
    stroke(0);
    ellipse(this.anchor.x, this.anchor.y, 8, 8);
    stroke(255);
    line(this.anchor.x, this.anchor.y, this.pos.x, this.pos.y);
    fill(this.color);
    stroke(0);
    ellipse(this.pos.x, this.pos.y, 32, 32);
  }

  show_GUI() {
    const createSlider = (text, value, min_value = 0, max_value = 90) => {
      const fieldset = document.createElement("fieldset");
      fieldset.classList.add("slider");
      const legend = document.createElement("legend");
      legend.textContent = text;
      fieldset.appendChild(legend);

      // Slider
      const slider = document.createElement("input");
      slider.style.color = str(this.color.toString("#rrggbb"));
      slider.type = "range";
      slider.min = str(min_value);
      slider.max = str(max_value);
      slider.value = this.length;

      // Labels
      const minLabel = document.createElement("span");
      minLabel.textContent = slider.min;
      minLabel.classList.add("minMaxLabel");

      const maxLabel = document.createElement("span");
      maxLabel.textContent = slider.max;
      maxLabel.classList.add("minMaxLabel");

      fieldset.appendChild(minLabel);
      fieldset.appendChild(slider);
      fieldset.appendChild(maxLabel);

      $("#controls_container").appendChild(fieldset);

      slider.addEventListener("input", () => {
        this[value] = float(slider.value);
      });

      return slider;
    };

    this.length_slider = createSlider("Length", "length", 50, 500);
  }

  show_graphics() {
    push();
    translate(0.05 * width, 0.8 * height);
    strokeWeight(4);
    stroke(this.color);
    noFill();
    beginShape();
    for (let i = 0; i < this.waveLength; i++) {
      vertex(this.res * i, this.wave[i]);
    }
    endShape();
    if (this.wave.length > this.waveLength - 10) {
      this.wave.shift();
    }
    stroke(255);
    line(0, -this.scale, 0, this.scale);
    line(0, 0, 0.9 * width, 0);
    pop();
    this.showCompass();
  }

  showCompass() {
    // Compass circle
    stroke(255);
    noFill();

    const compassRadius = 100; // Radius of the compass circle
    arc(this.anchor.x, this.anchor.y, compassRadius * 2, compassRadius * 2, 0, PI);

    // Optional: draw degree marks
    for (let i = 0; i < 360; i += 30) {
      const angle = radians(i);
      const x1 = this.anchor.x + compassRadius * cos(angle);
      const y1 = this.anchor.y + compassRadius * sin(angle);
      const x2 = this.anchor.x + (compassRadius - 10) * cos(angle);
      const y2 = this.anchor.y + (compassRadius - 10) * sin(angle);
      line(x1, y1, x2, y2);
    }

    // Pointer (based on current angle)
    const pointerX = this.anchor.x + compassRadius * cos(-this.angle + radians(this.max_angle));
    const pointerY = this.anchor.y + compassRadius * sin(-this.angle + radians(this.max_angle));
    stroke(this.color);
    fill(this.color);
    ellipse(pointerX, pointerY, 10, 10); // Draw pointer end
  }

  update() {
    if (this.activeSlider) {
      return;
    }

    var aprox_term = this.real ? sin(this.angle) : this.angle;
    this.acceleration = (-gravity * aprox_term) / this.length;
    this.velocity += this.acceleration;
    // this.velocity *= this.dumping; // Friction
    this.angle += this.velocity;

    this.wave.push(map(this.angle, this.start_angle, -this.start_angle, -this.max_angle, this.max_angle));

    this.pos.x = this.anchor.x + this.length * sin(this.angle);
    this.pos.y = this.anchor.y + this.length * cos(this.angle);
  }

  isClicked() {
    const d = dist(this.pos.x, this.pos.y, mouseX, mouseY);
    if (d < 32) {
      this.pos = createVector(mouseX, mouseY);
    }
  }
}
