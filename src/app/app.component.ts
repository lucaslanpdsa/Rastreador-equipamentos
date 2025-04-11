import { Component } from '@angular/core';
import { MapViewComponent } from "./components/map-view/map-view.component";

@Component({
  selector: 'app-root',
  imports: [MapViewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

}
