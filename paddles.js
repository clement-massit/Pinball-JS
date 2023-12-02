import Matter from "matter-js";

const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const bufferGroup = Matter.Body.nextGroup(true);
const COLORS = {
  PADDLE: "#00F1FF",
};

export const paddles = function paddles() {
  let leftPaddle = Bodies.trapezoid(190, 540, 25, 80, 0.25, {
    label: "leftPaddle",
    angle: (2 * Math.PI) / 3,
    chamfer: { radius: 10 },
    isSleeping: true,
    render: { fillStyle: COLORS.PADDLE },
  });
  let leftHinge = Bodies.circle(172, 529, 5, { isStatic: true });
  let leftConstraint = Constraint.create({
    bodyA: leftPaddle,
    bodyB: leftHinge,
    pointA: { x: -18, y: -11 },
    stiffness: 0,
    length: 0,
  });
  let leftBlock = Bodies.rectangle(200, 550, 30, 30, {
    isStatic: false,
    render: { visible: false },
  });
  let leftWeight = Constraint.create({
    bodyA: leftPaddle,
    bodyB: leftBlock,
    pointA: { x: 13, y: 11 },
    stiffness: 1,
    length: 1,
    render: { visible: false },
  });

  let rightPaddle = Bodies.trapezoid(300, 540, 25, 80, 0.25, {
    label: "rightPaddle",
    angle: (4 * Math.PI) / 3,
    chamfer: { radius: 10 },
    isSleeping: false,
    render: { fillStyle: COLORS.PADDLE },
  });
  let rightHinge = Bodies.circle(318, 529, 5, { isStatic: true });
  let rightConstraint = Constraint.create({
    bodyA: rightPaddle,
    bodyB: rightHinge,
    pointA: { x: 18, y: -11 },
    stiffness: 0,
    length: 0,
  });
  let rightBlock = Bodies.rectangle(290, 550, 30, 30, {
    isStatic: false,
    render: { visible: false },
  });
  let rightWeight = Constraint.create({
    bodyA: rightPaddle,
    bodyB: rightBlock,
    pointA: { x: -13, y: 11 },
    stiffness: 1,
    length: 1,
    render: { visible: false },
  });
  //

  let topPaddle = Bodies.trapezoid(68, 350, 25, 80, 0.25, {
    label: "topPaddle",
    angle: (2 * Math.PI) / 3,
    chamfer: { radius: 10 },
    isSleeping: true,
    render: { fillStyle: COLORS.PADDLE },
    isStatic: false,
  });
  let topHinge = Bodies.circle(50, 339, 5, { isStatic: true });
  let topConstraint = Constraint.create({
    bodyA: topPaddle,
    bodyB: topHinge,
    pointA: { x: -18, y: -11 },
    stiffness: 0,
    length: 0,
  });
  let topBlock = Bodies.rectangle(80, 339, 30, 30, {
    isStatic: false,
    render: { visible: false },
  });
  let topWeight = Constraint.create({
    bodyA: topPaddle,
    bodyB: topBlock,
    pointA: { x: 13, y: 11 },
    stiffness: 1,
    length: 1,
    render: { visible: false },
  });

  //

  let leftBuffer = Bodies.circle(190, 605, 50, {
    label: "buffer",
    isStatic: true,
    render: { visible: false },
  });
  let leftTopBuffer = Bodies.circle(190, 450, 50, {
    label: "buffer",
    isStatic: true,
    render: { visible: false },
  });
  let rightBuffer = Bodies.circle(300, 605, 50, {
    label: "buffer",
    isStatic: true,
    render: { visible: false },
  });
  let rightTopBuffer = Bodies.circle(300, 450, 50, {
    label: "buffer",
    isStatic: true,
    render: { visible: false },
  });
  let topBuffer = Bodies.circle(80, 420, 50, {
    label: "buffer",
    isStatic: true,
    render: { visible: false },
  });
  let topTopBuffer = Bodies.circle(80, 265, 50, {
    label: "buffer",
    isStatic: true,
    render: { visible: false },
  });
  // leftBlock.collisionFilter = {
  //   group: -1,
  //   category: 2,
  //   mask: 0,
  // };
  // leftPaddle.collisionFilter = {
  //   group: 1,
  //   category: 1,
  // };

  return [
    leftPaddle,
    leftWeight,
    leftHinge,
    leftBlock,
    leftConstraint,
    rightPaddle,
    rightWeight,
    rightBlock,
    rightHinge,
    rightConstraint,
    leftBuffer,
    rightBuffer,
    leftTopBuffer,
    rightTopBuffer,
    topPaddle,
    topWeight,
    topHinge,
    topBlock,
    topConstraint,
    topBuffer,
    topTopBuffer,
  ];
};
