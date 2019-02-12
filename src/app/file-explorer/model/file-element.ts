export class FileElement {
  id?: string;
  isFolder: boolean;
  isFile: boolean;
  name: string;
  parent: string;

  constructor(isFolder, isFile, name, parent, id?) {
    this.id = id;
    this.isFolder = isFolder;
    this.isFile = isFile;
    this.name = name;
    this.parent = parent;
  }
}
