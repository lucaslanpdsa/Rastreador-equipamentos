export interface equipmentData {
  equipmentPosition: position | null;
  equipmentId: string,
  equipmentModel: string;
  equipmentState: state | null;
  equipmentType: string;
}

export interface equipment {
  id: string,
  equipmentModelId: string,
  name: string,
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

export interface equipmentStateHistory {
  equipmentId: string,
  states: stateHistory[],
}

export interface stateHistory {
  date: string,
  equipmentStateId: string,
}

export interface state {
  color: string,
  id: string,
  name: string,
}

export interface equipmentModel {
  hourlyEarnings: hourlyEarnings[],
  id: string,
  name: string,
}

interface hourlyEarnings {
  equipmentStateId: string,
  value: number,
}