import * as THREE from 'three'

export interface Furniture {
    id: number;
    name: string;
    model: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number, number];
    visible: boolean;
    characteristics?: string[];
    scaleFactor?: number;
    furnitureType?: string;
    description?: string;
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

export type MainCategory = string;
export type SubCategory = string;

export interface TemplateData {
    room: Room;
    furniture: Furniture[];
    mainCategories: MainCategory[];
    subCategories: SubCategory[];
}