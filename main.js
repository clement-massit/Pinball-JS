import Matter from "matter-js";
let Engine = Matter.Engine,
  Render = Matter.Render,
  Events = Matter.Events,
  World = Matter.World,
  Bodies = Matter.Bodies,
  Constraint = Matter.Constraint;
import { paddles } from "./paddles";
import { createPinball, launchPinball, rand } from "./pinball";

let COLORWALL = "#9B00E8";
const COLOR = {
  BACKGROUND: "#212529",
  OUTER: "#495057",
  INNER: "#15aabf",
  BUMPER: "#fab005",
  BUMPER_LIT: "#fff3bf",
  PADDLE: "#e64980",
  PINBALL: "#dee2e6",
};
// score elements
let $currentScore = $(".current-score span");
let $highScore = $(".high-score span");

// shared variables
let currentScore, highScore;

let engine, bumper;

let leftPaddle;
let rightPaddle;
let topPaddle;
let topFired = false;
let leftFired = false;
let rightFired = false;

const bufferGroup = Matter.Body.nextGroup(false);
let paddleGroup = Matter.Body.nextGroup(true);
// render
function init() {
  currentScore = 0;
  highScore = 0;
  engine = Matter.Engine.create();

  let render = Matter.Render.create({
    element: document.getElementById("container"),
    engine: engine,
    options: {
      width: 520,
      height: 650,
      wireframes: false,
    },
  });

  const board = [paddles()];
  Matter.World.add(
    engine.world,
    board.reduce((prev, curr) => {
      return prev.concat(curr);
    })
  );
  Matter.World.add(engine.world, [
    wall(250, 0, 550, 30, 0), //top
    wall(10, 325, 20, 700, 0), //left
    wall(510, 325, 20, 700, 0), // right
    wall(250, 650, 550, 30, 0), //bottom
    wall(460, 380, 20, 520, 0), //launch wall
    customShape(480, 20, -1.5, CUSTOM_PATH), //top right corner

    wall(90, 440, 20, 100, 0),
    wall(400, 440, 20, 100, 0),
    wall(120, 500, 20, 80, -1),
    wall(370, 500, 20, 80, 1),

    bump(150, 200),
    bump(350, 200),
    // bump(200, 270),
    // bump(300, 270),
    bump(200, 130),
    bump(300, 130),
    bump(75, 75),

    reset(250, 635, 100, 2),
    reset(485, 529, 32, 2),

    customShape(510, 550, 0.94, CUSTOM_PATH),
    customShape(50, 650, -0.6, ground_custom),
    customShape(500, 650, -0.6, ground_custom),

    components(3, 315, 50, 60, 0.5, (0.85 * (3 * Math.PI)) / 4),
    components(440, 325, 50, 50, 0.5, -Math.PI / 2),
  ]);
  // Matter.World.add(engine.world, [
  //   //  x, y, width, height

  //   paddles(),

  //   // ground(200, 380, 250, 30, "#FF019A"),
  // ]);

  leftPaddle = engine.world.bodies.filter(
    (body) => body.label === "leftPaddle"
  )[0];
  rightPaddle = engine.world.bodies.filter(
    (body) => body.label === "rightPaddle"
  )[0];
  topPaddle = engine.world.bodies.filter(
    (body) => body.label === "topPaddle"
  )[0];

  let buffers = engine.world.bodies.filter((body) => body.label === "buffer");
  for (let buffer of buffers) {
    buffer.collisionFilter = { group: bufferGroup };
  }

  leftPaddle.collisionFilter = {
    group: bufferGroup,
    category: 935,
    mask: 2,
  };
  rightPaddle.collisionFilter = {
    group: bufferGroup,
    category: 935,
    mask: 2,
  };
  topPaddle.collisionFilter = {
    group: bufferGroup,
    category: 935,
    mask: 2,
  };
  launchPinball();
  paddleCommands();

  Matter.Render.run(render);

  // runner
  let runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  Matter.World.add(
    engine.world,
    Matter.MouseConstraint.create(engine, {
      mouse: Matter.Mouse.create(render.canvas),
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    })
  );
  Matter.Events.on(engine, "collisionStart", function (event) {
    let pairs = event.pairs;
    pairs.forEach(function (pair) {
      if (pair.bodyB.label === "pinball") {
        switch (pair.bodyA.label) {
          case "reset":
            updateScore(0);
            Matter.Body.setPosition(pair.bodyB, { x: 490, y: 500 });
            Matter.Body.setVelocity(pair.bodyB, { x: 0, y: -28 + rand(-2, 2) });
            Matter.Body.setAngularVelocity(pair.bodyB, 0);

            break;
          case "bumper":
            pingBumper(pair.bodyA);
            break;
        }
      }
    });
  });

  // Matter.Events.on(engine, "beforeUpdate", function (event) {
  //   // bumpers can quickly multiply velocity, so keep that in check
  //   Matter.Body.setVelocity(pinball, {
  //     x: Math.max(Math.min(pinball.velocity.x, MAX_VELOCITY), -MAX_VELOCITY),
  //     y: Math.max(Math.min(pinball.velocity.y, MAX_VELOCITY), -MAX_VELOCITY),
  //   });

  //   // cheap way to keep ball from going back down the shooter lane
  //   if (pinball.position.x > 450 && pinball.velocity.y > 0) {
  //     Matter.Body.setVelocity(pinball, { x: 0, y: -10 });
  //   }
  // });
}

