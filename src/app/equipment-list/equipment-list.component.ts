import { Component } from '@angular/core';
import { EquipmentService } from '../services/equipment/equipment.service';
import { Observable } from 'rxjs';
import { equipmentData } from '../services/equipment/equipment.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-equipment-list',
  imports: [CommonModule],
  templateUrl: './equipment-list.component.html',
  styleUrl: './equipment-list.component.scss'
})
export class EquipmentListComponent {
  equipmentList$?: Observable<equipmentData[]>;

  constructor(private equipmentService: EquipmentService) {
    this.getEquipmentData()
  }

  getEquipmentData() {
    this.equipmentList$ = this.equipmentService.getEquipmentData()
  }

}
