import { Player } from "@lottiefiles/react-lottie-player";
import Desktop from "../assets/Animation - 1735300976755.json"
function Dashboard(){
    return(<>
        <div className="absolute top-0 left-4 w-60 h-60">
                <Player src={Desktop} className="player" loop autoplay />
        </div>
        <div className="relative w-full h-full">
            
        </div>
        
    </>)
    
    }
    
export default Dashboard;