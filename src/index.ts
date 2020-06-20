import { RenderEngine } from './render';
import { PhysicsEngine } from './physics/physicsEngine';
import { Natrias } from './game';
import { KeyHandler } from './keyHandler';

// TODO: use calculation for sizes
const renderer = new RenderEngine(document.body, 10 * 50, 20 * 50);
const physics = new PhysicsEngine();
const keyHandler = new KeyHandler();

const natrias = new Natrias(renderer, physics, keyHandler);
