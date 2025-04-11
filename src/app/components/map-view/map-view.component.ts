import { Component, AfterViewInit } from '@angular/core';
import { EquipmentService } from '../../services/equipment/equipment.service';
import * as L from 'leaflet';
import { Observable } from 'rxjs';
import { equipmentPositionHistory } from '../../services/equipment/equipment.model';

@Component({
  selector: 'app-map-view',
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements AfterViewInit {
  private map!: L.Map;
  equipmentList$!: Observable<equipmentPositionHistory[]>;

  constructor(private EquipmentService: EquipmentService) {
    this.adicionarMaquinas()
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([-19.151801, -46.007759], 11);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

  }

  private adicionarMaquinas(): void {
    this.EquipmentService.getEquipmentData().subscribe((maquinas: any) => {
      maquinas.forEach((maquina: any) => {
        let iconUrl = 'https://cdn-icons-png.flaticon.com/128/870/870130.png';
        if (maquina.equipmentModelName == "Caminhão de carga") {
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/870/870130.png'
        }
        if (maquina.equipmentModelName == "Harvester") {
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/1230/1230884.png'
        }
        if (maquina.equipmentModelName == "Garra traçadora") {
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/18285/18285705.png'
        }

        const marker = L.marker([maquina.equipmentPosition.lat, maquina.equipmentPosition.lon], {
          icon: L.icon({
            iconUrl: iconUrl,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          })
        }).addTo(this.map);

        const popup = L.popup().setContent(
          `Status do equipamento: ${maquina.equipmentState?.name} <br>
           Nome: ${maquina.equipmentModelName}`
        );

        marker.on('mouseover', () => {
          marker.bindPopup(popup).openPopup();
        });

      });
    });
  }

}