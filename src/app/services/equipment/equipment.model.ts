import { Observable } from "rxjs";

export interface equipment {
  equipmentId: string,
  LatestPosition: position,
  state: (Observable<state[]> | undefined)[],
}

export interface equipmentPositionHistory {
  equipmentId: string,
  positions: position[],
}

export interface position {
  date: string,
  lat: number,
  lon: number,
}

export interface equipmentLatestState {
  positions: position[],
  equipmentId: string,
  id: string,
  states: equipmentstate[],
}

export interface equipmentstate {
  date: string,
  equipmentStateId: string,
}

export interface state {
  id: string,
  name: string,
  color: string,
}
