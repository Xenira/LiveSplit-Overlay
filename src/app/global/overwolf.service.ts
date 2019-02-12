import { Injectable } from '@angular/core';

declare const overwolf;
export type OWStatus = 'success' | 'error';
export enum eEncoding {
  UTF8 = overwolf.io.enums.eEncoding.UTF8,
  UTF8BOM = overwolf.io.enums.eEncoding.UTF8BOM,
  Unicode = overwolf.io.enums.eEncoding.Unicode,
  UnicodeBOM = overwolf.io.enums.eEncoding.UnicodeBOM,
  ASCII = overwolf.io.enums.eEncoding.ASCII,
}
export interface OWWindow { id: string; name: string; width: number; height: number; top: number; left: number; }

@Injectable({
  providedIn: 'root'
})
export class OverwolfService {

  private window: OWWindow;
  private plugin: { [key: string]: any } = {};

  constructor() { }

  getCurrentWindow(): Promise<OWWindow> {
    return new Promise((resolve, reject) => {
      if (this.window) {
        return resolve(this.window);
      }
      overwolf.windows.getCurrentWindow((result) => {
        if (result.status === 'success') {
          this.window = result.window;
          return resolve(this.window);
        }
        reject();
      });
    });
  }

  getPlugin(name: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.plugin[name]) {
        return resolve(this.plugin[name]);
      }
      overwolf.extensions.current.getExtraObject(name, (result) => {
        if (result.status === 'success') {
          this.plugin[name] = result.object;
          return resolve(this.plugin[name]);
        }
        reject(result);
      });
    });
  }

  fileExists(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      overwolf.io.fileExists(path, (res) => {
        if (res.status !== 'success') {
          return reject(res);
        }
        resolve(res.found);
      });
    });
  }

  copyFile(src: string, dest: string, override: boolean = false, reserved: boolean = null): Promise<boolean> {
    return new Promise((resolve, reject) => {
      overwolf.io.copyFile(src, dest, override, reserved, (res) => {
        if (res.status !== 'success') {
          return reject(res);
        }
        resolve(res);
      });
    });
  }

  readFileContents(path: string, encoding: eEncoding): Promise<string> {
    return new Promise((resolve, reject) => {
      overwolf.io.readFileContents(path, encoding, (res) => {
        if (res.status !== 'success') {
          return reject(res.reason);
        }
        resolve(res.content);
      });
    });
  }

  writeFileContents(path: string, content: string, encoding: eEncoding): Promise<void> {
    return new Promise((resolve, reject) => {
      overwolf.io.writeFileContents(path, content, encoding, false, (res) => {
        if (res.status !== 'success') {
          return reject(res);
        }
        resolve();
      });
    });
  }
}
