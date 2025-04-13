import { Component, AfterViewInit } from '@angular/core';
import { EquipmentService } from '../../services/equipment/equipment.service';
import * as L from 'leaflet';
import { equipmentData } from '../../services/equipment/equipment.model';

@Component({
  selector: 'app-map-view',
  imports: [],
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.scss'
})
export class MapViewComponent implements AfterViewInit {
  private map!: L.Map;

  constructor(private equipmentService: EquipmentService) { }

  ngAfterViewInit(): void {
    this.initMap();
    this.addEquipments()
  }

  private initMap(): void {
    this.map = L.map('map').setView([-19.151801, -46.007759], 11);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

  private addEquipments(): void {
    this.equipmentService.getEquipmentData().subscribe((equipments: equipmentData[]) => {
      equipments.forEach((equipment: equipmentData) => {
        let iconUrl = 'https://cdn-icons-png.flaticon.com/128/870/870130.png';
        if (equipment.equipmentType == "Caminhão de carga") {
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/870/870130.png'
        }
        if (equipment.equipmentType == "Harvester") {
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/1230/1230884.png'
        }
        if (equipment.equipmentType == "Garra traçadora") {
          iconUrl = 'https://cdn-icons-png.flaticon.com/128/18285/18285705.png'
        }

        const marker = L.marker([equipment.equipmentPosition.lat, equipment.equipmentPosition.lon], {
          icon: L.icon({
            iconUrl: iconUrl,
            iconSize: [40, 40],
            iconAnchor: [20, 40]
          })
        }).addTo(this.map);

        const contentString = `
            <div>
              <strong>${equipment.equipmentType}</strong><br>
              <strong>Modelo do equipamento:</strong> ${equipment.equipmentModel}<br>
              <strong>Status atual do equipamento:</strong> ${equipment.equipmentState?.name}<br>
            </div>
        `;

        const popup = L.popup().setContent(contentString);

        marker.on('mouseover', () => {
          marker.bindPopup(popup).openPopup();
        });

      });
    });
  }

}