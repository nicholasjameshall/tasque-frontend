export class CreateResourceRequest {
  task_id: number;
  name: string;
  hyperlink: string;

  constructor(
    taskId: number,
    name: string,
    hyperlink: string) {
    this.task_id = taskId;
    this.name = name;
    this.hyperlink = hyperlink;
  }

  get isValid(): boolean {
    if(this.name.length > 0 && this.hyperlink.length > 0) {
      return true;
    }
    return false;
  }

}
