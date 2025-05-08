import {useRef, useState} from "react";
import { Axios } from "../api/axios";
import {NavLink, Outlet } from "react-router-dom";
import { Authentication } from '../auth/auth';
import { useAuthUser } from 'react-auth-kit';
import { base64StringToBlob } from "blob-util";
function Home(){
    const User = useAuthUser()
    const [showUsername, setShowUsername] = useState(false);
    const [video_url, setVideo_url] = useState("http://173.212.195.91:5001/recognition/video_stream");
    const axios = Axios();
  
    const { DoLogOut } = Authentication();
    const videoRef = useRef(null);
    const LoadblobImage = (Image) => {
              const converted_blob = base64StringToBlob(Image, "image/png");
              const blobUrl = URL.createObjectURL(converted_blob);
              return blobUrl  
          };

    const set_url = async () =>{
        let response = await axios.post("set-video-url", {"url": video_url})
        .then((response) => {
            alert(`L\'url de streaming est configuré: ${video_url}`)
        })
        .catch((error) => {
            console.log(error)
        })
      
    }
    const changeUrl = (e) =>{
        setVideo_url(e.target.value)
    }
    const Logout = () => {
        DoLogOut()
    }
    const display = () => {
        setShowUsername(!showUsername)
    }


return(<>

    <div className="grid grid-rows-[8%_36%_56%] w-full h-screen bg-white">
        <div className="relative w-full h-full shadow-gray-500 shadow-md flex gap-6 pr-10 items-center bg-[#07A889]">
            <div className="absolute flex  gap-4 items-center  right-4">
                <NavLink to="" className="relative flex items-center justify-center w-10 h-10">
                    <div className="absolute w-8 h-8 rounded-full -z-1 animate-ping bg-gray-200"></div> 
                    <svg className="z-10" xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 512 512"><path fill="white" d="M186.2 139.6h139.6V0H186.2zM372.4 0v139.6H512V0zM0 139.6h139.6V0H0zm186.2 186.2h139.6V186.2H186.2zm186.2 0H512V186.2H372.4zM0 325.8h139.6V186.2H0zM186.2 512h139.6V372.4H186.2zm186.2 0H512V372.4H372.4zM0 512h139.6V372.4H0z"/></svg>
                </NavLink>
                
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white border-[1px] border-gray-500" onClick={display} >
                    <img className="w-10 h-10  rounded-full bg-white " src={LoadblobImage(User().Image)} />
                    { showUsername &&
                        <div className="absolute z-40 right-0 max-w-44 -bottom-9 text-xs overflow-hidden rounded-md shadow-xl ring-2 ring-[#07A889] bg-gray-900" >
                            <div className="flex w-full items-center justify-start gap-4 py-2 px-2 ">
                                <span className="text-white font-semibold ">{User().username}
                                    
                                </span>
                            </div>
                        </div>
                    }
                </div>
                <button onClick={Logout} className="flex h-10 items-center text-sm font-semibold text-white bg-[#121330] p-2 rounded-lg shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><path fill="white" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"/></svg>
                    Deconnexion
                </button>
            </div>
        </div>
        <div className="grid grid-cols-1 gap-2 my-2 mx-2">
            <div className="relative flex justify-center">
                <div className="absolute flex items-center gap-2 left-2 text-sm text-center"> 
                    <input type="text"  name="url" value={video_url} onChange={changeUrl} className="p-2 border border-gray-900 rounded-lg" placeholder="http://xxx.xxx.xxx.xxx:xxxx" />
                    <button onClick={set_url} className="p-2 flex items-center justify-center rounded-lg bg-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#fff" d="M14 18v-2l-4 3.5l4 3.5v-2h3v-3zm8-2.5L18 12v2h-3v3h3v2zm-.34-6.77l-2-3.46c-.12-.22-.38-.31-.61-.22l-2.49 1c-.51-.41-1.06-.74-1.69-1l-.37-2.63A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.26-1.17.59-1.69 1L5 5.05c-.23-.09-.5 0-.61.22l-2 3.46c-.13.21-.08.49.11.64L4.57 11c-.04.33-.07.67-.07 1s.03.67.07 1l-2.11 1.63c-.2.15-.25.43-.12.64l2 3.46c.11.27.4.38.66.27l2.5-1c.24.19.5.37.76.53l3.51-3A3.52 3.52 0 0 1 8.5 11.8c.15-1.93 1.82-3.39 3.75-3.25c1.44.09 2.67 1.07 3.1 2.45h4.08l2.11-1.63c.19-.15.24-.43.12-.64"></path></svg>
                    </button>
                </div>
                <div className="w-full md:w-[50%] 2xl:w-[40%] h-full  border-2 flex items-center justify-center shadow-sm bg-white">
                        <img className="w-full h-full"
                            src={video_url} 
                            alt="Camera Stream"
                        />
                </div>
           </div>
        </div>
    
       
        <div className="overflow-y-auto w-full  shadow-xl bg-white">
            <div className="relative px-10 w-full h-screen">
                <Outlet  />
            </div>
        </div>
    </div>
    
</>)

}

export default Home;
