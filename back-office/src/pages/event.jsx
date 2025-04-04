import { useEffect, useState } from "react";
import  {Axios} from  "../api/axios";
import DataTable from "react-data-table-component";
import ReactModal from 'react-modal';
import { useAuthUser } from "react-auth-kit";
import { base64StringToBlob } from "blob-util";
import * as XLSX from 'xlsx';
function Event(){
    const axios =  Axios()
    const User = useAuthUser()
    const [eventData, seteventData] = useState([])
    const [FilteredData , setFilteredData] = useState([])
    const [modIsOpen, setmodIsOpen] = useState(false)
    const [addstate, setAddstate] = useState(false)
    const [GroupData, setGroupData] = useState([])
    const [Participants, setParticipants] = useState([])
    const [GroupMember, setGroupMember] = useState([])
    const [TextSearch, setTextSearch] = useState("")
    const [SecondModal, setSecondModal] =  useState(false)
    const [trigger, setTrigger] = useState(false)
    const [message, setMessage] = useState('')
    const [editEvent, setEditEvent] = useState({
        "Id_admin": null,
        "Code_event": "",
        "Name_event": "",
        "Theme": "",
        "Date": "",
        "Duration": "",
        "target_type": "all_members",
        "Id_group":null
    })
    const LoadImage = (Image) => {
                const converted_blob = base64StringToBlob(Image, "image/png");
                const blobUrl = URL.createObjectURL(converted_blob);
                return blobUrl  
            };

    const getEvent = async () => {
        let response = await axios.get('event')
        .then((response) => {

            console.log("event data:"+response.data)
            seteventData(response.data)
            setFilteredData(response.data)
            
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

            console.log("reponse:..."+response.data)
            setGroupData(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {      
        })

    }
    const ShowList = () => {
        setSecondModal(true); 
    }

    const GetGroupMember = async (Id_group,target_type) => {
        if(target_type === "all_members"){
            console.log(target_type)
            let response = await axios.get(`members`)
            .then((response) => {

                console.log("Membre-Groupe:11111"+response.data) 
                setParticipants(response.data) 
                
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() =>{
                console.log("partici"+Participants)
                ShowList()
                
            })
        }
        else{
            console.log(target_type)
            let response = await axios.get(`groups/${Id_group}/members`)
            .then((response) => {

                console.log("Membre-Groupe:222222"+response.data) 
                setParticipants(response.data) 
                
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() =>{
                console.log("particip..."+Participants)
                ShowList()
                
            })

        }
        
        
    }
    const GetGroupName = (Id_group) =>{
       let GpName =  GroupData.find((data) => data.id === Id_group)?.Name_group
       console.log(GpName)
       if (GpName == null) {
            return "Tous les membres"
       }
       else{ 
         return GpName
       }

    }
    const StartEvent = async (event_id) => {
        let response = await axios.post(`recognition/start_event/${event_id}`)
        .then((response) => {
            console.log(response.data)
            setMessage(`L'évènement [ ${eventData.filter((data) => data.id == event_id)?.[0]?.Name_event} ] est en cours...`)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
           
        })
    }
    const StopEvent = async (event_id) => {
        let response = await axios.post(`recognition/stop_event/${event_id}`)
        .then((response) => {
            console.log(response.data)
            setMessage(`L'évènement [ ${eventData.filter((data) => data.id == event_id)?.[0]?.Name_event} ] est arrêté`)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
           
        })
    }
    const OpenMod = (id) => {
        setmodIsOpen(true);
        setAddstate(false)
        console.log(id)
        setEditEvent(eventData.filter((data) => data.id === id)[0]);
       
    };
    const CloseMod = () => {
        setmodIsOpen(false);
        setEditEvent(null);
       
    };
    const CloseSecondModal = () => {
        setSecondModal(false);     
    };
    
    const handleAdd = () => {
        console.log("ireto : "+GroupData)
        setmodIsOpen(true);
        setAddstate(true);
        setEditEvent({
            "Id_admin": null,
            "Code_event": "",
            "Name_event": "",
            "Theme": "",
            "Date": "",
            "Duration": "",
            "target_type": "all_members",
            "Id_group": null
        })
    }
    const handleValueChange = (e) => {
        const { name, value } = e.target;
        setEditEvent((prev) => ({ ...prev, [name]: value })); 
        console.log(editEvent)
    };
    
    const HandleSearchInput = (e) => {
        setTextSearch(e.target.value)
    }
    const HandleSearch = () => { TextSearch === "" ? eventData :
        console.log(eventData)
        setFilteredData(eventData.filter((item) => {
            return (
              item.Id_admin && item.Id_admin.toString().toLowerCase().includes(TextSearch) ||
              item.Code_event && item.Code_event.toString().includes(TextSearch) || 
              item.Name_event && item.Name_event.toLowerCase().includes(TextSearch.toLowerCase()) ||
              item.Theme && item.Theme.toLowerCase().includes(TextSearch.toLowerCase()) ||
              item.Date && item.Date.toString().includes(TextSearch.toLowerCase()) ||
              item.Duration && item.Duration.toLowerCase().includes(TextSearch.toLowerCase())||
              item.target_type && item.target_type.toLowerCase().includes(TextSearch.toLowerCase())
            )
        }))
    }
    const handleSave = (e) => {
        e.preventDefault();
        let formData = new FormData()
        formData.append("Id_admin", User().Id)
        formData.append("Code_event", editEvent.Code_event)
        formData.append("Name_event", editEvent.Name_event)
        formData.append("Theme", editEvent.Theme)
        formData.append("Date", editEvent.Date)
        formData.append("Duration", editEvent.Duration.toString())
        formData.append("target_type", editEvent.target_type)
        if (editEvent.Id_group != null){
            formData.append("Id_group", editEvent.Id_group)
         }
        if(!addstate) {
          console.log(formData)
          console.log(editEvent)
          axios.put(`event/${editEvent.id}`, formData)
            .then(() => {
              alert('Modification effectuée');
              CloseMod();
              getEvent()
            })
            .catch((error) => {
              console.error("Error updating user", error);
            });
        }
        if(addstate){
            console.log(formData)
            axios.post('event', formData)
            .then(() => {
              alert('Ajout effectué');
              CloseMod();
              getEvent()
            })
            .catch((error) => {
              console.error("Error updating user", error);
            });
        }
    }
    const HandleDelete = async (id) => {
        const confirm = window.confirm(
            "Etes-vous vraiment sûr de vouloir supprimer?"
          );
        if(confirm){
            axios.delete(`event/${id}`) 
                .then(() => {
                alert('Item supprimé');
                getEvent()
                })
                .catch((error) => {
                console.error("Erreur pendant la suppression", error);
                });
        }

    }
    const exportToExcel = () => {
       
            const formattedData = FilteredData.map(row => ({
                "id": row.id,
                "Id admin": row.Id_admin,
                "Id groupe": row.Id_group,
                "Code évènement": row.Code_event,
                "Nom évènement": row.Name_event,
                "Thème": row.Theme,
                "Date": row.Date,
                "Duration": row.Duration,
                "Cible": row.target_type,
                
            }));
        
            const ws = XLSX.utils.json_to_sheet(formattedData);
    
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
            XLSX.writeFile(wb, 'Liste des Evènements.xlsx');
          };
    

    useEffect(() => {   
        getEvent()
        getGroup()
    },[])

    useEffect(() => {  
        if(TextSearch===""){
            setFilteredData(eventData)
        }
        else{
            HandleSearch()
        }
    },[TextSearch, eventData])

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Id admin",
            selector: (row) => row.Id_admin,
            sortable: true,
        },
        {
            name: "Code",
            selector: (row) => row.Code_event,
            sortable: true,
        },
        {
            name: "Nom",
            selector: (row) => row.Name_event,
            sortable: true,
        },
        {
            name: "Thème",
            selector: (row) => row.Theme,
            sortable: true,
        },
        {
            name: "Date",
            selector: (row) => row.Date,
            sortable: true,
        },
        {
            name: "Durée(en minute)",
            selector: (row) => row.Duration,
            sortable: true,
        },
        {
            name: "Cible",
            selector: (row) => row.target_type,
            sortable: true,
        },
        {
            name: "Nom du groupe",
            cell: (row) => (
              <div className="flex items-center justify-center gap-2">
                    <span>{GetGroupName(row.Id_group)}</span>
                    <button className="p-2 rounded-full " onClick={() => GetGroupMember(row.Id_group, row.target_type)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 1024 1024"><path fill="currentColor" d="M704 192h160v736H160V192h160v64h384zM288 512h448v-64H288zm0 256h448v-64H288zm96-576V96h256v96z"></path></svg>
                    </button> 
              </div>
            ),
            
            
        },
        {
            name: 'Actions',
            cell: (row) => (
              <div className="flex gap-2">
                <button className="p-2 rounded-full " onClick={() => StartEvent(row.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 16 16"><path fill="#16A34A" fillRule="evenodd" d="m4.25 3l1.166-.624l8 5.333v1.248l-8 5.334l-1.166-.624zm1.5 1.401v7.864l5.898-3.932z" clipRule="evenodd"></path></svg>
                </button>
                <button className="p-2 rounded-full " onClick={() => StopEvent(row.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 15 15"><path fill="none" stroke="currentColor" d="M11.5 3.5h-8v8h8z" strokeWidth={1}></path></svg>
                </button>
                <button className="p-2 rounded-full " onClick={() => OpenMod(row.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1rem" viewBox="0 0 24 24"><path fill="blue" d="m14.06 9.02l.92.92L5.92 19H5v-.92zM17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83l3.75 3.75l1.83-1.83a.996.996 0 0 0 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29m-3.6 3.19L3 17.25V21h3.75L17.81 9.94z"/></svg>
                </button>
                <button className="p-2 rounded-full" onClick={() => HandleDelete(row.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1rem" viewBox="0 0 24 24"><path fill="red" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                </button> 
              </div>
            ),        
        }
        
    ]; 

   
    return(<>
        <div>
            <div className="flex gap-4 ml-4 my-4">
                <button className=" flex items-center gap-2 w-auto p-2 bg-green-600 text-white rounded-md" onClick={handleAdd}>Créer un évenement
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="white" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"></path></svg>
                </button> 
                <button className=" flex items-center gap-2 w-auto p-2 bg-gray-900 text-white rounded-md" onClick={exportToExcel}>Exporter
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 12 12"><path fill="white" d="M10.5 4h-2C7.67 4 7 3.33 7 2.5v-2c0-.28-.22-.5-.5-.5H2c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h8c.55 0 1-.45 1-1V4.5c0-.28-.22-.5-.5-.5m-6 6h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-1c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h1c.28 0 .5.22.5.5s-.22.5-.5.5m4 4h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5m0-2h-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h2c.28 0 .5.22.5.5s-.22.5-.5.5M8 .5V2c0 .55.45 1 1 1h1.5c.45 0 .67-.54.35-.85l-2-2C8.54-.17 8 .06 8 .5"></path></svg>
                </button>
                  
            </div>
            
            <div className="relative max-w-md mx-auto">   
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Chercher...</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" value={TextSearch} className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200 " placeholder="Recherche par nom..." onChange={HandleSearchInput}  required />
                    <button type="button" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 " onClick={HandleSearch}>Chercher...</button>
                </div>
            </div>
            <div className="relative w-full h-4 justify-center font-semibold my-4 flex"><span>Statut:</span>&nbsp;<div className=" text-blue-950 font-semibold ">{message}</div></div>
            <DataTable 
            columns={columns} 
            data={FilteredData} 
            title="Evènements" 
            striped
            pagination 
            />

            <ReactModal
                    isOpen={modIsOpen}
                    onRequestClose={CloseMod}
                    contentLabel="Modifier un évenement"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-[80%] md:w-[40%] bg-white rounde-lg border-2 p-2 shadow-md"
                    ariaHideApp={false}>
                    <h2 className="text-lg font-semibold mb-4"> {addstate ? 'Ajouter':'Modifier'} </h2>
                    {editEvent && (
                    <div className="flex flex-col w-full justify-center items-center">
                        <form className="w-[80%]" onSubmit={handleSave}>
                            <div>
                                <label htmlFor="Code_event" className="block mb-2 text-sm font-medium text-gray-900">Code évenement:</label>
                                <input name="Code_event" id="Name" type="text" onChange={handleValueChange} value={editEvent.Code_event} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="Name_event" className="block mb-2 text-sm font-medium text-gray-900">Nom:</label>
                                <input  name="Name_event" id="Name_event" type="text" onChange={handleValueChange} value={editEvent.Name_event} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <div>
                                <label htmlFor="Theme" className="block mb-2 text-sm font-medium text-gray-900">Thème:</label>
                                <input name="Theme" id="Theme" type="text" onChange={handleValueChange} value={editEvent.Theme} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <div>
                                <label htmlFor="Date" className="block mb-2 text-sm font-medium text-gray-900">Date:</label>
                                <input name="Date" id="Date" type="date" onChange={handleValueChange} maxLength={10} value={editEvent.Date} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <div>
                                <label htmlFor="Duration" className="block mb-2 text-sm font-medium text-gray-900">Durée en minute:</label>   
                                <input name="Duration" id="Duration" type="number" onChange={handleValueChange}  value={editEvent.Duration} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <div>
                                <label htmlFor="target_type" className="block mb-2 text-sm font-medium text-gray-900">Cible:</label>
                                <select name="target_type" id="target_type" type="text" onChange={handleValueChange} defaultValue={editEvent.target_type} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required >
                                    <option value="all_members">Tous les membres</option>
                                    <option value="group">Groupe</option>
                                </select>
                            </div>
                            { editEvent.target_type == "group" &&
                                <div>
                                    <label htmlFor="Id_group" className="block mb-2 text-sm font-medium text-gray-900">Séléctionner un groupe:</label>
                                    <select name="Id_group" id="Id_group" type="text" onChange={handleValueChange} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Genre" required >
                                        {GroupData.map((option) => 
                                            <option value={option["id"]} >{option["Name_group"]}</option>
                                        )}
                                    </select>
                                </div>
                            }
                            
                            
                            
                            <br />
                            <div className="flex items-center gap-6 my-4">
                                <button  type="submit" className="p-2 bg-green-500 rounded-md" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="white" d="M5.133 18.02q-.406.163-.77-.066T4 17.288v-3.942L9.846 12L4 10.654V6.712q0-.438.364-.666t.77-.067l12.512 5.269q.49.225.49.756q0 .53-.49.748z"/></svg>
                                </button>
                                <button className="bg-orange-400 p-2 rounded-md" type="button" onClick={CloseMod}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="white" d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                    )}
            </ReactModal>
            <ReactModal
                isOpen={SecondModal}
                onRequestClose={CloseSecondModal}
                contentLabel="Participants"
                className="absolute overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-[80%] md:w-[40%] bg-white rounde-lg border-2 p-2 shadow-md"
                ariaHideApp={false}>
                    
                    <table className="table-auto w-full ">
                            <thead>
                                <tr>
                                <th className="border-2">Image</th>
                                <th className="border-2">Nom</th>
                                <th className="border-2">Prénoms</th>
                                <th className="border-2">Adresse</th>
                                <th className="border-2">Numéro</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {Participants.map((data) => 
                                    <tr key={data.id} className="shadow-md my-2 py-4">
                                        <td> 
                                            <div className="m-[0.2rem]">
                                                <img className="w-16 h-16 " src={LoadImage(data.Image)} />
                                            </div>
                                        </td>
                                        <td>{data.Name}</td>
                                        <td>{data.First_name}</td>
                                        <td>{data.Adress}</td>
                                        <td>{data.Phone}</td>
                                    </tr>
                                )}
                                
                            </tbody>
                    </table>
            </ReactModal>
        </div>



        
    </>)
    
    }
    
export default Event;