// const CUSTOM_PATH = "200 300 200 10 0 0 200 0 300 200";
const CUSTOM_PATH = "100 0 75 50 100 100 25 100";
const ground_custom = "200 300 200 10 0 0 200 0 300 200";
const GRAVITY = 0.75;
const WIREFRAMES = false;
const BUMPER_BOUNCE = 1.5;
const PADDLE_PULL = 0.002;
const MAX_VELOCITY = 50;

function launch() {
  let pinball = createPinball();
  pinball.collisionFilter = { mask: 935, category: 2, group: 0 };
  World.add(engine.world, pinball);
  Matter.Body.setPosition(pinball, { x: 490, y: 500 });
  Matter.Body.setVelocity(pinball, { x: 0, y: -28 + rand(-2, 2) });
  Matter.Body.setAngularVelocity(pinball, 0);
}

function customShape(x, y, angle, path) {
  let vertices = Matter.Vertices.fromPath(path);
  return Matter.Bodies.fromVertices(x, y, vertices, {
    isStatic: true,
    angle: angle,
    render: { fillStyle: COLORWALL },
  });
}

function bump(x, y) {
  bumper = Matter.Bodies.circle(x, y, 20, {
    label: "bumper",
    isStatic: true,
    restitution: 3,
    render: {
      fillStyle: "#FF019A",
    },
  });

  bumper.restitution = BUMPER_BOUNCE;
  return bumper;
}

function wall(x, y, width, height, angle) {
  return Matter.Bodies.rectangle(x, y, width, height, {
    isStatic: true,
    angle: angle,
    chamfer: { radius: 10 },
    render: {
      fillStyle: COLORWALL,
    },
  });
}

function components(x, y, w, h, slope, angle) {
  return Matter.Bodies.trapezoid(x, y, w, h, slope, {
    isStatic: true,
    angle: angle,
    chamfer: { radius: 10 },
    render: { fillStyle: "#9B00E8" },
  });
}

function reset(x, y, w, h) {
  return Matter.Bodies.rectangle(x, y, w, h, {
    label: "reset",
    chamfer: { radius: 2 },
    isStatic: true,
    render: {
      fillStyle: "#00F1FF",
    },
  });
}

function firePaddle(e) {
  let keyCode = e.keyCode;
  if (
    keyCode === 37 &&
    leftPaddle.isSleeping === false &&
    leftFired === false &&
    topPaddle.isSleeping === false &&
    topFired === false
  ) {
    leftFired = true;
    topFired = true;
    Matter.Body.setAngularVelocity(leftPaddle, -1);
    Matter.Body.setAngularVelocity(topPaddle, -1);
  } else if (
    keyCode === 39 &&
    rightPaddle.isSleeping === false &&
    rightFired === false
  ) {
    rightFired = true;
    Matter.Body.setAngularVelocity(rightPaddle, 1);
  }
}

function releasePaddle(e) {
  let keyCode = e.keyCode;
  if (keyCode === 37) {
    leftFired = false;
    leftPaddle.isSleeping = false;
    topFired = false;
    topPaddle.isSleeping = false;
  } else if (keyCode === 39) {
    rightFired = false;
    rightPaddle.isSleeping = false;
  }

  // if (ballCount > 0) {
  //   // launch();
  //   if (listening === false) {
  //     // ballOut();
  //   }
  // } else {
  //   // newGame();
  // }
}
$(".left-trigger")
  .on("mousedown touchstart", function (e) {
    leftFired = true;
    Matter.Body.setAngularVelocity(leftPaddle, -1);
  })
  .on("mouseup touchend", function (e) {
    leftFired = false;
    leftPaddle.isSleeping = false;
    Matter.Body.setAngularVelocity(leftPaddle, 0);
  });
$(".right-trigger")
  .on("mousedown touchstart", function (e) {
    rightFired = true;
    Matter.Body.setAngularVelocity(rightPaddle, 1);
  })
  .on("mouseup touchend", function (e) {
    rightFired = false;
    rightPaddle.isSleeping = false;
    Matter.Body.setAngularVelocity(rightPaddle, 0);
  });

function paddleCommands() {
  document.addEventListener("keydown", function keyDown(e) {
    firePaddle(e);
  });
  document.addEventListener("keyup", function keyUp(e) {
    releasePaddle(e);
  });
}

function pingBumper(bumper) {
  updateScore(currentScore + 10);
  bumper.render.fillStyle = COLOR.BUMPER_LIT;
  setTimeout(function () {
    bumper.render.fillStyle = "#FF019A";
  }, 100);
}

function updateScore(newCurrentScore) {
  currentScore = newCurrentScore;
  $currentScore.text(currentScore);

  highScore = Math.max(currentScore, highScore);
  $highScore.text(highScore);
}

init();
launch();
paddleCommands();
