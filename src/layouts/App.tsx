import {
  FaGear,
  FaDatabase,
  FaPlay,
  FaStop,
  FaCircleQuestion,
} from "react-icons/fa6";
import { useGameStore } from "../state/gameState.ts";
import { GrScorecard } from "react-icons/gr";
import { Link, Route, Switch, useLocation } from "wouter";
import { useCallback } from "react";
import Configure from "./Configure.tsx";
import Docs from "./Docs.tsx";
import Settings from "./Settings.tsx";
import Play from "./Play.tsx";
import History from "./History.tsx";

const ICON_SIZE = 24;

const App = () => {
  const [location] = useLocation();
  const gameMode = useGameStore((state) => state.gameMode);
  const stopGame = useGameStore((state) => state.stopGame);

  const handleStopClick = useCallback(
    (e: React.MouseEvent) => {
      if (location === "/") {
        e.preventDefault();
      }
      stopGame();
    },
    [location, stopGame],
  );

  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="h-16 bg-neutral-800 flex items-center pl-4 pr-4 text-white shrink-0">
        <div className="text-4xl pb-2 font-bold text-violet-400">jijo</div>
        <div className="top-menu ml-auto flex gap-4 text-neutral-400">
          {gameMode === "endless" ? (
            <Link to="/">
              <FaStop
                size={ICON_SIZE}
                className="text-white"
                onClick={handleStopClick}
              />
            </Link>
          ) : (
            <Link to="/">
              <FaPlay
                size={ICON_SIZE}
                className={location === "/" ? "text-white" : ""}
              />
            </Link>
          )}
          <Link to="/history">
            <GrScorecard
              size={ICON_SIZE}
              className={location === "/history" ? "text-white" : ""}
            />
          </Link>
          <Link to="/settings">
            <FaGear
              size={ICON_SIZE}
              className={location === "/settings" ? "text-white" : ""}
            />
          </Link>
          <Link to="/configure">
            <FaDatabase
              size={ICON_SIZE}
              className={location === "/configure" ? "text-white" : ""}
            />
          </Link>
          <Link to="/docs">
            <FaCircleQuestion
              size={ICON_SIZE}
              className={location === "/docs" ? "text-white" : ""}
            />
          </Link>
        </div>
      </div>
      <div className="grow overflow-y-auto">
        <Switch>
          <Route path="/configure" component={Configure} />
          <Route path="/docs" component={Docs} />
          <Route path="/settings" component={Settings} />
          <Route path="/history" component={History} />
          <Route component={Play} />
        </Switch>
      </div>
    </div>
  );
};

export default App;
