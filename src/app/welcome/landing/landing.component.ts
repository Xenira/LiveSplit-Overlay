import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ls-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  @Output() next = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  nextClicked() {
    console.log('Next clicked');
    this.next.emit();
  }

}
