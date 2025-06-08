
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LandingPageProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export const LandingPage = ({ onCreateRoom, onJoinRoom }: LandingPageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/90 border-2 border-blue-500/50 backdrop-blur-sm">
        <div className="p-8 text-center space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-lg border-2 border-orange-400 flex items-center justify-center">
              <div className="text-2xl font-bold text-white">DV</div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-orange-400 bg-clip-text text-transparent">
              Digivice Arena
            </h1>
            <p className="text-slate-300 text-sm">
              Battle with your Digimon friends in real-time!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={onCreateRoom}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg border border-blue-500 transition-all duration-200 hover:scale-105"
            >
              Create Room
            </Button>
            
            <Button 
              onClick={onJoinRoom}
              variant="outline"
              className="w-full border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-semibold py-3 rounded-lg transition-all duration-200 hover:scale-105"
            >
              Join Room
            </Button>
          </div>

          {/* Footer */}
          <div className="text-xs text-slate-500 border-t border-slate-700 pt-4">
            Connect with friends and battle!
          </div>
        </div>
      </Card>
    </div>
  );
};
