
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import type { Room, Player, GameState } from "@/pages/Index";

interface BattleArenaProps {
  room: Room;
  currentPlayer: Player;
  onBattleStart: () => void;
  onExitRoom: () => void;
  gameState: GameState;
  setRoom: (room: Room) => void;
  setCurrentPlayer: (player: Player) => void;
}

export const BattleArena = ({ 
  room, 
  currentPlayer, 
  onBattleStart, 
  onExitRoom, 
  gameState,
  setRoom,
  setCurrentPlayer 
}: BattleArenaProps) => {
  const [localRoom, setLocalRoom] = useState<Room>(room);
  const [localPlayer, setLocalPlayer] = useState<Player>(currentPlayer);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [battleEnded, setBattleEnded] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  const opponent = localRoom.players.find(p => p.id !== localPlayer.id);
  const isWaiting = gameState === "waiting" && localRoom.players.length < 2;
  const canBattle = localRoom.players.length === 2 && localRoom.players.every(p => p.isReady);

  useEffect(() => {
    if (canBattle && gameState === "waiting") {
      onBattleStart();
    }
  }, [canBattle, gameState, onBattleStart]);

  useEffect(() => {
    // Simulate turn system
    if (gameState === "battle" && !battleEnded) {
      setIsMyTurn(localRoom.currentTurn % 2 === (localPlayer.id === "player1" ? 0 : 1));
    }
  }, [localRoom.currentTurn, localPlayer.id, gameState, battleEnded]);

  const handleReady = () => {
    const updatedPlayer = { ...localPlayer, isReady: true };
    const updatedPlayers = localRoom.players.map(p => 
      p.id === localPlayer.id ? updatedPlayer : p
    );
    
    const updatedRoom = {
      ...localRoom,
      players: updatedPlayers,
      battleLog: [...localRoom.battleLog, `${localPlayer.name} is ready!`]
    };

    setLocalPlayer(updatedPlayer);
    setLocalRoom(updatedRoom);
    setRoom(updatedRoom);
    setCurrentPlayer(updatedPlayer);
    
    toast.success("You are ready!");
  };

  const handleAttack = () => {
    if (!isMyTurn || !opponent || battleEnded) return;

    const damage = Math.floor(Math.random() * 30) + 15; // 15-45 damage
    const newOpponentHp = Math.max(0, opponent.hp - damage);
    
    const updatedOpponent = { ...opponent, hp: newOpponentHp };
    const updatedPlayers = localRoom.players.map(p => 
      p.id === opponent.id ? updatedOpponent : p
    );

    const attackMessage = `${localPlayer.name}'s ${localPlayer.digimon} attacks ${opponent.name}'s ${opponent.digimon} for ${damage} damage!`;
    
    const updatedRoom = {
      ...localRoom,
      players: updatedPlayers,
      battleLog: [...localRoom.battleLog, attackMessage],
      currentTurn: localRoom.currentTurn + 1
    };

    setLocalRoom(updatedRoom);
    setRoom(updatedRoom);

    // Check for winner
    if (newOpponentHp <= 0) {
      setBattleEnded(true);
      setWinner(localPlayer);
      const winMessage = `${localPlayer.name} wins the battle!`;
      const finalRoom = {
        ...updatedRoom,
        battleLog: [...updatedRoom.battleLog, winMessage]
      };
      setLocalRoom(finalRoom);
      setRoom(finalRoom);
      toast.success("Victory!");
    } else {
      // Simulate opponent's turn after a delay
      setTimeout(() => {
        if (!battleEnded) {
          simulateOpponentTurn(updatedRoom);
        }
      }, 1500);
    }
  };

  const simulateOpponentTurn = (currentRoom: Room) => {
    if (battleEnded) return;
    
    const opponentDamage = Math.floor(Math.random() * 30) + 15;
    const newPlayerHp = Math.max(0, localPlayer.hp - opponentDamage);
    
    const updatedLocalPlayer = { ...localPlayer, hp: newPlayerHp };
    const updatedPlayers = currentRoom.players.map(p => 
      p.id === localPlayer.id ? updatedLocalPlayer : p
    );

    const opponentAttackMessage = `${opponent?.name}'s ${opponent?.digimon} attacks ${localPlayer.name}'s ${localPlayer.digimon} for ${opponentDamage} damage!`;
    
    const updatedRoom = {
      ...currentRoom,
      players: updatedPlayers,
      battleLog: [...currentRoom.battleLog, opponentAttackMessage],
      currentTurn: currentRoom.currentTurn + 1
    };

    setLocalPlayer(updatedLocalPlayer);
    setLocalRoom(updatedRoom);
    setRoom(updatedRoom);
    setCurrentPlayer(updatedLocalPlayer);

    // Check if player lost
    if (newPlayerHp <= 0) {
      setBattleEnded(true);
      setWinner(opponent!);
      const loseMessage = `${opponent?.name} wins the battle!`;
      const finalRoom = {
        ...updatedRoom,
        battleLog: [...updatedRoom.battleLog, loseMessage]
      };
      setLocalRoom(finalRoom);
      setRoom(finalRoom);
      toast.error("Defeat!");
    }
  };

  const handlePlayAgain = () => {
    // Reset battle state
    const resetPlayers = localRoom.players.map(p => ({
      ...p,
      hp: p.maxHp,
      isReady: false
    }));

    const resetRoom = {
      ...localRoom,
      players: resetPlayers,
      battleLog: ["Battle reset! Get ready for another round!"],
      currentTurn: 0
    };

    setLocalRoom(resetRoom);
    setRoom(resetRoom);
    setLocalPlayer({ ...localPlayer, hp: localPlayer.maxHp, isReady: false });
    setCurrentPlayer({ ...localPlayer, hp: localPlayer.maxHp, isReady: false });
    setBattleEnded(false);
    setWinner(null);
    
    toast.success("New battle started!");
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-400 mb-2">Room: {localRoom.id}</h1>
        {isWaiting && (
          <p className="text-orange-400 animate-pulse">Waiting for opponent to join...</p>
        )}
      </div>

      <div className="grid gap-4 max-w-6xl mx-auto">
        {/* Players Section */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Current Player */}
          <Card className="bg-slate-800/90 border-2 border-blue-500/50 p-4">
            <div className="space-y-3">
              <div className="text-center">
                <h3 className="text-lg font-bold text-blue-400">{localPlayer.name} (You)</h3>
                <p className="text-slate-300">{localPlayer.digimon}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">HP</span>
                  <span className="text-white">{localPlayer.hp}/{localPlayer.maxHp}</span>
                </div>
                <Progress 
                  value={(localPlayer.hp / localPlayer.maxHp) * 100} 
                  className="h-3"
                />
              </div>

              {localPlayer.isReady && (
                <div className="text-center text-green-400 font-semibold">
                  ✓ Ready
                </div>
              )}
            </div>
          </Card>

          {/* Opponent */}
          {opponent ? (
            <Card className="bg-slate-800/90 border-2 border-orange-500/50 p-4">
              <div className="space-y-3">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-orange-400">{opponent.name}</h3>
                  <p className="text-slate-300">{opponent.digimon}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">HP</span>
                    <span className="text-white">{opponent.hp}/{opponent.maxHp}</span>
                  </div>
                  <Progress 
                    value={(opponent.hp / opponent.maxHp) * 100} 
                    className="h-3"
                  />
                </div>

                {opponent.isReady && (
                  <div className="text-center text-green-400 font-semibold">
                    ✓ Ready
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-2 border-slate-600 p-4">
              <div className="text-center text-slate-500">
                <p>Waiting for opponent...</p>
              </div>
            </Card>
          )}
        </div>

        {/* Battle Log */}
        <Card className="bg-slate-800/90 border-2 border-green-500/50 p-4">
          <h3 className="text-lg font-bold text-green-400 mb-3">Battle Log</h3>
          <ScrollArea className="h-32">
            <div className="space-y-1">
              {localRoom.battleLog.map((log, index) => (
                <p key={index} className="text-sm text-slate-300">
                  {log}
                </p>
              ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-slate-800/90 border-2 border-purple-500/50 p-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {gameState === "waiting" && opponent && !localPlayer.isReady && (
              <Button
                onClick={handleReady}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
              >
                Ready
              </Button>
            )}

            {gameState === "battle" && canBattle && !battleEnded && (
              <Button
                onClick={handleAttack}
                disabled={!isMyTurn}
                className={`font-semibold px-6 ${
                  isMyTurn 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-slate-600 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isMyTurn ? "Attack!" : "Opponent's Turn"}
              </Button>
            )}

            {battleEnded && (
              <div className="flex gap-3">
                <Button
                  onClick={handlePlayAgain}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6"
                >
                  Play Again
                </Button>
                <Button
                  onClick={onExitRoom}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 px-6"
                >
                  Exit Room
                </Button>
              </div>
            )}

            {!battleEnded && (
              <Button
                onClick={onExitRoom}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700 px-6"
              >
                Exit Room
              </Button>
            )}
          </div>

          {winner && (
            <div className="text-center mt-4">
              <h2 className="text-2xl font-bold text-yellow-400">
                🏆 {winner.name} Wins! 🏆
              </h2>
            </div>
          )}

          {gameState === "battle" && canBattle && !battleEnded && isMyTurn && (
            <div className="text-center mt-2">
              <p className="text-blue-400 font-semibold animate-pulse">It's your turn!</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
