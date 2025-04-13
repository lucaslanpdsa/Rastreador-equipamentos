import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { equipment, equipmentData, equipmentModel, equipmentPositionHistory, equipmentStateHistory, position, state } from './equipment.model';
import { catchError, forkJoin, map, Observable, of, shareReplay, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private apiUrl = environment.apiUrl;
  private positionCache = new Map<string, Observable<position | null>>();

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
              equipmentModel: equipment.name,
              equipmentId: equipment.id
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

  getEquipmentLatestPosition(equipmentId: string): Observable<position | null> {
    if (!this.positionCache.has(equipmentId)) {
      const request$ = this.http.get<equipmentPositionHistory[]>(`${this.apiUrl}equipmentPositionHistory`).pipe(
        map(histories => histories.find(h => h.equipmentId === equipmentId)),
        map(history => history?.positions?.[history.positions.length - 1] || null),
        catchError(() => of(null)),
        shareReplay(1)
      );
      this.positionCache.set(equipmentId, request$);
    }
    return this.positionCache.get(equipmentId)!;
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

  getStateHistory(equipmentId: string): Observable<equipmentStateHistory> {
    return this.http.get<equipmentStateHistory[]>(`${this.apiUrl}equipmentStateHistory`).pipe(
      map(StateHistory => StateHistory.filter(item => item.equipmentId === equipmentId)),
      map(StateHistory => StateHistory[0])
    );
  }

  getState(stateId: string): Observable<state> {
    return this.http.get<state[]>(`${this.apiUrl}equipmentState`).pipe(
      map(state => state.filter(state => state.id == stateId)),
      map(state => state[0])
    );
  }

}
