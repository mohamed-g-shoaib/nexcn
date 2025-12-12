declare module "negotiator" {
  class Negotiator {
    constructor(request: { [key: string]: string | string[] });
    languages(): string[];
  }
  export = Negotiator;
}
