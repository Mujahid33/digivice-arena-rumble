
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Room, Player } from "@/pages/Index";

interface CreateRoomProps {
  onRoomCreated: (room: Room, player: Player) => void;
  onBack: () => void;
}

export const CreateRoom = ({ onRoomCreated, onBack }: CreateRoomProps) => {
  const [playerName, setPlayerName] = useState("");
  const [selectedDigimon, setSelectedDigimon] = useState("Agumon");
  const [isCreating, setIsCreating] = useState(false);

  const digimons = ["Agumon", "Gabumon", "Biyomon", "Tentomon", "Palmon", "Gomamon"];

  const generateRoomId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name!");
      return;
    }

    setIsCreating(true);
    
    // Simulate room creation
    setTimeout(() => {
      const roomId = generateRoomId();
      const player: Player = {
        id: "player1",
        name: playerName.trim(),
        digimon: selectedDigimon,
        hp: 100,
        maxHp: 100,
        isReady: false,
      };

      const room: Room = {
        id: roomId,
        players: [player],
        battleLog: [],
        currentTurn: 0,
        gameState: "waiting",
      };

      onRoomCreated(room, player);
      toast.success(`Room ${roomId} created successfully!`);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 border-2 border-blue-500/50 backdrop-blur-sm">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-blue-400 mb-2">Create Room</h2>
            <p className="text-slate-300 text-sm">Set up your battle arena</p>
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
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3"
            >
              {isCreating ? "Creating Room..." : "Create Room"}
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
