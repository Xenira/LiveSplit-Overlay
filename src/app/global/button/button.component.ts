import { Component, OnInit, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'ls-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() href: string;

  constructor() { }

  ngOnInit() {
  }

}
