export interface Event {
  id: string;
  year: number;
  text: string;
}

export interface TimePoint {
  id: string;
  startYear: number;
  endYear: number;
  subject: string;
  events: Event[];
}