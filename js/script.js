import { Pendulum } from "./pendulum.js";
import { GUI } from "./GUI.js";

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

let bobs;
let myGUI;
let origin, bob, bob2;

function setup() {
  createCanvas(windowWidth, windowHeight, P2D, $("canvas"));
  origin = createVector(width / 2, 10);
  bob = new Pendulum(origin, 0.5 * height, 30, color(255, 0, 0));
  bob2 = new Pendulum(origin, 0.5 * height, 30, color(0, 100, 255), false);
  myGUI = new GUI(bob, bob2);
}

function draw() {
  background(50);
  bob.update();
  bob.show();

  bob2.update();
  bob2.show();

  myGUI.showGUI();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {}

function mouseReleased() {}

window.setup = setup;
window.draw = draw;
window.windowResized = windowResized;
window.mousePressed = mousePressed;
window.mouseReleased = mouseReleased;
