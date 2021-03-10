import { Space } from "./Space";
import { GameSymbol } from "./GameSymbol";
import { GameState } from "./GameState";
import { IllegalInsertionException } from "./IllegalInsertionException";
export class Game {
  Spaces: Space[][];
  get freeSpaces(): number[][] {
    let list = [];
    for (let pos_x = 0; pos_x < 3; pos_x++) {
      for (let pos_y = 0; pos_y < 3; pos_y++) {
        if (!this.Spaces[pos_x][pos_y].filled) {
          list.push([pos_x, pos_y]);
        }
      }
    }
    return list;
  }
  get filledSpaces(): { posx: number; posy: number; Symbol: GameSymbol }[] {
    let list = [];
    for (let pos_x = 0; pos_x < 3; pos_x++) {
      for (let pos_y = 0; pos_y < 3; pos_y++) {
        let space = this.Spaces[pos_x][pos_y];
        if (space.filled) {
          list.push({ posx: pos_x, posy: pos_y, Symbol: space.content });
        }
      }
    }
    return list;
  }

  constructor() {
    let Spaces: Space[][] = [];
    for (let pos_x = 0; pos_x < 3; pos_x++) {
      Spaces[pos_x] = [];
      for (let pos_y = 0; pos_y < 3; pos_y++) {
        Spaces[pos_x][pos_y] = new Space();
      }
    }
    this.Spaces = Spaces;
  }
  col(col_x: number): GameSymbol[] {
    let output: GameSymbol[] = [];
    if (col_x < 3) {
      this.Spaces[col_x].forEach((gameSymbol) => {
        output.push(gameSymbol.content);
      });
    }
    return output;
  }
  row(row_y: number): GameSymbol[] {
    let output: GameSymbol[] = [];
    if (row_y < 3) {
      this.Spaces.forEach((item) => {
        output.push(item[row_y].content);
      });
    }
    return output;
  }
  diagonal(): GameSymbol[] {
    let diag: GameSymbol[] = [];
    for (let diag_pos = 0; diag_pos < 3; diag_pos++) {
      diag.push(this.Spaces[diag_pos][diag_pos].content);
    }
    return diag;
  }
  antiDiagonal(): GameSymbol[] {
    let antidiagonal: GameSymbol[] = [];
    let pos_x = 0;
    let pos_y = 2;
    while (pos_x <= 2) {
      antidiagonal.push(this.Spaces[pos_x][pos_y].content);
      pos_x++;
      pos_y--;
    }
    return antidiagonal;
  }
  insertSymbol(symbol: GameSymbol, pos_x: number, pos_y: number) {
    try {
      if (pos_x <= 3 && pos_y <= 3) {
        this.Spaces[pos_x][pos_y].content = symbol;
      } else {
        throw new IllegalInsertionException(
          "Posição X e Y do jogo precisam estar dentro da matriz 3x3"
        );
      }
    } catch (error) {
      throw error;
    }
  }
  get GameState(): GameState {
    const Winner = this.Winner();
    const Over = Boolean(this.GameOver() || Winner);
    const Draw = !Winner && Over;
    return { Winner, Draw, Over };
  }
  private GameOver(): Boolean {
    return this.freeSpaces.length === 0;
  }
  private isWinning(sequence: GameSymbol[]): GameSymbol | false {
    const xWinCondition = "xxx";
    const oWinCondition = "ooo";
    if (sequence.join("") === xWinCondition) {
      return "x";
    }
    if (sequence.join("") === oWinCondition) {
      return "o";
    }
    return false;
  }
  private Winner(): GameSymbol | null {
    for (let col_x = 0; col_x < 3; col_x++) {
      let isWinner = this.isWinning(this.col(col_x));
      if (isWinner) {
        return isWinner;
      }
    }
    for (let row_y = 0; row_y < 3; row_y++) {
      let isWinner = this.isWinning(this.row(row_y));
      if (isWinner) {
        return isWinner;
      }
    }

    let isWinner = this.isWinning(this.diagonal());
    if (isWinner) {
      return isWinner;
    }

    isWinner = this.isWinning(this.antiDiagonal());
    if (isWinner) {
      return isWinner;
    }
    //nope
    return null;
  }

  toString() {
    let output = "";
    for (let pos_x = 0; pos_x < 3; pos_x++) {
      for (let pos_y = 0; pos_y < 3; pos_y++) {
        let space = this.Spaces[pos_x][pos_y];
        output += `${space.content}\t`;
      }
      output += "\n";
    }
    return output;
  }
}
