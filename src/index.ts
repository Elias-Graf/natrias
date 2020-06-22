import { RenderEngine } from './render';
// import { PhysicsEngine } from './physics/physicsEngine';
import { Natrias } from './game';
import { KeyHandler } from './keyHandler';
import { ImprovedPhysicsEngine } from './physics/improvedPhysicsEngine';

// TODO: use calculation for sizes
const renderer = new RenderEngine(document.body, 10 * 50, 20 * 50);
// const physics = new PhysicsEngine();
const improvedPhysicsEngine = new ImprovedPhysicsEngine(10, 20, 5);
const keyHandler = new KeyHandler();

// new Natrias(renderer, physics, keyHandler);
new Natrias(renderer, improvedPhysicsEngine, keyHandler);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// (window as any).logBoard = physics.logBoard.bind(physics);
