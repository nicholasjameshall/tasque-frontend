export class CreateTaskRequest {
  project_id: number;
  priority: number;
  description: string;

  constructor(projectId: number, description: string, priority: number) {
    this.project_id = projectId;
    this.description = description;
    this.priority = priority;
  }

  get isValid(): boolean {
    if(this.description.length > 0 &&
      (this.priority > 0 && this.priority < 4)
    ) {
      return true;
    }
    return false;
  }
}
