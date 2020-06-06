export class CreateProjectRequest {
  name: string;
  domain: string;

  constructor(
    name: string,
    domain: string) {
    this.name = name;
    this.domain = domain;
  }
}
