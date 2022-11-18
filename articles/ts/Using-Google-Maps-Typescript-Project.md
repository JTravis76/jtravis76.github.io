# Using Google Maps in a Typescript Project

While working on an Angular 12 application, there was a user story requirement for using Google Maps. It seems that no matter what I did, the compiler was not happy. After several days, I finally found the solution that worked for _BOTH_ VS Code and TS compiler.

## Install NPM package
```
>npm i --save-dev @types/google-maps
```
## Edit the `tsconfig.json` file
```json
{
  "compilerOptions": {
    ...
    "types": [
      "@types/google.maps"
    ]
  }
}
```
## Typescript Code
```ts
import { Component, OnInit } from '@angular/core';

//import "@types/google.maps";
// !! comment out to enable strong-typing
declare const google: any; // <- typeof google.maps;

@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  private map: typeof google.maps.Map; // remove keyword 'typeof' for strong-typing
  private infoWindow: typeof google.maps.InfoWindow;
  public latitude: number = 0;
  public longitude: number = 0;

  ngOnInit(): void {
    this.resetCoords();
    this.loadMap();
  }

  resetCoords() {
    this.infoWindow.close();
    this.latitude = 40.43784866612939;
    this.longitude = -80.00185126415731;

    this.infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: {
            lat: this.latitude,
            lng: this.longitude,
        },
    });
    this.infoWindow.open();
  }

  loadMap() {
    const latLng = {
        lat: this.latitude,
        lng: this.longitude,
    };

    const el = document.getElementById("map") as HTMLDivElement;
    this.map = new google.maps.Map(el, {
        zoom: 10,
        center: latLng,
    });

    this.infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: latLng,
    });

    if (this.map !== null) {
      this.infoWindow.open(this.map);

      this.map.addListener("click", (e: typeof google.maps.MapMouseEvent) => {
          this.infoWindow.close();

          this.infoWindow = new google.maps.InfoWindow({
              content: e.latLng?.toString(),
              position: e.latLng,
          });
          this.infoWindow.open(this.map);

          if (e.latLng) {
              this.map?.panTo(e.latLng);

              this.latitude = e.latLng.lat();
              this.longitude = e.latLng.lng();
          }
      });
    }
  }
}
```