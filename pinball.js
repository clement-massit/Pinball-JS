import Matter from "matter-js";
let COLORWALL = "#9B00E8";
// let stopperGroup = Matter.Body.nextGroup(true);
export const createPinball = function createPinball() {
  // x/y are set to when pinball is launched
  let pinball = Matter.Bodies.circle(415, 610, 14, {
    label: "pinball",

    // collisionFilter: {
    //   group: stopperGroup,
    // },
    render: {
      fillStyle: COLORWALL,
    },
  });
  return pinball;
};

export const launchPinball = function launchPinball() {
  // updateScore(0);
  let pinball = createPinball();
  Matter.Body.setPosition(pinball, { x: 415, y: 570 });
  Matter.Body.setVelocity(pinball, { x: 0, y: -25 + rand(-2, 2) });
  Matter.Body.setAngularVelocity(pinball, 0);
};
export const rand = function rand(min, max) {
  return Math.random() * (max - min) + min;
};
