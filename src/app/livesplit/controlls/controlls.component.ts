import { Component, OnInit } from '@angular/core';
declare const overwolf;

@Component({
  selector: 'ls-controlls',
  templateUrl: './controlls.component.html',
  styleUrls: ['./controlls.component.scss']
})
export class ControllsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  dragResize(event) {
    console.log(event);
    overwolf.windows.getCurrentWindow((result) => {
      if (result.status === 'success') {
        overwolf.windows.dragResize(result.window.id, 'BottomRight');
      }
    });
  }

}
