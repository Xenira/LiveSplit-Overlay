import { Component, OnInit } from '@angular/core';
import { LivesplitService } from 'src/app/livesplit/shared/livesplit.service';
import { IGameData } from 'src/app/models/game-data';
import Settings from 'src/app/settings';

@Component({
  selector: 'ls-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {
  settings = Settings.title;
  game: IGameData;

  constructor(private livesplit: LivesplitService) { }

  ngOnInit() {
    this.livesplit.gameCache.getValue().then((game) => this.game = game);
    this.livesplit.onGame.subscribe((game) => this.game = game);
  }

}
