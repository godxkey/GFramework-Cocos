import { _decorator, Canvas, Component, find, Node } from 'cc';
import { MovementComponent } from './component/MovementComponent';
import { PositionComponent } from './component/PositionComponent';
import { ShapeComponent } from './component/ShapeComponent';
import { RenderComponent } from './component/RenderComponent';
import { MovementSystem } from './system/MovementSystem';
import { CollisionSystem } from './system/CollisionSystem';
import { RenderSystem } from './system/RenderSystem';
const { ccclass, property } = _decorator;

@ccclass('BasicCore')
export class BasicCore extends Component {
    private entityManager: gs.EntityManager;
    private systemManager: gs.SystemManager;
    private timeManager: gs.TimeManager;

    private canvas: Node;
    private sprite: Node;

    start() {
        this.entityManager = new gs.EntityManager([PositionComponent, MovementComponent, ShapeComponent, RenderComponent]);
        this.systemManager = new gs.SystemManager(this.entityManager);
        this.timeManager = gs.TimeManager.getInstance();
        this.canvas = find('Canvas');
        this.sprite = find('SpriteSplash', this.canvas);

        for (let i = 0; i < 20000; i ++) {
            const entity = this.entityManager.createEntity();
            entity.addComponent(PositionComponent, Math.random() * 100, Math.random() * 100);
            entity.addComponent(MovementComponent, Math.random() * 2 - 1, Math.random() * 2 - 1);
            entity.addComponent(ShapeComponent, 10, 10);
            entity.addComponent(RenderComponent, this.canvas, this.sprite);
        }

        this.systemManager.registerSystem(new MovementSystem(this.entityManager));
        this.systemManager.registerSystem(new CollisionSystem(this.entityManager));
        this.systemManager.registerSystem(new RenderSystem(this.entityManager));
    }

    update(deltaTime: number) {
        this.timeManager.update(deltaTime);
        this.systemManager.update();
    }
}

