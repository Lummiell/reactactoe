export class IllegalInsertionException {
    message: string;
    name = "IllegalInsertionException";
    constructor(message: string) {
      this.message = message;
    }
  }