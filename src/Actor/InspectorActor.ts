/**
 * @File   : InspectorActor.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2019/7/28 下午2:08:42
 *
 */
import * as Sein from "seinjs";
import { ISystemInfo } from "./types";
import renderer from "../UI/index";
export interface IInspectorActorOptions {
  /**
   * 指定渲染容器，不指定渲染到body下
   *
   * @defalut document.body
   */
  dom?: HTMLElement;
  /**
   * 更新率，一秒更新几次。
   *
   * @default 10
   */
  updateRate?: number;
}

export function isInspectorActor(value: Sein.SObject): value is InspectorActor {
  return (value as InspectorActor).isInspectorActor;
}

@Sein.SClass({ className: "InspectorActor" })
export default class InspectorActor extends Sein.InfoActor<
  IInspectorActorOptions
> {
  public isInspectorActor = true;
  public updatePriority = Sein.InfoActor.UPDATE_PRIORITY.Others;

  protected _info: ISystemInfo = {
    system: null,
    engine: null,
    game: null,
    cameras: null,
    world: null,
    level: null,
    render: null,
    physic: null,
    resource: null,
    events: null
  };
  protected _actor: Sein.SceneActor = null;
  protected _updateRate: number = 10;
  protected _delta: number = 0;
  protected _levelAlive = false;
  protected _physicAlive = false;
  protected _container: HTMLElement = document.body;
  // protected _popWindow: InspectorWindow;
  /**
   * 事件管理器。
   */
  get event(): Sein.EventManager<{ Update: { info: ISystemInfo } }> {
    return this._root.event as Sein.EventManager<{
      Update: { info: ISystemInfo };
      Control: { type: string };
    }>;
  }

  public onInit(initOptions: IInspectorActorOptions) {
    const { updateRate, dom } = initOptions;

    this.event.register("Update");
    this.event.register("Control");

    dom && (this._container = initOptions.dom);
    updateRate && (this._updateRate = initOptions.updateRate);
  }

  public onAdd(initOptions: IInspectorActorOptions) {
    const game = this.getGame();

    game.event.add("LevelDidInit", this.generateActor);
    game.event.add("WorldWillDestroy", this.clearActor);

    if (game.level) {
      this.generateActor();
    }

    this.sync(0);
    // alert(1231);
    this.renderUI();
  }

  private generateActor = () => {
    if (this._actor) {
      return;
    }

    const actor = (this._actor = this.getWorld().addActor(
      "forMonitor",
      Sein.SceneActor
    ));

    actor.persistent = true;
    actor.onUpdate = () => {
      this._levelAlive = true;
    };

    if (this.getPhysicWorld()) {
      const rigidBody = actor.addComponent(
        "rigidBody",
        Sein.RigidBodyComponent,
        { mass: 0, sleeping: true }
      );

      rigidBody.onUpdate = () => {
        this._physicAlive = true;
      };
    }
  };

  private clearActor = () => {
    this._actor = null;
  };

  public onError(error: Sein.BaseException, details: any) {
    return true;
  }

  public onUpdate(delta: number) {
    this._delta += delta;

    if (this._delta >= 1000 / this._updateRate) {
      this._delta = 0;
      this.sync(delta);
    }
  }

  protected sync(delta: number) {
    const game = this.getGame();
    const engine = game.parent as any;
    const world = this.getWorld();
    const level = this.getLevel();
    const physicWorld = this.getPhysicWorld();

    this._info = {
      system: {
        fps: 1000 / delta,
        memory: null,
        cpu: null
      },
      engine: {
        tickerRunning: !game.ticker.paused,
        gamesCount: engine._games.length,
        runningGamesCount: engine._runningGames.length
      },
      game: {
        name: game.name.value,
        paused: engine._runningGames.indexOf(game) < 0,
        structure: null,
        actorsCount: game.actors.length,
        actors: game.actors
      },
      cameras: world.mainCamera
        ? [
            {
              refer: world.mainCamera,
              name: world.mainCamera.name.value,
              ownerName: world.mainCamera.getOwner().name.value,
              isMain: true,
              alive: world.mainCamera.rendererAlive
            }
          ]
        : [],
      world: {
        name: world.name.value
      },
      level: {
        name: level.name.value,
        alive: this._levelAlive,
        actorsCount: level.actors.length,
        actors: level.actors
      },
      render: game.renderer as any,
      resource: {},
      events: {
        global: {},
        hid: {}
      },
      physic: {
        active: !!physicWorld,
        alive: this._physicAlive
      }
    };
    this.event.trigger("Update", this._info);
  }

  public onDestroy() {
    if (this._actor) {
      this._actor.removeFromParent();
    }
  }

  protected renderUI() {
    console.log(this._container);

    renderer(document.body);
  }
}