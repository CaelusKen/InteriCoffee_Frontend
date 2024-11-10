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
    category: "seating" | "tables" | "lightings" | "doors" | "stairs" | "others";
    material?: FurnitureMaterial
}

export interface FurnitureMaterial {
    color: string;
    metalness: number;
    roughness: number;
}

export interface FurnitureWithRef extends Furniture {
    ref: THREE.Group | null;
}

export interface Room {
    id: number;
    name: string;
    width: number;
    length: number;
    height: number;
    furniture: Furniture[];
}

export interface Floor {
    id: number;
    name: string;
    rooms: Room[];
}

export interface CoffeeShopData {
    floors: Floor[];
    branding: {
      name: string;
      logo: string;
      colorScheme: string;
    };
    menuBoard: {
      items: MenuItem[];
    };
}

export interface MenuItem {
    name: string;
    price: number;
  }

export interface TransformUpdate {
    id: number;
    type: 'position' | 'rotation' | 'scale';
    value: [number, number, number];
}

export type MainCategory = string;
export type SubCategory = string;

export interface TemplateData {
    id: string;
    templateName: string;
    description: string;
    mainCategories: MainCategory[];
    subCategories: SubCategory[];
    floors: Floor[];
    views: number;
    thumbnailImageSrc?: string;
}

export interface Design {
    id: string
    username?: string;
    role?: string;
    createdAt: string
    updatedAt: string
    floors: Floor[]
    type: 'Template' | 'Design'
  }