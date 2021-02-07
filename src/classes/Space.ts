import { GameSymbol } from "./GameSymbol";
import { IllegalInsertionException } from "./IllegalInsertionException";
export class Space {
  private _content: GameSymbol;
  get filled(): boolean{
    return this.content !== ''
  };
  get content() {
    return this._content;
  }
  set content(val: GameSymbol) {
    if (!this.filled) {
      this._content = val;
      
    } else {
      throw new IllegalInsertionException(
        "Inserção de símbolo em espaço já preenchido"
      );
    }
  }
  toString() {
    return this.content;
  }
  constructor() {
    
    this._content = "";
  }
}


