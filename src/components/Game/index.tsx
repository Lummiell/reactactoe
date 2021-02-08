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
  const [behavior, setBehavior] = useState<AIBehavior>(AIBehavior.random);
  const [playerSymbol, setPlayerSymbol] = useState<GameSymbol>("x");
  const AIRandomMove = () => {
    const freeSpaces = gameInstance.freeSpaces;
    const chosenPosition = getRandomInt(0, freeSpaces.length);
    const [chosenPos_x, chosenPos_y] = freeSpaces[chosenPosition];
    tryInsertSymbol(turn, chosenPos_x, chosenPos_y);
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
        }
      }
      setShowGameOverMessages(false);
      setResultMessage(<></>);
    }
  }, [gameState, lastMoveSymbol, turn,behavior,playerSymbol]);
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
        </select>
        <br />
        {behavior !== AIBehavior.none ? (
          <>
            <label htmlFor="SelectPlayerSymbol">Você joga de:</label>
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
