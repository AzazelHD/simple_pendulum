import { $, $$ } from "./script.js";

export class GUI {
  constructor(...bobs) {
    this.bobs = bobs;
    for (let bob of this.bobs) {
      this.createBobSlider(bob, "Length", "length", 10, 600);
    }
  }

  addBob(bob) {
    this.bobs.push(bob);
  }

  showGUI() {
    this.createCompass();
    this.createGraph();
  }

  createGraph({ xPadding = 0.05, yPadding = 0.8 } = {}) {
    const xStart = xPadding * width;
    const xEnd = (1 - xPadding) * width;
    const yStart = yPadding * height;
    const yLength = (1 - yPadding) * height * yPadding ** 2;

    const res = 3;
    const waveLength = ceil((xEnd - xStart) / res);
    const scaleFactor = yPadding * 2 * yLength;

    // X-axis
    stroke(255);
    strokeWeight(4);
    line(xStart, yStart, xEnd, yStart);

    noFill();
    strokeWeight(4);
    for (let bob of this.bobs) {
      beginShape();
      stroke(bob.color);
      for (let i = 0; i < bob.wave.length; i++) {
        vertex(xStart + res * i, yStart - bob.wave[i] * scaleFactor);
      }
      endShape();
      if (bob.wave.length > waveLength - 10) {
        bob.wave.shift();
      }
    }

    // Y-axis
    stroke(255);
    strokeWeight(4);
    line(xStart, yStart - yLength, xStart, yStart + yLength);
  }

  createCompass({ radius = 100, angle = PI, tickInterval = 30 } = {}) {
    const cx = this.bobs[0].origin.x;
    const cy = this.bobs[0].origin.y;

    // Draw arc representing the compass
    noFill();
    stroke(255);
    strokeWeight(2);
    arc(cx, cy, 2 * radius, 2 * radius, 0, angle);

    // Draw tick marks at regular intervals
    for (let i = 0; i <= degrees(angle); i += tickInterval) {
      const theta = radians(i);
      const cosTheta = cos(theta);
      const sinTheta = sin(theta);

      const x1 = cx + (radius - 10) * cosTheta;
      const y1 = cy + (radius - 10) * sinTheta;
      const x2 = cx + (radius + 10) * cosTheta;
      const y2 = cy + (radius + 10) * sinTheta;

      stroke(255);
      strokeWeight(2);
      line(x1, y1, x2, y2);

      fill(255);
      noStroke();
      if (theta < angle / 2) {
        textAlign(LEFT, CENTER);
      } else if (theta > angle / 2) {
        textAlign(RIGHT, CENTER);
      } else {
        textAlign(CENTER, CENTER);
      }
      textSize(10);
      text(`${i}º`, x2 + 10 * cosTheta, y2 + 10 * sinTheta);
    }
    for (let bob of this.bobs) {
      const [r, g, b] = bob.color.levels;
      fill(r, g, b, 150);
      noStroke();

      // Calculate the position of the dot on the compass
      const bobTheta = bob.angle; // Assuming bob.angle is the angle for each bob
      const dotX = cx + radius * sin(bobTheta);
      const dotY = cy + radius * cos(bobTheta);

      // Draw the dot
      ellipse(dotX, dotY, 16, 16);
    }
  }

  createBobSlider(bob, text, value, min_value, max_value) {
    const fieldset = document.createElement("fieldset");
    fieldset.classList.add("slider");
    const legend = document.createElement("legend");
    legend.textContent = text;
    fieldset.appendChild(legend);

    // Slider
    const slider = document.createElement("input");
    slider.style.color = str(bob.color.toString("#rrggbb"));
    slider.type = "range";
    slider.min = str(min_value);
    slider.max = str(max_value);
    slider.value = bob[value];

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
      bob[value] = float(slider.value);
    });

    // return slider;
  }
}
