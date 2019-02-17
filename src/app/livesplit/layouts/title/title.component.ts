import { Component, OnInit, OnDestroy } from '@angular/core';
import { LivesplitService } from 'src/app/livesplit/shared/livesplit.service';
import { IGameData } from 'src/app/models/game-data';
import Settings from 'src/app/settings';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ls-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit, OnDestroy {
  settings = Settings.title;
  game: IGameData;

  subscriptions: Subscription[] = [];

  constructor(private livesplit: LivesplitService) { }

  ngOnInit() {
    this.livesplit.onConnected.subscribe((connection) => {
      if (!connection) {
        console.warn('Not connectedl. Waiting for connection...');
      }
      this.ngOnDestroy();

      connection.gameCache.getValue().then((game) => this.game = game);
      this.subscriptions.push(connection.onGame.subscribe((game) => this.game = game));
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

}
