import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  Input,
  NgZone,
  PLATFORM_ID,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { omit } from 'lodash-es';

import { ControlComponent } from '../control/control.component';

declare let google: any;

type PlaceType = 'address' | 'geocode';
type Level = 'city' | 'state';

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: Array<string>;
}

@Component({
  selector: 'fl-g-place-autocomplete, [flGPlaceAutocomplete]',
  templateUrl: './g-place-autocomplete.component.html',
  styleUrls: ['./g-place-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GPlaceAutocompleteComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GPlaceAutocompleteComponent),
      multi: true,
    },
  ],
})
export class GPlaceAutocompleteComponent extends ControlComponent implements AfterViewInit, Validator {
  @Input('inputId') inputId: string;
  @Input('placeholder') placeholder = '';
  @Input('types') types: PlaceType = 'address';
  @Input('level') level: Level = null;
  @Input('invalidEmptyActionHide') invalidEmptyActionHide = false;
  @Input('enableClearAfterChoose') enableClearAfterChoose = false;
  @Input('throwErrorAfterReset') throwErrorAfterReset = false;

  @ViewChild('input') input: ElementRef;
  autocomplete: ElementRef;
  selectedAddress: string;

  isInput = false;

  constructor(
    injector: Injector,
    private renderer: Renderer2,
    private zone: NgZone,
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    super(injector);
  }

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (this.elementRef.nativeElement.tagName.toLowerCase() === 'input') {
      this.autocomplete = this.elementRef;
      setTimeout(() => (this.isInput = true));
    } else {
      this.autocomplete = this.input;
    }
    const options = {
      types: [this.types],
      componentRestrictions: {
        country: 'us',
      },
    };
    if (this.control) {
      this.writeValue(this.control.value);
    }
    const googleAutocomplete = new google.maps.places.Autocomplete(this.autocomplete.nativeElement, options);

    google.maps.event.addListener(googleAutocomplete, 'place_changed', () =>
      this.zone.run(() => {
        const { place_id: placeId, formatted_address: address, address_components } = googleAutocomplete.getPlace();
        if (!placeId || !address || !address_components) {
          return;
        }

        let formattedAddress = address;
        if (this.level) {
          formattedAddress = this.getFormattedAddress(address_components, this.level);
        }

        const zipCode = this.getZipCode(address_components);

        this.renderer.setProperty(this.autocomplete.nativeElement, 'value', formattedAddress);

        this.propagateChange({ placeId, address: formattedAddress, zipCode });
        this.clear();

        this.selectedAddress = formattedAddress;
      }),
    );
  }

  stopClose(event: MouseEvent) {
    event.stopImmediatePropagation();
  }

  clear() {
    if (this.enableClearAfterChoose) {
      this.renderer.setProperty(this.autocomplete.nativeElement, 'value', '');
      if (this.throwErrorAfterReset) {
        this.control.setErrors(omit(this.control.errors, 'place'));
      }
    }
  }

  private getZipCode(addressComponents: Array<AddressComponent>): string {
    for (const component of addressComponents) {
      if (component.types.indexOf('postal_code') > -1) {
        return component.long_name;
      }
    }
  }

  private getFormattedAddress(addressComponents: Array<AddressComponent>, level: Level): string {
    let components = [];
    let names = [];
    let delimeters = [];

    if (level === 'city') {
      components = ['street_number', 'route', 'locality'];
      names = ['short_name', 'short_name', 'long_name'];
      delimeters = [' ', ', ', ''];
    } else if (level === 'state') {
      components = ['street_number', 'route', 'locality', 'administrative_area_level_1'];
      names = ['short_name', 'short_name', 'long_name', 'long_name'];
      delimeters = [' ', ', ', ', '];
    }
    return components
      .map((c, i) => {
        const component = addressComponents.find(({ types }) => types.includes(c));
        const name = component ? component[names[i]] : '';
        const delimeter = delimeters[i];
        return `${name}${(name && delimeter) || ''}`;
      })
      .join('');
  }

  writeValue(address) {
    if (!this.autocomplete) {
      return;
    }
    if (!address || !('placeId' in address)) {
      this.renderer.setProperty(this.autocomplete.nativeElement, 'value', '');
      return;
    }
    this.renderer.setProperty(this.autocomplete.nativeElement, 'value', address.address);
  }

  checkValidity() {
    const autocompleteEl = this.autocomplete.nativeElement;
    if (!autocompleteEl.value) {
      return this.propagateChange('');
    }
    if (!this.selectedAddress || (this.selectedAddress && autocompleteEl.value !== this.selectedAddress)) {
      this.selectedAddress = '';

      if (!this.invalidEmptyActionHide) {
        this.propagateChange({});
      }
    }
  }

  validate(control: FormControl) {
    if (control.value && !control.value.placeId) {
      return { place: true };
    }
    return null;
  }
}
