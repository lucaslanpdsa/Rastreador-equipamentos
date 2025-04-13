import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { equipment, equipmentData, equipmentModel, equipmentPositionHistory, equipmentStateHistory, position, state } from './equipment.model';
import { forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }


  getEquipmentData(): Observable<equipmentData[]> {
    return this.getEquipments().pipe(
      switchMap(equipments => {
        const observables = equipments.map(equipment =>
          forkJoin({
            equipmentPosition: this.getEquipmentLatestPosition(equipment.id),
            equipmentState: this.getEquipmentLatestState(equipment.id),
            equipmentType: this.getEquipmentModel(equipment.equipmentModelId)
          }).pipe(
            map(({ equipmentPosition, equipmentState, equipmentType }) => ({
              equipmentPosition,
              equipmentState,
              equipmentType,
              equipmentModel: equipment.name
            }))
          )
        );
        return forkJoin(observables);
      })
    );
  }

  getEquipments(): Observable<equipment[]> {
    return this.http.get<equipment[]>(`${this.apiUrl}equipment`).pipe(
      map(equipment => {
        return equipment
      })
    );
  }

  getEquipmentModel(equipmentModelId: string): Observable<string> {
    return this.http.get<equipmentModel[]>(`${this.apiUrl}equipmentModel`).pipe(
      map(equipmentModel => equipmentModel.filter((equipmentModel: equipmentModel) => equipmentModel.id == equipmentModelId)),
      map(equipmentModel => equipmentModel[0].name)
    );
  }

  getEquipmentLatestPosition(equipmentId: string): Observable<position> {
    return this.http.get<equipmentPositionHistory[]>(`${this.apiUrl}equipmentPositionHistory`).pipe(
      map(equipmentPositionHistory => equipmentPositionHistory.filter(equipmentPositionHistory => equipmentPositionHistory.equipmentId === equipmentId)),
      map(equipmentPositionHistory => equipmentPositionHistory[0].positions[equipmentPositionHistory[0].positions.length - 1])
    );
  }

  getEquipmentLatestState(equipmentId: string): Observable<state | null> {
    return this.http.get<equipmentStateHistory[]>(`${this.apiUrl}equipmentStateHistory`).pipe(
      map(StateHistory => StateHistory.filter(item => item.equipmentId === equipmentId)),
      map(StateHistory => StateHistory.length ? StateHistory[0].states[StateHistory[0].states.length - 1] : null),
      switchMap(StateHistory =>
        StateHistory ? this.getState(StateHistory.equipmentStateId).pipe(
          map(state => state || null)
        ) : of(null)
      )
    );
  }

  getState(stateId: string): Observable<state> {
    return this.http.get<state[]>(`${this.apiUrl}equipmentState`).pipe(
      map(state => state.filter(state => state.id == stateId)),
      map(state => state[0])
    );
  }
}
