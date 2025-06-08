
import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { CreateRoom } from "@/components/CreateRoom";
import { JoinRoom } from "@/components/JoinRoom";
import { BattleArena } from "@/components/BattleArena";

export type GameState = "landing" | "create" | "join" | "waiting" | "battle";

export interface Player {
  id: string;
  name: string;
  digimon: string;
  hp: number;
  maxHp: number;
  isReady: boolean;
}

export interface Room {
  id: string;
  players: Player[];
  battleLog: string[];
  currentTurn: number;
  gameState: GameState;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const handleCreateRoom = () => {
    setGameState("create");
  };

  const handleJoinRoom = () => {
    setGameState("join");
  };

  const handleRoomCreated = (roomData: Room, player: Player) => {
    setRoom(roomData);
    setCurrentPlayer(player);
    setGameState("waiting");
  };

  const handleRoomJoined = (roomData: Room, player: Player) => {
    setRoom(roomData);
    setCurrentPlayer(player);
    setGameState("battle");
  };

  const handleBackToLanding = () => {
    setGameState("landing");
    setRoom(null);
    setCurrentPlayer(null);
  };

  const handleBattleStart = () => {
    setGameState("battle");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {gameState === "landing" && (
        <LandingPage 
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}
      
      {gameState === "create" && (
        <CreateRoom 
          onRoomCreated={handleRoomCreated}
          onBack={handleBackToLanding}
        />
      )}
      
      {gameState === "join" && (
        <JoinRoom 
          onRoomJoined={handleRoomJoined}
          onBack={handleBackToLanding}
        />
      )}
      
      {(gameState === "waiting" || gameState === "battle") && room && currentPlayer && (
        <BattleArena 
          room={room}
          currentPlayer={currentPlayer}
          onBattleStart={handleBattleStart}
          onExitRoom={handleBackToLanding}
          gameState={gameState}
          setRoom={setRoom}
          setCurrentPlayer={setCurrentPlayer}
        />
      )}
    </div>
  );
};

export default Index;
