import {Axios} from "../api/axios"
import { useState , useEffect} from "react";
import { base64StringToBlob } from "blob-util";
import * as XLSX from 'xlsx';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard(){
    const [Event, setEvent] = useState([]);
    const [Admin, setAdmin] = useState([]);
    const [Groups, setGroups] = useState([]);
    const [Members, setMembers] = useState([]);
    const [Rank, setRank] = useState([]);
    const [Present, setPresent] = useState([]);
    const [Absent, setAbsent ] = useState([]);
    const [check, setcheck ] = useState(null);
    const [Participants, setParticipants ] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [EventProp, setEventProp] = useState({
        "nb_male":0,
        "nb_female":0,
        "nb_present":0,
        "nb_absent":0
    }) 

    const [Option, setOption] = useState({
        "nb_admin":null,
        "nb_admin_admin":null,
        "nb_admin_simple":null,
        "nb_event":null,
        "nb_group":null,
        "nb_member":null 
   
    })
    const axios =  Axios()
    const LoadImage = (Image) => {
        const converted_blob = base64StringToBlob(Image, "image/png");
        const blobUrl = URL.createObjectURL(converted_blob);
        return blobUrl  
    };
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
            setRank(response.data)
            
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
    const getPresentMember = async (id_envent) => {
        let response = await axios.get(`event/${id_envent}/MembersPresent`)
        .then((response) => {

            console.log("present data:"+response.data)
            setPresent(response.data)
       
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
          
        })
    }

    const getAbsentMember = async (id_envent) => {
        let response = await axios.get(`event/${id_envent}/MembersAbsent`)
        .then((response) => {

            console.log("event data:"+response.data)
            setAbsent(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
    
        })
    }
    const GetGroupMember = async (Id_group = Event.filter((data) => data.id == selectedEvent)[0].Id_group,target_type = Event.filter((data) => data.id == selectedEvent)[0].target_type) => {
        console.log("ito target"+target_type)
        if(target_type === "all_members"){
            console.log(target_type)
            let response = await axios.get(`members`)
            .then((response) => {

                setParticipants(response.data) 
                
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() =>{
                
            })
        }
        else{
            console.log(target_type)
            let response = await axios.get(`groups/${Id_group}/members`)
            .then((response) => {
                setParticipants(response.data) 
                
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() =>{
                
            })

        }
        
        
    }
    const AllStat = () =>{
        setEventProp((prev) => ({...prev, ["nb_male"]: Participants.filter((data) => data.Gender == "male").length}))
        setEventProp((prev) => ({...prev, ["nb_female"]: Participants.filter((data) => data.Gender == "female").length}))
        setEventProp((prev) => ({...prev, ["nb_present"]: Present.length}))
        setEventProp((prev) => ({...prev, ["nb_absent"]: Absent.length}))
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
        setSelectedEvent(e.target.value)
        setcheck(1)
    };
    const Ddata = {
        labels: ['Présent', 'Absent'],
        datasets: [
          {
            label: 'Nombre',
            data: [EventProp.nb_present, EventProp.nb_absent],
            backgroundColor: [
              '#16C47F',
              '#EFB036',
            ],
          },
        ],
      };
    const Ddata2 = {
        labels: ['Homme', 'Femme'],
        datasets: [
          {
            label: 'Nombre',
            data: [EventProp.nb_male, EventProp.nb_female],
            backgroundColor: [
              '#3674B5',
              '#DE3163',
            ],
          },
        ],
      };

    const exportToExcel = () => {
               
                    const formattedData = Rank.map((row, index) => ({
                        "Rang":index+1,
                        "Id": row.id,
                        "Nom": row.Name,
                        "Prénoms": row.First_name,
                        "Adresse": row.Adress,
                        "Sexe":  row.Gender,
                        "Téléphone": row.Phone,
                        "Score": row.Score
                        
                    }));
                
                    const ws = XLSX.utils.json_to_sheet(formattedData);
            
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'Data');
            
                    XLSX.writeFile(wb, 'Classements.xlsx');
                  };
   
    useEffect(() => {
        getEvent()
        getStatAdmin()
        getGroup()
        getMember()
        getRanking()
    },[])
    useEffect(()=>{
        Stat()
    },[Admin, Groups, Event, Members])

    useEffect(() =>{
    console.log(selectedEvent)
    if(check != null){
      GetGroupMember()
    }
    },[selectedEvent])

    useEffect(() => {
        if(selectedEvent != null){
            getPresentMember(selectedEvent)
            getAbsentMember(selectedEvent)
        }
    }, [Participants])

    useEffect(() => {
        AllStat()
        console.log(EventProp)
    }, [Present, Absent])
    
    
 
    
    return(<>
        <div className="bg-white">
            <div className="relative grid md:grid-cols-2 lg:grid-cols-4 w-full h-auto bg-white">
                <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                    <div className="flex flex-col items-center bg-gray-600 justify-center rounded-t-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 640 512"><path fill="white" d="M144 0a80 80 0 1 1 0 160a80 80 0 1 1 0-160m368 0a80 80 0 1 1 0 160a80 80 0 1 1 0-160M0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96H21.3C9.6 320 0 310.4 0 298.7M405.3 320h-.7c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7c58.9 0 106.7 47.8 106.7 106.7c0 11.8-9.6 21.3-21.3 21.3H405.4zM224 224a96 96 0 1 1 192 0a96 96 0 1 1-192 0m-96 261.3c0-73.6 59.7-133.3 133.3-133.3h117.3c73.7 0 133.4 59.7 133.4 133.3c0 14.7-11.9 26.7-26.7 26.7H154.6c-14.7 0-26.7-11.9-26.7-26.7z"></path></svg>
                        <h1 className="text-md text-white font-semibold">Utilisateurs</h1>
                    </div>
                    <div className="flex flex-col items-start rounded-b-lg">
                        <div className="mx-auto"><span className="text-[6rem] font-bold">{Option.nb_admin}</span></div>
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
                        <div className="mx-auto"><span className="text-[6rem]  font-bold">{Option.nb_event}</span></div>
                    </div>
                    
                </div>
                <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                    <div className="flex flex-col items-center bg-gray-600 justify-center rounded-t-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 16 16"><path fill="white" d="M5 16v-5.3c-.6-.3-1-1-1-1.7V5c0-.7.4-1.3 1-1.7V3c0-1.1-.9-2-2-2s-2 .9-2 2s.9 2 2 2H1c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1v5zM15 5h-2c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2v.3c.6.4 1 1 1 1.7v4c0 .7-.4 1.4-1 1.7V16h4v-5c.5 0 1-.5 1-1V6c0-.5-.5-1-1-1m-5-3a2 2 0 1 1-3.999.001A2 2 0 0 1 10 2"></path><path fill="white" d="M10 4H6c-.5 0-1 .5-1 1v4c0 .5.5 1 1 1v6h4v-6c.5 0 1-.5 1-1V5c0-.5-.5-1-1-1"></path></svg>
                        <h1 className="text-md font-semibold text-white">Groupes</h1>
                    </div>
                    <div className="flex flex-col items-start rounded-b-lg">
                        <div className="mx-auto"><span className="text-[6rem]  font-bold">{Option.nb_group}</span></div>
                    </div>
                    
                </div>
                <div className=" m-4  shadow-md border-2 rounded-lg bg-gray-100">
                    <div className="flex flex-col items-center bg-gray-600 justify-center rounded-t-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24"><path fill="white" d="M3 3h18v13h-6.077v4.27L12 18.807l-2.923 1.461V16H3zm1 9.577h16v-2.154H4z"></path></svg>
                        <h1 className="text-md font-semibold text-white">Membres</h1>
                    </div>
                    <div className="flex flex-col items-start rounded-b-lg">
                        <div className="mx-auto"><span className="text-[6rem]  font-bold">{Option.nb_member}</span></div>
                    </div>

                </div>
            </div>
            <div className="relative grid grid-cols-1 lg:grid-cols-[50%_50%] w-full h-auto mt-10">
                <div className="w-full lg:border-r-2 lg:border-gray-400">
                    <div className="flex flex-col w-full md:w-96 gap-2 ">
                        <h1 className="ml-4 text-sm">Séléctionner un évènement pour afficher les statistiques correspondants:</h1>
                        <select name="Id_event" id="Id_event" type="text" onChange={handleValueChange} className=" border-2 border-teal-500 text-gray-900 text-sm rounded-lg w-full p-2.5 " required >
                            <option >Séléctionner un Evènement</option>
                            {Event.map((data) => 
                                <option value={data["id"]} >{data["Name_event"]}</option>
                            )}
                        </select>
                    </div>
                    <div className="w-full mt-10 grid grid-cols-1 sm:grid-cols-[50%_50%]">
                        <div className="flex flex-col items-center p-6">
                            <h1 className="text-sm">Taux de présence de cet évènement: {((Present.length*100)/(Present?.length+Absent?.length))}%</h1>
                            <Doughnut data={Ddata} />
                        </div>
                        <div className="flex flex-col items-center p-6">
                            <h1 className="text-sm">Classement par sexe des membres de cet évènement:</h1>
                            <Doughnut data={Ddata2} />
                        </div>
                    
                    </div>
                </div>
                <div className="flex flex-col mt-10 lg:mt-0 lg:p-4 h-full">
                    <button className=" flex items-center gap-2 w-28 p-2 bg-gray-900 text-white rounded-md" onClick={exportToExcel}>Exporter
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 12 12"><path fill="white" d="M10.5 4h-2C7.67 4 7 3.33 7 2.5v-2c0-.28-.22-.5-.5-.5H2c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V4.5c0-.28-.22-.5-.5-.5m-6 6h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m4 4h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5M8 .5V2c0 .55.45 1 1 1h1.5c.45 0 .67-.54.35-.85l-2-2C8.54-.17 8 .06 8 .5"></path></svg>
                    </button>
                    <h1 className="flex items-center gap-2 mx-auto font-sans font-semibold text-lg text-gray-800 mb-8">Classement par assiduité des membres <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><path fill="#000" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2M9 4h2v5l-1-.75L9 9zm9 16H6V4h1v9l3-2.25L13 13V4h5z"></path></svg></h1>
                        <div className="h-[60%] overflow-y-auto">
                            <table className="table-auto w-full ">
                                <thead className="">
                                    <tr>
                                    <th className=""></th>
                                    <th className="border-[1px]">Image</th>
                                    <th className="border-[1px]">Nom</th>
                                    <th className="border-[1px]">Prénoms</th>
                                    <th className="border-[1px]">Adresse</th>
                                    <th className="border-[1px]">Numéro</th>
                                    <th className="border-[1px]">Sexe</th>
                                    <th className="border-[1px]">Score</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {Rank.map((data, index) => 
                                            <tr key={data.id} className="shadow-md my-2 py-4">
                                                <td className="p-4 text-lg font-semibold">{index + 1}</td>
                                                <td className="flex justify-center"> 
                                                    <div className="m-[0.2rem]">
                                                        <img className="w-10 h-10 lg:w-16 lg:h-16 " src={LoadImage(data.Image)} />
                                                    </div>
                                                </td>
                                                <td>{data.Name}</td>
                                                <td>{data.First_name}</td>
                                                <td>{data.Adress}</td>
                                                <td>{data.Phone}</td>
                                                <td>{data.Gender}</td>
                                                <td>{data.Score.toString()}</td>
                                            </tr>
                                    
                                    
                                        
                                    )}
                                    
                                </tbody>
                            </table>
                        </div>
                </div>
            </div>
        </div>
        
    </>)
    
    }
    
export default Dashboard;