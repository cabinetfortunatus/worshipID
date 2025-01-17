import { Player } from "@lottiefiles/react-lottie-player";
import Desktop from "../assets/Animation - 1735300976755.json"
function Dashboard(){
    return(<>
        {/* <div className="absolute top-0 left-4 w-60 h-60">
                <Player src={Desktop} className="player" loop autoplay />
        </div> */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 w-full h-[20%]">
            <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center bg-teal-400 justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 640 512"><path fill="white" d="M144 0a80 80 0 1 1 0 160a80 80 0 1 1 0-160m368 0a80 80 0 1 1 0 160a80 80 0 1 1 0-160M0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96H21.3C9.6 320 0 310.4 0 298.7M405.3 320h-.7c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7c58.9 0 106.7 47.8 106.7 106.7c0 11.8-9.6 21.3-21.3 21.3H405.4zM224 224a96 96 0 1 1 192 0a96 96 0 1 1-192 0m-96 261.3c0-73.6 59.7-133.3 133.3-133.3h117.3c73.7 0 133.4 59.7 133.4 133.3c0 14.7-11.9 26.7-26.7 26.7H154.6c-14.7 0-26.7-11.9-26.7-26.7z"></path></svg>
                    <h1 className="text-md text-white font-semibold">Utilisateurs</h1>
                </div>
                <div className="flex flex-col p-6 items-start rounded-b-lg">
                    <div><span className="">Total:</span></div>
                    <div><span className="">Admin:</span></div>
                    <div><span className="">Utilisateurs simples:</span></div>
                </div>
                
            </div>
            <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center bg-purple-500 justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="white" d="M21 17V8H7v9zm0-14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V1h2v2h8V1h2v2zM3 21h14v2H3a2 2 0 0 1-2-2V9h2zm16-6h-4v-4h4z"></path></svg>
                    <h1 className="text-md font-semibold text-white">Evènements</h1>
                </div>
                <div className="flex flex-col p-6 items-start rounded-b-lg">
                    <div><span className="">Total:</span></div>
                    <div><span className="">En cours:</span></div>
                </div>
                
            </div>
            <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center bg-blue-500 justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 16 16"><path fill="white" d="M5 16v-5.3c-.6-.3-1-1-1-1.7V5c0-.7.4-1.3 1-1.7V3c0-1.1-.9-2-2-2s-2 .9-2 2s.9 2 2 2H1c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1v5zM15 5h-2c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2v.3c.6.4 1 1 1 1.7v4c0 .7-.4 1.4-1 1.7V16h4v-5c.5 0 1-.5 1-1V6c0-.5-.5-1-1-1m-5-3a2 2 0 1 1-3.999.001A2 2 0 0 1 10 2"></path><path fill="white" d="M10 4H6c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1v6h4v-6c.5 0 1-.5 1-1V5c0-.5-.5-1-1-1"></path></svg>
                    <h1 className="text-md font-semibold text-white">Groupes</h1>
                </div>
                <div className="flex flex-col p-6 items-start rounded-b-lg">
                    <div><span className="">Total:</span></div>
                    <div><span className="">En cours:</span></div>
                </div>
                
            </div>
            <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center bg-red-500 justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="white" d="M3 3h18v13h-6.077v4.27L12 18.807l-2.923 1.461V16H3zm1 9.577h16v-2.154H4z"></path></svg>
                    <h1 className="text-md font-semibold text-white">Membres</h1>
                </div>
                <div className="flex flex-col p-6 items-start rounded-b-lg">
                    <div><span className="">Total:</span></div>
                    <div><span className="">Dans un groupe:</span></div>
                </div>
                
            </div>
        </div>
        
    </>)
    
    }
    
export default Dashboard;