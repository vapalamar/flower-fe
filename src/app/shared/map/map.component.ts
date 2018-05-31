import { Component, Input, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

declare const google: any;

@Component({
  selector: 'fl-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnChanges {
  @ViewChild('mapCanvas') mapCanvas: ElementRef;
  @Input('address') address;

  geocoder;
  marker;
  map;
  mapProp = {
    zoom: 15,
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    overviewMapControl: false,
    rotateControl: true,
    scrollwheel: false,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
  };

  constructor() {}

  ngOnInit() {
    this.createGeocoder();
  }

  ngOnChanges() {
    this.createGeocoder();
    if (this.address) {
      this.setAddress(this.address);
    }
  }

  createGeocoder() {
    if (!this.geocoder) {
      this.geocoder = new google.maps.Geocoder();
    }
    if (!this.map) {
      this.map = new google.maps.Map(this.mapCanvas.nativeElement, this.mapProp);
    }
  }

  setAddress(address: string) {
    if (address) {
      this.address = address;
      this.geoCoder(this.address).subscribe(({ lat, lng }) => {
        this.setMarker(lat, lng);
      });
    }
  }

  geoCoder(address: string): Observable<{ lat: number; lng: number }> {
    return new Observable(observer => {
      this.geocoder.geocode({ address: address }, results => {
        observer.next({
          lat: results[0].geometry.location.lat(),
          lng: results[0].geometry.location.lng(),
        });
        observer.complete();
      });
    });
  }

  setMarker(lat, lng) {
    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        animation: google.maps.Animation.DROP,
        icon: {
          size: new google.maps.Size(40, 60),
          url: '/assets/images/marker.svg',
          origin: new google.maps.Point(8, -23),
        },
      });
      this.marker.setMap(this.map);
    }

    this.marker.setPosition(new google.maps.LatLng(lat, lng));
    this.map.panTo(new google.maps.LatLng(lat, lng));
    this.map.setCenter({ lat: lat, lng: lng });
  }
}
