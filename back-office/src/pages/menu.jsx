
import { NavLink, Outlet } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Dashboard from "../assets/Animation - 1735301028194.json";
import AttendanceLottie from "../assets/checkList.json";
import EventLottie from "../assets/event.json";
import MembersLottie from "../assets/member.json";
import AccountLottie from "../assets/user.json";
import GroupLottie from "../assets/groups.json";
function Event(){
    return(<>
    
        <div className="w-full h-full">
            <div className="grid flex flex-col lg:grid-cols-4 lg:grid-rows-2 w-full h-auto  p-10 gap-4">
                <div className="w-full h-auto rounded-2xl flex flex-col items-center border-2 border-teal-200 shadow-gray-300 shadow-xl">
                    <div className="w-52">
                        <Player src={Dashboard} className="player " loop autoplay />
                    </div>
                    <h1 className="font-semibold my-2 text-lg text-blue-500">Dashboard</h1>
                    <p className="text-sm px-4 py-2 flex justify-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores quibusdam culpa perferendis minus, blanditiis sunt debitis alias corporis vel odit ipsam quia modi ex eum possimus aut optio, quas numquam.</p>
                    <div className="flex w-full justify-center">
                        <NavLink to="dashboard" className="mt-4 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="white" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z"/></g></svg>
                        </NavLink>
                    </div>
                </div>
                <div className="w-full h-full rounded-2xl flex flex-col items-center border-2 border-teal-200 shadow-gray-300 shadow-xl">
                    <div className="w-28 mt-2">
                        <Player src={AttendanceLottie} className="player " loop autoplay />
                    </div>
                    <h1 className="font-semibold my-2 text-lg text-blue-500">Attendance</h1>
                    <p className="text-sm px-4 py-2 flex justify-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores quibusdam culpa perferendis minus, blanditiis sunt debitis alias corporis vel odit ipsam quia modi ex eum possimus aut optio, quas numquam.</p>
                    <NavLink to="attendance" className="mt-4 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="white" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z"/></g></svg>
                    </NavLink>
                </div>
                <div className="w-full h-full rounded-2xl flex flex-col items-center border-2 border-teal-200 shadow-gray-300 shadow-xl">
                    <div className="w-28">
                        <Player src={EventLottie} className="player " loop autoplay />
                    </div>
                    <h1 className="font-semibold my-2 text-lg text-blue-500">Events</h1>
                    <p className="text-sm px-4 py-2 flex justify-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores quibusdam culpa perferendis minus, blanditiis sunt debitis alias corporis vel odit ipsam quia modi ex eum possimus aut optio, quas numquam.</p>
                    <NavLink to="event" className="mt-4 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="white" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z"/></g></svg>
                    </NavLink>
                </div>
                <div className="w-full h-full rounded-2xl flex flex-col items-center border-2 border-teal-200 shadow-gray-300 shadow-xl">
                    <div className="w-32">
                        <Player src={GroupLottie} className="player " loop autoplay />
                    </div>
                    <h1 className="font-semibold my-2 text-lg text-blue-500">Groups</h1>
                    <p className="text-sm px-4 py-2 flex justify-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores quibusdam culpa perferendis minus, blanditiis sunt debitis alias corporis vel odit ipsam quia modi ex eum possimus aut optio, quas numquam.</p>
                    <NavLink to="group"  className="mt-4 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="white" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z"/></g></svg>
                    </NavLink>
                </div>
                <div className="w-full h-full rounded-2xl flex flex-col items-center border-2 border-teal-200 shadow-gray-300 shadow-xl">
                    <div className="w-52">
                        <Player src={MembersLottie} className="player " loop autoplay />
                    </div>
                    <h1 className="font-semibold my-2 text-lg text-blue-500">Members</h1>
                    <p className="text-sm px-4 py-2 flex justify-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores quibusdam culpa perferendis minus, blanditiis sunt debitis alias corporis vel odit ipsam quia modi ex eum possimus aut optio, quas numquam.</p>
                    <NavLink to="member" className="mt-4 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="white" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z"/></g></svg>
                    </NavLink>
                </div>
                <div className="w-full h-full rounded-2xl flex flex-col items-center border-2 border-teal-200 shadow-gray-300 shadow-xl">
                    <div className="w-48">
                        <Player src={AccountLottie} className="player " loop autoplay />
                    </div>
                    <h1 className="font-semibold my-2 text-lg text-blue-500">Accounts</h1>
                    <p className="text-sm px-4 py-2 flex justify-center">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Asperiores quibusdam culpa perferendis minus, blanditiis sunt debitis alias corporis vel odit ipsam quia modi ex eum possimus aut optio, quas numquam.</p>
                    <NavLink to="user" className="mt-4 w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="white" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z"/></g></svg>
                    </NavLink>
                </div>
            </div>
        </div>
        
    </>)
    
    }
    
export default Event;