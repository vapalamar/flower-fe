import { Component, Input } from '@angular/core';

@Component({
  selector: 'fl-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  @Input() fill = '#0099e6';
}
