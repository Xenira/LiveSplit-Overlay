import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ls-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  lastSetupStep = Number(window.localStorage.getItem('setup') || 0);

  constructor() { }

  ngOnInit() { }

  nextClicked() {
    this.showPage(this.lastSetupStep + 1);
  }

  back() {
    this.showPage(this.lastSetupStep - 1);
  }

  showPage(step) {
    window.localStorage.setItem('setup', step);
    this.lastSetupStep = step;
  }
}
