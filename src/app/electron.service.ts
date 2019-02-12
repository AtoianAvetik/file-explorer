import {Injectable} from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import {ipcRenderer, webFrame, remote, shell} from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {Stats} from 'fs';

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: typeof ipcRenderer;
  shell: typeof shell;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;
  path: typeof path;

  constructor() {
    // Conditional imports
    if ((<any>window).require) {
      try {
        this.ipcRenderer = (<any>window).require('electron').ipcRenderer;
        this.shell = (<any>window).require('electron').shell;
        this.webFrame = (<any>window).require('electron').webFrame;
        this.remote = (<any>window).require('electron').remote;

        this.childProcess = (<any>window).require('child_process');
        this.fs = (<any>window).require('fs');
        this.path = (<any>window).require('path');
      } catch (error) {
        throw error;
      }
    } else {
      console.warn('Could not load electron ipc');
    }
  }

  async getFiles() {
    return new Promise<string[]>((resolve, reject) => {
      this.ipcRenderer.once('getFilesResponse', (event, arg) => {
        resolve(arg);
      });
      this.ipcRenderer.send('getFiles');
    });
  }

  readdir(targetPath) {
    return new Promise((res, rej) => {
      this.fs.readdir(targetPath, (err: Error, files: [string]) => {
        if (err) {
          console.error(err);
          rej(err);
        }
        res(files);
      });
    });
  }

  getFileStatus(targetPath) {
    return new Promise((res, rej) => {
      this.fs.stat(targetPath, (err: Error, stats: Stats) => {
        if (err) {
          console.error(err);
          rej(err);
        }
        res(stats);
      });
    });
  }

  openFile(targetPath) {
    this.shell.openItem(targetPath);
  }

  createFolder(currentPath, pathname) {
    pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, '');
    this.fs.mkdir(this.path.resolve(currentPath, pathname), null, e => {
      if (e) {
        console.error(e);
      } else {
        console.log('Success');
      }
    });
  }
}
