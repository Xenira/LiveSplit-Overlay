import { Component, OnInit } from '@angular/core';
import { faqQuestions } from '../faq-questions';

@Component({
  selector: 'ls-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  questions = faqQuestions;
  activeQuestion = -1;

  constructor() { }

  ngOnInit() {
  }

  activateQuestion(index: number) {
    if (this.activeQuestion === index) {
      return this.activeQuestion = -1;
    }
    this.activeQuestion = index;
  }

}
