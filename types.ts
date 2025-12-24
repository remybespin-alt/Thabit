export enum UserPhase {
  STABILIZE = 'STABILIZE',
  CONSOLIDATE = 'CONSOLIDATE',
  ROOT = 'ROOT'
}

export enum Role {
  USER = 'user',
  MODEL = 'model'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  isPanicResponse?: boolean;
}

export interface PhaseConfig {
  id: UserPhase;
  label: string;
  description: string;
  focus: string;
  days: string;
}