export class Tasks {
  name: string;
  id: string;
  isCompleted: boolean;

  constructor(name: string, id: string, isCompleted: boolean) {
    this.name = name;
    this.id = id;
    this.isCompleted = isCompleted;
  }
}
