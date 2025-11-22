export interface Participant {
  id: string;
  name: string;
}

export interface Assignment {
  giver: Participant;
  receiver: Participant;
  revealed: boolean;
}

export enum AppStage {
  INPUT = 'INPUT',
  REVEAL = 'REVEAL', // Organizer Dashboard
  SUMMARY = 'SUMMARY'
}

export interface AlertState {
  message: string;
  type: 'error' | 'success' | 'info';
}
