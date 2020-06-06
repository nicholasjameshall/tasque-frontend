export class User {
  id: number;

  constructor(json: any) {
    this.id = json.id;
  }
}
