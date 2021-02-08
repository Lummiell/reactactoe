import { GameSymbol } from "../../classes/GameSymbol";

const RenderGameSymbol = ({ gameSymbol }: { gameSymbol: GameSymbol }) => {
  let symbolClass = "none";
  switch (gameSymbol) {
    case "o":
      symbolClass = "circleSymbol";
      break;
    case "x":
      symbolClass = "crossSymbol";
      break;
  }

  return <span className={`${symbolClass} `}>{gameSymbol}</span>;
};

export default RenderGameSymbol;
