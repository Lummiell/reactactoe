import { Game as GameInstance } from "../../../classes/Game";
import { GameSymbol } from "../../../classes/GameSymbol";
import { getRandomInt } from "../../../helpers/getRandomInt";
import { Position } from "../../../classes/GamePosition";

const RandomMove = (gameInstance: GameInstance): Position => {
  const freeSpaces = gameInstance.freeSpaces;
  const chosenPosition = getRandomInt(0, freeSpaces.length);
  const [pos_x, pos_y] = freeSpaces[chosenPosition];
  return { pos_x, pos_y };
};
const ChooseMove = (
  gameInstance: GameInstance,
  playerSymbol: GameSymbol
): Position => {
  function isEdgeSpace(position: number[]): boolean {
    const edgeSpaces = [
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ];
    for (let i = 0; i < edgeSpaces.length; i++) {
      const element = edgeSpaces[i];
      if (element[0] === position[0] && element[1] === position[1]) {
        return true;
      }
    }
    return false;
  }
  function isCentralSpace(position: number[]): boolean {
    const centralSpace = [1, 1];
    return centralSpace[0] === position[0] && centralSpace[1] === position[1];
  }
  function lineHasPlayerSymbol(position: number[]) {
    return (
      gameInstance.col(position[0]).includes(playerSymbol) ||
      gameInstance.row(position[1]).includes(playerSymbol) ||
      ((isCentralSpace(position) || isEdgeSpace(position)) &&
        (gameInstance.diagonal().includes(playerSymbol) ||
          gameInstance.antiDiagonal().includes(playerSymbol)))
    );
  }
  function MoveResultsInWin(
    position: number[],
    toPlayer: boolean = false
  ): boolean {
    const [pos_x, pos_y] = position;
    const simulatedGameInstance = new GameInstance();
    gameInstance.filledSpaces.forEach((filledSpace) => {
      simulatedGameInstance.insertSymbol(
        filledSpace.Symbol,
        filledSpace.posx,
        filledSpace.posy
      );
    });
    if (!toPlayer) {
      const AISymbol = playerSymbol === "x" ? "o" : "x";
      simulatedGameInstance.insertSymbol(AISymbol, pos_x, pos_y);
      return Boolean(simulatedGameInstance.GameState.Winner === AISymbol);
    } else {
      simulatedGameInstance.insertSymbol(playerSymbol, pos_x, pos_y);
      return Boolean(simulatedGameInstance.GameState.Winner === playerSymbol);
    }
  }
  const freeSpaces = gameInstance.freeSpaces;
  const positionPoints: {
    pos_x: number;
    pos_y: number;
    points: number;
  }[] = [];
  freeSpaces.forEach((freeSpace) => {
    let points = 0;
    if (isCentralSpace(freeSpace)) {
      points = points + 2;
    } else if (isEdgeSpace(freeSpace)) {
      points = points + 1;
    }
    if (lineHasPlayerSymbol(freeSpace)) {
      points = points - 2;
    }
    if (MoveResultsInWin(freeSpace)) {
      points = points + 16;
    }
    if (MoveResultsInWin(freeSpace, true)) {
      points = points + 8;
    }
    positionPoints.push({ points, pos_x: freeSpace[0], pos_y: freeSpace[1] });
  });
  const chosenSpace = positionPoints.sort((a, b) => b.points - a.points)[0];
  const { pos_x, pos_y } = chosenSpace;
  return { pos_x, pos_y };
};
const AI = {RandomMove,ChooseMove} 
export default AI
