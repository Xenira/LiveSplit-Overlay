import { Component, OnInit, Input, EventEmitter, HostListener } from '@angular/core';
import { OverwolfService } from '../overwolf.service';

@Component({
  selector: 'ls-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() href: string;
  @Input() target: 'default' | 'overwolf' = 'overwolf';
  @Input() small = false;
  @Input() primary = false;
  @Input() secondary = false;

  @HostListener('click') onClick() {
    if (this.href) {
      if (this.target === 'default') {
        this._overwolf.openUrlInDefaultBrowser(this.href);
      } else {
        this._overwolf.openUrlInOverwolfBrowser(this.href);
      }
    }
  }

  constructor(private _overwolf: OverwolfService) { }

  ngOnInit() {
  }

}
