import {Axios} from "../api/axios"
import { useState , useEffect} from "react";
function Dashboard(){
    const [Event, setEvent] = useState([]);
    const [Admin, setAdmin] = useState([]);
    const [Groups, setGroups] = useState([]);
    const [Members, setMembers] = useState([]);
    const [Option, setOption] = useState({
        "Id_event": null,
        "nb_admin":null,
        "nb_admin_admin":null,
        "nb_admin_simple":null,
        "nb_event":null,
        "nb_group":null,
        "nb_member":null
   
    })
    const axios =  Axios()
    const getStatAdmin = async () =>{
        let response = await axios.get('Admin/signUp')
        .then((response) => {

            console.log(response.data)
            setAdmin(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
           
        })
    }
    const getMember = async () => {
        let response = await axios.get('members')
        .then((response) => {
            console.log("member"+response.data)
            setMembers(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
           
        })
    }
    const getRanking = async () => {
        let response = await axios.get('members/ranking')
        .then((response) => {
            console.log("rank"+response.data)
            setMembers(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
           
        })
    }
    const getGroup = async () => {
        let response = await axios.get('groups')
        .then((response) => {
            setGroups(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {      
    })}
    const getEvent = async () => {
        let response = await axios.get('event')
        .then((response) => {

            console.log("event data:"+response.data)
            setEvent(response.data)

            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
           
        })
    }
    const Stat = () => {
        let admin_admin = Admin.filter((data) => data.Permission == "admin")
        let admin_simple = Admin.filter((data) => data.Permission == "simple")
    
        console.log("Admin"+admin_admin)
        setOption((prev) => ({...prev, ["nb_admin"]:Admin.length.toString()}))
        setOption((prev) => ({...prev, ["nb_admin_admin"]:admin_admin.length}))
        setOption((prev) => ({...prev, ["nb_admin_simple"]:admin_simple.length}))
        setOption((prev) => ({...prev, ["nb_event"]:Event.length}))
        setOption((prev) => ({...prev, ["nb_group"]:Groups.length}))
        setOption((prev) => ({...prev, ["nb_member"]:Members.length}))
    }
    const handleValueChange = (e) => {
        const { name, value } = e.target;
        setOption((prev) => ({ ...prev, [name]: value })); 
        console.log(Option)
    };
    useEffect(() => {
        getEvent()
        getStatAdmin()
        getGroup()
        getMember()
    },[])
    useEffect(()=>{
        Stat()
    },[Admin, Groups, Event, Members])
    return(<>

        <div className="relative grid md:grid-cols-2 lg:grid-cols-4 w-full h-auto">
            <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center bg-gray-600 justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 640 512"><path fill="white" d="M144 0a80 80 0 1 1 0 160a80 80 0 1 1 0-160m368 0a80 80 0 1 1 0 160a80 80 0 1 1 0-160M0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96H21.3C9.6 320 0 310.4 0 298.7M405.3 320h-.7c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7c58.9 0 106.7 47.8 106.7 106.7c0 11.8-9.6 21.3-21.3 21.3H405.4zM224 224a96 96 0 1 1 192 0a96 96 0 1 1-192 0m-96 261.3c0-73.6 59.7-133.3 133.3-133.3h117.3c73.7 0 133.4 59.7 133.4 133.3c0 14.7-11.9 26.7-26.7 26.7H154.6c-14.7 0-26.7-11.9-26.7-26.7z"></path></svg>
                    <h1 className="text-md text-white font-semibold">Utilisateurs</h1>
                </div>
                <div className="flex flex-col items-start rounded-b-lg">
                    <div className="mx-auto"><span className="text-[8rem] font-bold">{Option.nb_admin}</span></div>
                    <div><span className="ml-4">Admin: <span className="text-xl font-mono font-bold">{Option.nb_admin_admin}</span></span></div>
                    <div><span className="ml-4">Utilisateurs simples: <span className="text-xl font-mono font-bold">{Option.nb_admin_simple}</span></span></div>
                </div>
            </div>

            <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center bg-gray-600 justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="white" d="M21 17V8H7v9zm0-14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V1h2v2h8V1h2v2zM3 21h14v2H3a2 2 0 0 1-2-2V9h2zm16-6h-4v-4h4z"></path></svg>
                    <h1 className="text-md font-semibold text-white">Evènements</h1>
                </div>
                <div className="flex flex-col items-start rounded-b-lg">
                    <div className="mx-auto"><span className="text-[8rem]  font-bold">{Option.nb_event}</span></div>
                </div>
                
            </div>
            <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center bg-gray-600 justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 16 16"><path fill="white" d="M5 16v-5.3c-.6-.3-1-1-1-1.7V5c0-.7.4-1.3 1-1.7V3c0-1.1-.9-2-2-2s-2 .9-2 2s.9 2 2 2H1c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1v5zM15 5h-2c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2v.3c.6.4 1 1 1 1.7v4c0 .7-.4 1.4-1 1.7V16h4v-5c.5 0 1-.5 1-1V6c0-.5-.5-1-1-1m-5-3a2 2 0 1 1-3.999.001A2 2 0 0 1 10 2"></path><path fill="white" d="M10 4H6c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1v6h4v-6c.5 0 1-.5 1-1V5c0-.5-.5-1-1-1"></path></svg>
                    <h1 className="text-md font-semibold text-white">Groupes</h1>
                </div>
                <div className="flex flex-col items-start rounded-b-lg">
                    <div className="mx-auto"><span className="text-[8rem]  font-bold">{Option.nb_group}</span></div>
                </div>
                
            </div>
            <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                <div className="flex flex-col items-center bg-gray-600 justify-center rounded-t-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="white" d="M3 3h18v13h-6.077v4.27L12 18.807l-2.923 1.461V16H3zm1 9.577h16v-2.154H4z"></path></svg>
                    <h1 className="text-md font-semibold text-white">Membres</h1>
                </div>
                <div className="flex flex-col items-start rounded-b-lg">
                    <div className="mx-auto"><span className="text-[8rem]  font-bold">{Option.nb_member}</span></div>
                </div>

            </div>
        </div>
        <div className="relative grid grid-cols-[60%_40%] w-full h-auto mt-10">
            <div className="w-full border-r-2 border-gray-400">
                <div className="flex flex-col w-96 gap-2 ">
                    <h1 className="ml-4 text-sm">Séléctionner un évènement pour afficher les statistiques correspondants:</h1>
                    <select name="Id_event" id="Id_event" type="text" onChange={handleValueChange} className=" border-2 border-teal-500 text-gray-900 text-sm rounded-lg w-full p-2.5 " required >
                        <option >Séléctionner un Evènement</option>
                        {Event.map((data) => 
                            <option value={data["id"]} >{data["Name_event"]}</option>
                        )}
                    </select>
                </div>
            </div>
            <div className="">
                second part
            </div>
        </div>
        
    </>)
    
    }
    
export default Dashboard;