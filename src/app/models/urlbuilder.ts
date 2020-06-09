export class UrlBuilder {
  PROTOCOL: string = "http://";
  domain: string = '';
  path: string = '';
  parameters: string = '';

  constructor() {}

  addDomain(domain: string) {
    this.domain = "/" + domain;
    return this;
  }

  addPath(path: string) {
    this.path += "/" + path;
    return this;
  }

  addParameters(parameterList: string[][]) {
    let parametersArr = [];
    if(parameterList.length > 0) {
      parameterList.forEach((parameters: string[]) => {
        parametersArr.push(parameters[0] + "=" + parameters[1]);
      });
      this.parameters = "?" + parametersArr.join("&");
    }

    return this;
  }

  build() {
    return this.PROTOCOL + "/" + this.domain + this.path + "/" + this.parameters;
  }
}
