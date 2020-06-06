import { Task } from './task';

export class Project {
  id: number;
  tasks: Task[];
  name: string;

  constructor(json: any) {
    this.id = json.id;

    this.tasks = json.tasks.map((taskData: any[]) => {
      return new Task(taskData);
    });

    this.name = json.name;
  }
}
