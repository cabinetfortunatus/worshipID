import { useEffect, useRef, useState} from "react";
import {NavLink, Outlet } from "react-router-dom";
import { Authentication } from '../auth/auth';
import { useAuthUser } from 'react-auth-kit';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { base64StringToBlob } from "blob-util";
function Home(){
    const User = useAuthUser()
    const [showUsername, setShowUsername] = useState(false);
    const [video_url, setVideo_url] = useState("rtsp://192.168.1.172:8080/h264_ulaw.sdp");
    const camList = ({
        "url1":"rtsp://192.168.1.172:8080/h264_ulaw.sdp",
        "url2":"", 
        "url3":"",
        "url4":""
    });
    const { DoLogOut } = Authentication();
    const videoRef = useRef(null);
    const LoadblobImage = (Image) => {
              const converted_blob = base64StringToBlob(Image, "image/png");
              const blobUrl = URL.createObjectURL(converted_blob);
              return blobUrl  
          };

    const changeUrl1 = () =>{
        setVideo_url(camList.url1)
    }
    const changeUrl2 = () =>{
        setVideo_url(camList.url2)
    }
    const changeUrl3 = () =>{
        setVideo_url(camList.url3)
    }
    const changeUrl4 = () =>{
        setVideo_url(camList.url4)
    }
    const Logout = () => {
        DoLogOut()
    }
    const display = () => {
        setShowUsername(!showUsername)
    }
    useEffect(()=> {
        console.log(video_url)
        const player = videojs(videoRef.current, {
            controls: true,
            autoplay: true,
            preload: 'auto',
            sources: [{
              src: video_url,  
              type: 'application/x-mpegURL'
            }]
          });
      
          return () => {
            player.dispose();
          };
    })

return(<>

    <div className="grid grid-rows-[8%_36%_56%] w-full h-screen bg-white">
        <div className="relative w-full h-full shadow-gray-500 shadow-md flex gap-6 pr-10 items-center bg-[#07A889]">
            <div className="absolute left-2 text-sm text-center"> 
                <select className="p-2 rounded-md ring-1 ring-gray-900">
                    <option onClick={changeUrl1}>CAM 1</option>
                    <option onClick={changeUrl2}>CAM 2</option>
                    <option onClick={changeUrl3}>CAM 3</option>
                    <option onClick={changeUrl4}>CAM 4</option>
                </select>
            </div>
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
                                <span className="text-white font-semibold ">{User().username}</span>
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
            <div className="flex justify-center">
                <div className="w-full md:w-[50%] 2xl:w-[40%] h-full  border-2 flex items-center justify-center shadow-sm bg-white">
                        <video ref={videoRef} className="w-full h-full video-js vjs-default-skin" />
                        <img className="w-full h-full"
                            src="http://192.168.1.172:8080/video"  
                            alt="Camera Stream"
                        />
                </div>
           </div>
        </div>
    
       
        <div className="overflow-y-auto w-full  shadow-xl">
            <div className="relative px-10 w-full h-screen">
                <Outlet />
            </div>
        </div>
    </div>
    
</>)

}

export default Home;