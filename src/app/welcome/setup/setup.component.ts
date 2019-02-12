import { Component, OnInit, ChangeDetectorRef, ApplicationRef, Output, EventEmitter } from '@angular/core';
import { OverwolfService, eEncoding } from 'src/app/global/overwolf.service';

const layoutRegex = /<LayoutPath>(.+)<\/LayoutPath>/g;

@Component({
  selector: 'ls-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {

  @Output() done = new EventEmitter<void>();

  util: any;
  setupStep = 0;
  baseInstalled: boolean = null;
  paths: string[];
  error: string;
  startingLiveSplit = false;
  testingConnection = false;
  livesplitDirectory: string;

  constructor(private ref: ApplicationRef, private _overwolf: OverwolfService, ) { }

  ngOnInit() {
    this._overwolf.getPlugin('livesplit-util').then((util) => this.util = util);
  }

  setBaseInstalled(value: boolean) {
    this.baseInstalled = value;
    this.setSetupStep(value ? 1 : 2);
  }

  setSetupStep(step: number) {
    this.error = null;
    this.setupStep = step;
    console.log(this.setupStep);
    this.ref.tick();
    switch (this.setupStep) {
      case 3:
        this.util.extractZipFromWebToUserFolder('https://github.com/LiveSplit/LiveSplit/releases/download/1.7.6/LiveSplit_1.7.6.zip',
          'LiveSplit', true, (res) => {
            if (!res.success) {
              return this.error = res.data;
            }

            this.livesplitDirectory = res.data;
            localStorage.setItem('livesplit.directory', this.livesplitDirectory);
            setTimeout(() => this.setSetupStep(4), 1000);
          });
        break;
      case 4:
        this.util.extractZipFromWebToUserFolder(
          'https://github.com/Xenira/LiveSplit-Websocket/releases/download/v0.1.1/LiveSplitWebsocket.zip',
          'LiveSplit/Components', false, (res) => {
            if (!res.success) {
              return this.error = res.data;
            }
            setTimeout(() => this.setSetupStep(5), 1000);
          });
        break;
      case 5:
        this.getLayoutFiles().then((layouts) => {
          console.log(layouts);
          if (!layouts) {
            this.error = 'Unable to get configurations';
            return;
          }
          return this.addWebsocketCompoenent(layouts);
        }).then(() => {
          setTimeout(() => this.setSetupStep(6), 1000);
        }).catch((err) => {
          console.error(err);
          this.error = err;
        });
        break;
      default:
        break;
    }
  }

  selectDirectory() {
    this.error = null;
    this._overwolf.openFolderPicker(null).then((res) => {
      console.log('result', res);

      this.livesplitDirectory = res;
      this._overwolf.fileExists(`${this.livesplitDirectory}\\LiveSplit.exe`).then((exists) => {
        if (!exists) {
          this.livesplitDirectory = null;
          return this.error = 'Couldn\'t find LiveSplit within the selected directory.';
        }
        localStorage.setItem('livesplit.directory', this.livesplitDirectory);
        this.setSetupStep(2);
      });
    });
  }

  addWebsocketCompoenent(layouts: string[]) {
    if (!layouts.length) {
      // No layouts found. Create default one
      console.log('No layout');
      const defaultLayoutPath = 'assets/default.lsl';
      const newLayoutPath = `${this.livesplitDirectory}\\default.lsl`;
      const applicationConfig = `${this.livesplitDirectory}\\settings.cfg`;

      return this._overwolf.copyFile(defaultLayoutPath, newLayoutPath)
        .then(() => this._overwolf.readFileContents(applicationConfig, eEncoding.UTF8))
        .then((content) => {
          const lines = content.split('\r\n');
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].indexOf('<RecentLayouts>') > -1) {
              lines.splice(i + 1, 0, `    <LayoutPath>${newLayoutPath}</LayoutPath>`);
              break;
            }
            if (lines[i].indexOf('<RecentLayouts />') > -1) {
              lines.splice(i, 1, '  <RecentLayouts>', `    <LayoutPath>${newLayoutPath}</LayoutPath>`, '  </RecentLayouts>');
              break;
            }
          }
          return this._overwolf.writeFileContents(applicationConfig, lines.join('\r\n'), eEncoding.UTF8);
        }).then(() => true);
    }
    return Promise.all(layouts.map((layout) => {
      // Updating existing layouts
      this._overwolf.fileExists(layout).then((exists) => {
        if (!exists) {
          return;
        }

        return this._overwolf.readFileContents(layout, eEncoding.UTF8);
      }).then((content) => {
        if (!content) {
          return Promise.resolve();
        }
        const lines = content.split('\r\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.indexOf('<Path>LiveSplit.Websocket.dll</Path>') > -1) {
            // Component already added
            console.log('websocket already present in', layout);
            break;
          }
          if (line.indexOf('</Components>') > -1) {
            // Insert websocket at end
            lines.splice(i, 0,
              '    <Component>',
              '      <Path>LiveSplit.Websocket.dll</Path>',
              '      <Settings>',
              '        <Port>16835</Port>',
              '      </Settings>',
              '    </Component>');
            return this._overwolf.writeFileContents(layout, lines.join('\r\n'), eEncoding.UTF8);
          }
        }
      });
    })).then(() => true);
  }

  getLayoutFiles() {
    const defaultConfigPath = 'assets/settings.cfg';
    const configPath = `${this.livesplitDirectory}\\settings.cfg`;
    return this._overwolf.fileExists(configPath)
      .then((exists) => {
        if (exists) {
          return Promise.resolve(true);
        }
        return this._overwolf.copyFile(defaultConfigPath, configPath);
      }).then(() => this._overwolf.readFileContents(configPath, eEncoding.UTF8))
      .then((content) => {
        let match = layoutRegex.exec(content);
        const results: string[] = [];
        // tslint:disable-next-line:no-conditional-assignment
        while (match !== null) {
          console.log(match);
          results.unshift(match[1]);
          match = layoutRegex.exec(content);
        }
        return results;
      });
  }

  testConnection() {
    this.error = null;
    this.testingConnection = true;
    this.ref.tick();
    const ws = new WebSocket('ws://localhost:16835/livesplit');
    ws.addEventListener('open', (ev) => {
      ws.close();
      setTimeout(() => {
        this.testingConnection = false;
        this.done.next();
        this.ref.tick();
      }, 500);
    });
    ws.addEventListener('error', (ev) => {
      this.testingConnection = false;
      this.error = 'Unable to connect to LiveSplit. Make sure LiveSplit is running and the Server is started.';
      this.ref.tick();
    });
  }

  startLiveSplit() {
    this.startingLiveSplit = true;
    this.ref.tick();
    this.util.startApplication(`${this.livesplitDirectory}/LiveSplit.exe`, (res) => {
      setTimeout(() => {
        this.startingLiveSplit = false;
        this.ref.tick();
        console.log(res);
      }, 500);
    });
  }

}
