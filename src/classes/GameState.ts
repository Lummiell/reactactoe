import { GameSymbol } from "./GameSymbol";
export interface GameState{
    Over: Boolean,
    Winner: GameSymbol | null
    Draw:Boolean
}