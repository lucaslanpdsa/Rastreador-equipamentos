import { Component } from '@angular/core';
import { MapViewComponent } from "./components/map-view/map-view.component";
import { EquipmentListComponent } from "./equipment-list/equipment-list.component";

@Component({
  selector: 'app-root',
  imports: [MapViewComponent, EquipmentListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
