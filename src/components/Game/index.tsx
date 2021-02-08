import React, { useState, useEffect } from "react";
import { Game as GameInstance } from "../../classes/Game";
import { GameState } from "../../classes/GameState";
import { GameSymbol } from "../../classes/GameSymbol";
import "../../styles/Game.css";
import { getRandomInt } from "../../helpers/getRandomInt";
import RenderGameSymbol from "../RenderGameSymbol/index";
enum AIBehavior {
  none,
  random,
  followsHeuristics,
}
const Game = () => {
  const [gameInstance, setGameInstance] = useState(new GameInstance());
  const [turn, setTurn] = useState<GameSymbol>("x");
  const [lastMoveSymbol, setLastMoveSymbol] = useState<GameSymbol>("");
  const [gameState, setGameState] = useState<GameState>({
    Draw: false,
    Winner: null,
    Over: false,
  });
  const [showGameOverMessages, setShowGameOverMessages] = useState(false);
  const [resultMessage, setResultMessage] = useState(<></>);
  const [behavior, setBehavior] = useState<AIBehavior>(
    AIBehavior.followsHeuristics
  );
  const [playerSymbol, setPlayerSymbol] = useState<GameSymbol>("x");
  const AIRandomMove = () => {
    const freeSpaces = gameInstance.freeSpaces;
    const chosenPosition = getRandomInt(0, freeSpaces.length);
    const [chosenPos_x, chosenPos_y] = freeSpaces[chosenPosition];
    tryInsertSymbol(turn, chosenPos_x, chosenPos_y);
  };
  const AIChooseMove = () => {
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
        points = points + 8;
      }
      if (MoveResultsInWin(freeSpace, true)) {
        points = points + 8;
      }
      positionPoints.push({ points, pos_x: freeSpace[0], pos_y: freeSpace[1] });
    });
    console.log(positionPoints);
    const chosenSpace = positionPoints.sort((a, b) => b.points - a.points)[0];
    const { pos_x, pos_y } = chosenSpace;
    tryInsertSymbol(turn, pos_x, pos_y);
  };
  useEffect(() => {
    console.log(gameInstance.toString());
  }, [gameInstance]);

  useEffect(() => {
    if (gameState.Over) {
      setShowGameOverMessages(true);
      if (gameState.Draw) {
        setResultMessage(<>Empate</>);
        return;
      }
      if (gameState.Winner) {
        setResultMessage(
          <>
            O jogador do símbolo{" "}
            {<RenderGameSymbol gameSymbol={lastMoveSymbol} />} é o vencedor
          </>
        );
      }
    } else {
      if (turn !== playerSymbol && behavior !== AIBehavior.none) {
        switch (behavior) {
          case AIBehavior.random:
            AIRandomMove();
            break;
          case AIBehavior.followsHeuristics:
            AIChooseMove();
        }
      }
      setShowGameOverMessages(false);
      setResultMessage(<></>);
    }
  }, [gameState, lastMoveSymbol, turn, behavior, playerSymbol]);
  useEffect(() => {
    resetGame();
  }, [behavior, playerSymbol]);
  const switchTurn = () => {
    switch (turn) {
      case "x":
        setTurn("o");
        break;
      case "o":
        setTurn("x");
        break;
      default:
        break;
    }
  };

  const _insertSymbol = (symbol: GameSymbol, posx: number, posy: number) => {
    try {
      let game = new GameInstance();
      gameInstance.filledSpaces.forEach((filledSpace) => {
        game.insertSymbol(
          filledSpace.Symbol,
          filledSpace.posx,
          filledSpace.posy
        );
      });
      game.insertSymbol(symbol, posx, posy);
      setGameInstance(game);
      setGameState(game.GameState);
      setLastMoveSymbol(symbol);
      switchTurn();
    } catch (error) {
      alert(error.message);
    }
  };
  const resetGame = () => {
    setGameState({
      Draw: false,
      Winner: null,
      Over: false,
    });
    setGameInstance(new GameInstance());
    setTurn("x");
  };
  const tryInsertSymbol = (symbol: GameSymbol, posx: number, posy: number) => {
    if (!gameState.Over) {
      _insertSymbol(symbol, posx, posy);
    }
    if (gameState.Draw) {
      alert("O jogo acabou, Empate");
      return;
    }
    if (gameState.Winner) {
      alert(`O jogo acabou, ${gameState.Winner} é o vencedor`);
      return;
    }
  };
  return (
    <>
      <div className="Game">
        <table>
          <tr>
            <td
              onClick={() => {
                tryInsertSymbol(turn, 0, 0);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[0][0].content}
              />
            </td>
            <td
              className="vert"
              onClick={() => {
                tryInsertSymbol(turn, 1, 0);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[1][0].content}
              />
            </td>
            <td
              onClick={() => {
                tryInsertSymbol(turn, 2, 0);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[2][0].content}
              />
            </td>
          </tr>
          <tr>
            <td
              className="hori"
              onClick={() => {
                tryInsertSymbol(turn, 0, 1);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[0][1].content}
              />
            </td>
            <td
              className="vert hori"
              onClick={() => {
                tryInsertSymbol(turn, 1, 1);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[1][1].content}
              />
            </td>
            <td
              className="hori"
              onClick={() => {
                tryInsertSymbol(turn, 2, 1);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[2][1].content}
              />
            </td>
          </tr>
          <tr>
            <td
              onClick={() => {
                tryInsertSymbol(turn, 0, 2);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[0][2].content}
              />
            </td>
            <td
              className="vert"
              onClick={() => {
                tryInsertSymbol(turn, 1, 2);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[1][2].content}
              />
            </td>
            <td
              onClick={() => {
                tryInsertSymbol(turn, 2, 2);
              }}
            >
              <RenderGameSymbol
                gameSymbol={gameInstance.Spaces[2][2].content}
              />
            </td>
          </tr>
        </table>
        <label htmlFor="SelectAiBehavior">
          Comportamento da inteligencia artificial
        </label>
        <br />
        <select
          value={behavior}
          onChange={(e) => {
            setBehavior(Number(e.target.value));
          }}
          id="SelectAiBehavior"
        >
          <option value={AIBehavior.none}>Desligada</option>
          <option value={AIBehavior.random}>Aleatório</option>
          <option value={AIBehavior.followsHeuristics}>Heurístico</option>
        </select>
        <br />
        {behavior !== AIBehavior.none ? (
          <>
            <label htmlFor="SelectPlayerSymbol">Você joga de:</label><br/>
            <select
              value={playerSymbol}
              onChange={(e) => {
                const value = e.target.value as GameSymbol;
                setPlayerSymbol(value);
              }}
              id="SelectPlayerSymbol"
            >
              <option value={"o"}>o</option>
              <option value={"x"}>x</option>
            </select>
            <br />
          </>
        ) : (
          <></>
        )}
        <br />
        <button
          onClick={() => {
            resetGame();
          }}
        >
          Resetar
        </button>
        {!showGameOverMessages ? (
          behavior === AIBehavior.none ? (
            <p>
              Vez de: <RenderGameSymbol gameSymbol={turn} />
            </p>
          ) : (
            <></>
          )
        ) : (
          <>
            <p>O jogo acabou.</p>

            <p>{resultMessage}</p>
          </>
        )}
      </div>
    </>
  );
};

export default Game;
