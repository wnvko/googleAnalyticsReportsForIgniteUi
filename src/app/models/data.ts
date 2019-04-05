import { Command } from './index';

export interface Data {
    name: string;
    totalEvents: number;
    imageUrl?: string;
    commands: Command[];
  }
