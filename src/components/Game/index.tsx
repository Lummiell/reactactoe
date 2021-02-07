import React, { useState, useCallback, useEffect } from "react";
import { Game as GameInstance } from "../../classes/Game";
import { GameState } from "../../classes/GameState";
import { GameSymbol } from "../../classes/GameSymbol";
import "../../styles/Game.css";
const RenderGameSymbol = ({ gameSymbol }: { gameSymbol: GameSymbol }) => {
  let className = "none";
  switch (gameSymbol) {
    case "o":
      className = "circleSymbol";
      break;
    case "x":
      className = "crossSymbol";
      break;
  }
  return <span className={className}>{gameSymbol}</span>;
};
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
  const [resultMessage, setResultMessage] = useState("");
  useEffect(() => {
    console.log(gameInstance.toString());
  }, [gameInstance]);
  useEffect(() => {
    if (gameState.Over) {
      setShowGameOverMessages(true);
      if (gameState.Draw) {
        setResultMessage("Empate.");
        return;
      }
      if (gameState.Winner) {
        setResultMessage(`O jogador do símbolo ${lastMoveSymbol} é o vencedor`);
      }
    } else {
      setShowGameOverMessages(false);
      setResultMessage("");
    }
  }, [gameState, lastMoveSymbol]);
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

  const _insertSymbol = useCallback(
    (symbol: GameSymbol, posx: number, posy: number) => {
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
      } catch (error) {
        alert(error.message);
      }
    },
    [gameInstance]
  );
  const resetGame = () => {
    setGameState({
      Draw: false,
      Winner: null,
      Over: false,
    });
    setGameInstance(new GameInstance());
    setTurn('x')
  };
  const tryInsertSymbol = (symbol: GameSymbol, posx: number, posy: number) => {
    if (!gameState.Over) {
      _insertSymbol(symbol, posx, posy);
      switchTurn();
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
        {gameInstance.Spaces.map((Row, i) => {
          return (
            <>
              <ul key={i}>
                {Row.map((Space, j) => {
                  return (
                    <li
                      onClick={() => {
                        tryInsertSymbol(turn, i, j);
                      }}
                      key={`${i}${j}`}
                    >
                      <RenderGameSymbol gameSymbol={Space.content} />
                    </li>
                  );
                })}
              </ul>
            </>
          );
        })}
        <button
          onClick={() => {
            resetGame();
          }}
        >
          Resetar
        </button>
        {!showGameOverMessages ? (
          <p>
            Vez de: <RenderGameSymbol gameSymbol={turn} />
          </p>
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
