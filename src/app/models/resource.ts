export class Resource {
  taskId: number;
  name: string;
  hyperlink: string;

  constructor(json: any) {
    this.taskId = json.task_id;
    this.name = json.name;
    this.hyperlink = json.hyperlink;
  }

}
