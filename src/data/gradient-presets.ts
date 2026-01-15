import type { GradientPreset } from '../types/gradient';

export const gradientPresets: GradientPreset[] = [
  {
    id: 'sunset',
    name: 'Sunset',
    category: 'popular',
    tags: ['warm', 'orange', 'pink'],
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#f093fb', position: 0 },
        { id: '2', color: '#f5576c', position: 100 },
      ],
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    category: 'popular',
    tags: ['cool', 'blue', 'calm'],
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#667eea', position: 0 },
        { id: '2', color: '#764ba2', position: 100 },
      ],
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'cool',
    tags: ['green', 'nature'],
    gradient: {
      type: 'linear',
      angle: 180,
      stops: [
        { id: '1', color: '#134e5e', position: 0 },
        { id: '2', color: '#71b280', position: 100 },
      ],
    },
  },
  {
    id: 'cherry',
    name: 'Cherry',
    category: 'warm',
    tags: ['red', 'pink'],
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#eb3349', position: 0 },
        { id: '2', color: '#f45c43', position: 100 },
      ],
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    category: 'dark',
    tags: ['dark', 'blue', 'purple'],
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#232526', position: 0 },
        { id: '2', color: '#414345', position: 100 },
      ],
    },
  },
  {
    id: 'peach',
    name: 'Peach',
    category: 'pastel',
    tags: ['soft', 'orange', 'pink'],
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#ffecd2', position: 0 },
        { id: '2', color: '#fcb69f', position: 100 },
      ],
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    category: 'popular',
    tags: ['colorful', 'green', 'blue'],
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#00d2ff', position: 0 },
        { id: '2', color: '#3a7bd5', position: 50 },
        { id: '3', color: '#00d2ff', position: 100 },
      ],
    },
  },
  {
    id: 'fire',
    name: 'Fire',
    category: 'warm',
    tags: ['red', 'orange', 'yellow'],
    gradient: {
      type: 'linear',
      angle: 180,
      stops: [
        { id: '1', color: '#f12711', position: 0 },
        { id: '2', color: '#f5af19', position: 100 },
      ],
    },
  },
  {
    id: 'lavender',
    name: 'Lavender',
    category: 'pastel',
    tags: ['purple', 'soft'],
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#e0c3fc', position: 0 },
        { id: '2', color: '#8ec5fc', position: 100 },
      ],
    },
  },
  {
    id: 'cosmic',
    name: 'Cosmic',
    category: 'dark',
    tags: ['dark', 'purple', 'blue'],
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#ff00cc', position: 0 },
        { id: '2', color: '#333399', position: 100 },
      ],
    },
  },
  {
    id: 'mint',
    name: 'Mint',
    category: 'cool',
    tags: ['green', 'fresh'],
    gradient: {
      type: 'linear',
      angle: 90,
      stops: [
        { id: '1', color: '#00b09b', position: 0 },
        { id: '2', color: '#96c93d', position: 100 },
      ],
    },
  },
  {
    id: 'royal',
    name: 'Royal',
    category: 'popular',
    tags: ['purple', 'blue'],
    gradient: {
      type: 'linear',
      angle: 135,
      stops: [
        { id: '1', color: '#141e30', position: 0 },
        { id: '2', color: '#243b55', position: 100 },
      ],
    },
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    category: 'warm',
    tags: ['orange', 'yellow', 'pink'],
    gradient: {
      type: 'radial',
      shape: 'circle',
      position: { x: 50, y: 100 },
      stops: [
        { id: '1', color: '#ff9a9e', position: 0 },
        { id: '2', color: '#fecfef', position: 50 },
        { id: '3', color: '#fecfef', position: 100 },
      ],
    },
  },
  {
    id: 'neon',
    name: 'Neon',
    category: 'popular',
    tags: ['bright', 'pink', 'blue'],
    gradient: {
      type: 'linear',
      angle: 45,
      stops: [
        { id: '1', color: '#fc466b', position: 0 },
        { id: '2', color: '#3f5efb', position: 100 },
      ],
    },
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    category: 'popular',
    tags: ['colorful', 'bright'],
    gradient: {
      type: 'conic',
      angle: 0,
      position: { x: 50, y: 50 },
      stops: [
        { id: '1', color: '#ff0000', position: 0 },
        { id: '2', color: '#ff8800', position: 17 },
        { id: '3', color: '#ffff00', position: 33 },
        { id: '4', color: '#00ff00', position: 50 },
        { id: '5', color: '#0088ff', position: 67 },
        { id: '6', color: '#8800ff', position: 83 },
        { id: '7', color: '#ff0000', position: 100 },
      ],
    },
  },
];

export const categories = [
  { id: 'all', name: 'All' },
  { id: 'popular', name: 'Popular' },
  { id: 'warm', name: 'Warm' },
  { id: 'cool', name: 'Cool' },
  { id: 'dark', name: 'Dark' },
  { id: 'pastel', name: 'Pastel' },
];
