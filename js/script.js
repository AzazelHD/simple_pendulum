import { Pendulum } from "./pendulum.js";
import { GUI } from "./GUI.js";

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

let bob, bob2;

function setup() {
  createCanvas(windowWidth, windowHeight, P2D, $("canvas"));
  bob = new Pendulum(0.5 * windowHeight, 10, true);
  bob2 = new Pendulum(0.5 * windowHeight, 30, false, color(0, 100, 255));
  bob.show_GUI();
  bob2.show_GUI();
}

function draw() {
  background(50);
  bob.show(color(255, 0, 0));
  bob.show_graphics();
  bob.update();

  bob2.show(color(0, 100, 255));
  bob2.show_graphics();
  bob2.update();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mouseDragged() {
  bob.isClicked();
  bob2.isClicked();
}

window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
window.mouseDragged = mouseDragged;
