
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Room, Player } from "@/pages/Index";

interface JoinRoomProps {
  onRoomJoined: (room: Room, player: Player) => void;
  onBack: () => void;
}

export const JoinRoom = ({ onRoomJoined, onBack }: JoinRoomProps) => {
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedDigimon, setSelectedDigimon] = useState("Agumon");
  const [isJoining, setIsJoining] = useState(false);

  const digimons = ["Agumon", "Gabumon", "Biyomon", "Tentomon", "Palmon", "Gomamon"];

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      toast.error("Please enter a Room ID!");
      return;
    }
    
    if (!playerName.trim()) {
      toast.error("Please enter your name!");
      return;
    }

    setIsJoining(true);

    // Simulate room joining (in real app, this would check if room exists)
    setTimeout(() => {
      if (roomId.length !== 6) {
        toast.error("Invalid Room ID format!");
        setIsJoining(false);
        return;
      }

      const player: Player = {
        id: "player2",
        name: playerName.trim(),
        digimon: selectedDigimon,
        hp: 100,
        maxHp: 100,
        isReady: false,
      };

      // Simulate existing room with player 1
      const existingPlayer: Player = {
        id: "player1",
        name: "Host Player",
        digimon: "Gabumon",
        hp: 100,
        maxHp: 100,
        isReady: false,
      };

      const room: Room = {
        id: roomId.toUpperCase(),
        players: [existingPlayer, player],
        battleLog: [`${playerName} joined the room!`],
        currentTurn: 0,
        gameState: "battle",
      };

      onRoomJoined(room, player);
      toast.success(`Joined room ${roomId.toUpperCase()} successfully!`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 border-2 border-orange-500/50 backdrop-blur-sm">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-orange-400 mb-2">Join Room</h2>
            <p className="text-slate-300 text-sm">Enter your friend's room</p>
          </div>

          {/* Room ID Input */}
          <div>
            <Label htmlFor="roomId" className="text-slate-300">Room ID</Label>
            <Input
              id="roomId"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              placeholder="Enter 6-character room ID"
              className="bg-slate-700 border-slate-600 text-white font-mono text-center tracking-wider"
              maxLength={6}
            />
          </div>

          {/* Player Setup */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="playerName" className="text-slate-300">Your Name</Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="bg-slate-700 border-slate-600 text-white"
                maxLength={20}
              />
            </div>

            <div>
              <Label className="text-slate-300">Choose Your Digimon</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {digimons.map((digimon) => (
                  <Button
                    key={digimon}
                    variant={selectedDigimon === digimon ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDigimon(digimon)}
                    className={selectedDigimon === digimon 
                      ? "bg-orange-600 hover:bg-orange-700 text-white" 
                      : "border-slate-600 text-slate-300 hover:bg-slate-700"
                    }
                  >
                    {digimon}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleJoinRoom}
              disabled={isJoining}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold py-3"
            >
              {isJoining ? "Joining Room..." : "Join Room"}
            </Button>

            <Button
              onClick={onBack}
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Back
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
