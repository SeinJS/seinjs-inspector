/**
 * @File   : types.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/28/2019, 2:28:37 PM
 * @Description:
 */
import * as Sein from 'seinjs';

export interface ISystemInfo {
  system: {
    fps: number;
    memory: number;
    cpu: number;
  },
  engine: {
    tickerRunning: boolean;
    gamesCount: number;
    runningGamesCount: number;
  };
  game: {
    name: string;
    paused: boolean;
    // worlds-levels
    structure: string[][];
    actorsCount: number;
    actors: Sein.SArray<Sein.InfoActor>;
  };
  cameras: {
    refer: Sein.CameraComponent;
    name: string;
    ownerName: string;
    isMain: boolean;
    alive: boolean;
  }[];
  world: {
    name: string;
  };
  level: {
    name: string;
    alive: boolean;
    actorsCount: number;
    actors: Sein.SArray<Sein.ISceneActor>;
  };
  render: {
    shaders: number;
    programs: number;
    textures: number;
    buffers: number;
  };
  resource: {
    [type: string]: number;
  };
  events: {
    global: number;
    hid: number;
  };
  physic: {
    active: boolean;
    alive: boolean;
  };
}
