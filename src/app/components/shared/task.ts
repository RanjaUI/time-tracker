export interface TaskWithKey {
  [id: string]: Task;
}
export interface TaskWithLogs {
  [id: string]: Logs;
}
export interface TaskTimerHistory {
  [id: string]: History[];
}
export interface TaskEventTypes {
  [id: string]: string;
}
export interface Logs {
  seconds: number;
  minutes: number;
  hours: number;
}
export interface TaskIntervals {
  [id: string]: ReturnType<typeof setInterval>;
}

export interface Task {
  title: string;
  id: string;
  timeElapsed: null | { hours: number; minutes: number; seconds: number };
  isActive: boolean;
  timerHistory: History[];
}

export interface History {
  startedAt: Date;
  stoppedAt: Date;
}

export interface TimeSpent {
  hours: number;
  mins: number;
}
