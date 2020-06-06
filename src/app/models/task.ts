import { Resource } from './resource';

export class Task {
  id: number;
  priority: number;
  startDate: Date;
  endDate: Date;
  description: string;
  status: string;
  resources: Resource[];

  formatDate(date: Date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
          month = '0' + month;
      if (day.length < 2)
          day = '0' + day;

      return [year, month, day].join('-');
  }

  constructor(json: any) {
    this.id = json.id;
    this.priority = json.priority;
    this.startDate = new Date(json.start_date);
    this.endDate = new Date(json.end_date);
    this.description = json.description;
    this.status = json.status;
    this.resources = json.resources.map((resourceData: any[]) => {
      return new Resource(resourceData);
    });
  }

  get startDateStr() {
    return this.formatDate(this.startDate);
  }

  get endDateStr() {
    return this.formatDate(this.endDate);
  }

  get completed() {
    return this.status == "completed";
  }

  public setCompleted() {
    this.status = "completed";
  }
}
