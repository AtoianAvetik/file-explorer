import {Component, OnInit} from '@angular/core';
import {ElectronService} from './electron.service';
import {Stats} from 'fs';
import { v4 } from 'uuid';
import {FileElement} from './file-explorer/model/file-element';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private currentPath: string = process.cwd();
  private entries: Array<FileElement> = [];
  canNavigateUp = false;


  constructor(private $electron: ElectronService) {
    this.updateEntries();
  }

  private updateEntries() {
    this.$electron.readdir(this.currentPath)
      .then((files: [string]) => {
        this.entries = [];
        files.forEach(file => {
          this.$electron.getFileStatus(this.$electron.path.resolve(this.currentPath, file))
            .then((stats: Stats) => {
              console.log(stats);
              this.entries.push(new FileElement(stats.isDirectory(), stats.isFile(), file, this.currentPath, v4()));
            });
        });
      });
  }

  ngOnInit() {
    // this.$electron.ipcRenderer.send('request-keyboard-shortcut', 'Backspace');
  }

  private changeDir(newDir: string) {
    const targetPath = this.$electron.path.resolve(this.currentPath, newDir);
    this.$electron.getFileStatus(targetPath)
      .then((stats: Stats) => {
        if (stats.isDirectory()) {
          this.currentPath = targetPath;
          this.updateEntries();
        } else {
          console.error(new Error(`Unknown file system object: ${targetPath}`));
        }
      });
  }
  openFile(file: FileElement) {
    this.$electron.openFile(this.$electron.path.resolve(this.currentPath, file.name));
  }

  addFolder(folder: { name: string }) {
    // this.fileService.add({ isFolder: true, name: folder.name, parent: this.currentRoot ? this.currentRoot.id : 'root' });
    this.$electron.createFolder(this.currentPath, folder.name);
    this.updateEntries();
  }

  removeElement(element: FileElement) {
    // this.fileService.delete(element.id);
    this.updateEntries();
  }

  navigateToFolder(element: FileElement) {
    this.changeDir(element.name);
    this.canNavigateUp = true;
  }

  navigateUp() {
    this.changeDir('../');
  }

  moveElement(event: { element: FileElement; moveTo: FileElement }) {
    // this.fileService.update(event.element.id, { parent: event.moveTo.id });
    this.updateEntries();
  }

  renameElement(element: FileElement) {
    // this.fileService.update(element.id, { name: element.name });
    this.updateEntries();
  }
}
