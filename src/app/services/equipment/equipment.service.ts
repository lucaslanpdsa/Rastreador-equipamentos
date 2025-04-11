import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { equipmentLatestState, state } from './equipment.model';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEquipmentData() {
    return this.getEquipments().pipe(
      map(equipments =>
        equipments.map((equipment: any) =>
          forkJoin({
            equipmentPosition: this.getEquipmentLatestPosition(equipment.id),
            equipmentState: this.getEquipmentLatestState(equipment.id),
            equipmentModelName: this.getEquipmentModel(equipment.equipmentModelId)
          }).pipe(
            map(({ equipmentPosition, equipmentState, equipmentModelName }) => ({
              equipmentPosition,
              equipmentState,
              equipmentModelName,
            }))
          )
        )
      ),
      switchMap(observables => forkJoin(observables))
    );
  }

  getEquipments() {
    return this.http.get<any>(`${this.apiUrl}equipment`).pipe(
      map(equipment => equipment)
    );
  }

  getEquipmentModel(equipmentId: string) {
    return this.http.get<any>(`${this.apiUrl}equipmentModel`).pipe(
      map(item => item.filter((item: any) => item.id == equipmentId)),
      map(item => item[0].name)
    );
  }

  getEquipmentLatestPosition(equipmentId: string) {
    return this.http.get<equipmentLatestState[]>(`${this.apiUrl}equipmentPositionHistory`).pipe(
      map(items => items.filter(item => item.equipmentId === equipmentId)),
      map(item => item[0].positions[item[0].positions.length - 1])
    );
  }

  getEquipmentLatestState(equipmentId: string) {
    return this.http.get<equipmentLatestState[]>(`${this.apiUrl}equipmentStateHistory`).pipe(
      map(items => items.filter(item => item.equipmentId === equipmentId)),
      map(items => items.length ? items[0].states[items[0].states.length - 1] : null),
      switchMap(item =>
        item ? this.getState(item.equipmentStateId).pipe(
          map(state => state[0] || null)
        ) : of(null)
      )
    );
  }

  getState(stateId: string) {
    return this.http.get<state[]>(`${this.apiUrl}equipmentState`).pipe(
      map(state => state.filter(state => state.id == stateId))
    );
  }
}
