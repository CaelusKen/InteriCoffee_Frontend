import * as THREE from 'three'

export interface Furniture {
    id: number;
    name: string;
    model: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    visible: boolean;
}

export interface FurnitureWithRef extends Furniture {
    ref: THREE.Group | null;
  }

export interface Room {
    width: number;
    length: number;
    height: number;
}

export interface TransformUpdate {
    id: number;
    type: 'position' | 'rotation' | 'scale';
    value: [number, number, number];
}