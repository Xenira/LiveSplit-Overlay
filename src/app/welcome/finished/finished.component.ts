import { Component, OnInit } from '@angular/core';
import { OverwolfService } from 'src/app/global/overwolf.service';

@Component({
  selector: 'ls-finished',
  templateUrl: './finished.component.html',
  styleUrls: ['./finished.component.scss']
})
export class FinishedComponent implements OnInit {

  constructor(private _overwolf: OverwolfService) { }

  ngOnInit() {
  }

  close() {
    this._overwolf.closeWindow().then(() => { });
  }

}
