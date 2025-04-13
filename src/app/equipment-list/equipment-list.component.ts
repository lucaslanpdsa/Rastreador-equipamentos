import { Component } from '@angular/core';
import { EquipmentService } from '../services/equipment/equipment.service';
import { Observable } from 'rxjs';
import { equipmentData, stateHistory } from '../services/equipment/equipment.model';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

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

  openModal(equipmentId: string, equipmentModel: string) {
    return this.equipmentService.getStateHistory(equipmentId).subscribe(
      dados => {

        const stateMap: Record<string, Record<string, string>> = {
          '0808344c-454b-4c36-89e8-d7687e692d57': { name: 'Operando', color: '#2ecc71' },
          'baff9783-84e8-4e01-874b-6fd743b875ad': { name: 'Parado', color: '#f1c40f' },
          '03b2d446-e3ba-4c82-8dc2-a5611fea6e1f': { name: 'Manutenção', color: '#e74c3c' },
        };

        const stateHistoryHtml = dados.states.map((state: stateHistory) => {
          const stateInfo = stateMap[state.equipmentStateId];
          return `
          <li style="
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px;
            border-bottom: 1px solid #eee;
            list-style: none;
          ">
            <span style="
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background-color: ${stateInfo['color']};
              display: inline-block;
            "></span>
            <div>
              <div><strong>Status:</strong> ${new Date(state.date).toLocaleString('pt-BR')}</div>
              <div><strong>Data:</strong> ${stateInfo['name']}</div>
            </div>
          </li>
        `;
        }).join('');

        Swal.fire({
          title: `Histórico do Equipamento: ${equipmentModel}`,
          html: `<div style="text-align: left; max-height: 400px; overflow-y: auto;">${stateHistoryHtml}</div>`,
          showCloseButton: true,
          showCancelButton: true,
          confirmButtonText: 'Fechar',
          cancelButtonText: 'Cancelar',
          width: '50%',
          customClass: {
            popup: 'modal-content',
          },
        });
      }
    )
  }

}
