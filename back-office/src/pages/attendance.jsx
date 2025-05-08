import { useEffect, useState } from "react";
import  {Axios} from  "../api/axios";
import DataTable from "react-data-table-component";
import ReactModal from 'react-modal';
import { base64StringToBlob } from "blob-util";

function Attendance(){
    const axios =  Axios()
    const [eventData, seteventData] = useState([])
    const [FilteredData , setFilteredData] = useState([])
    const [Prensent , setPrensent] = useState([])
    const [Absent , setAbsent] = useState([])
    const [PresenceState, setPresenceState] =  useState(false)
    const [modIsOpen, setmodIsOpen] = useState(false)
    const [TextSearch, setTextSearch] = useState("")
    const [CurrentEvent, setCurrentEvent] = useState("")
  

    const LoadImage = (Image) => {
        const converted_blob = base64StringToBlob(Image, "image/png");
        const blobUrl = URL.createObjectURL(converted_blob);
        return blobUrl  
    };

    const getEvent = async () => {
        let response = await axios.get('event')
        .then((response) => {
            seteventData(response.data)
            setFilteredData(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
           
        })
    }

    const getPresentMember = async (Id_envent, Name_event) => {
        let response = await axios.get(`event/${Id_envent}/MembersPresent`)
        .then((response) => {

            setPrensent(response.data)
            setCurrentEvent(Name_event)
       
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            OpenPresent() 
        })
    }

    const getAbsentMember = async (Id_envent, Name_event) => {
        let response = await axios.get(`event/${Id_envent}/MembersAbsent`)
        .then((response) => {

            setAbsent(response.data)
            setCurrentEvent(Name_event)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
            OpenAbsent()
        })
    }
       
    const OpenPresent = () => {
        setPresenceState(true)
        setmodIsOpen(true); 
    };

    const OpenAbsent = (id) => {
        setPresenceState(false)
        setmodIsOpen(true);
        
    };
    const CloseMod = () => {
        setmodIsOpen(false);
       
    };
   
    
    const HandleSearchInput = (e) => {
        setTextSearch(e.target.value)
    }
    const HandleSearch = () => { TextSearch === "" ? eventData :
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
   
    useEffect(() => {   
        getEvent()
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
            name: "Présents/Absents",
            cell: (row) => (
              <div className="flex items-center justify-center gap-2">
                    <button className="p-2 rounded-full " onClick={() => getPresentMember(row.id, row.Code_event+"/"+row.Name_event)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><g fill="none" stroke="green" strokeLinecap="round" strokeWidth={1.5}><path strokeLinejoin="round" d="m14 16l2.1 2.5l3.9-5"></path><path d="M21 6H3m18 4H3m7 4H3m7 4H3"></path></g></svg>
                    </button> 
                    <button className="p-2 rounded-full " onClick={() => getAbsentMember(row.id, row.Code_event+"/"+row.Name_event)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="red" fillRule="evenodd" d="M2.25 6A.75.75 0 0 1 3 5.25h18a.75.75 0 0 1 0 1.5H3A.75.75 0 0 1 2.25 6m0 4A.75.75 0 0 1 3 9.25h18a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75m12.22 2.97a.75.75 0 0 1 1.06 0l1.97 1.97l1.97-1.97a.75.75 0 1 1 1.06 1.06L18.56 16l1.97 1.97a.75.75 0 1 1-1.06 1.06l-1.97-1.97l-1.97 1.97a.75.75 0 1 1-1.06-1.06L16.44 16l-1.97-1.97a.75.75 0 0 1 0-1.06M2.25 14a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75m0 4a.75.75 0 0 1 .75-.75h8a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75" clipRule="evenodd"></path></svg>
                    </button>
              </div>
            ),
            
            
        },
        
    ]; 

   
    return(<>
        <div className="bg-white"> 
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

            <DataTable 
            columns={columns} 
            data={FilteredData} 
            title="Présence par évènement" 
            striped
            pagination 
            />

            <ReactModal
                    isOpen={modIsOpen}
                    onRequestClose={CloseMod}
                    contentLabel={PresenceState ? "Liste des membres présents:":"Liste des membres absents"}
                    className="absolute  z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-[80%] md:w-[40%] bg-white rounde-lg border-2 p-2 shadow-md overflow-x-auto."
                    ariaHideApp={false}>
                        <h2 className="text-lg font-semibold mb-4">{PresenceState ? "Liste des membres présents:":"Liste des membres absents:"}<span className="text-lg font-bold ml-2 text-blue-950">{PresenceState ? `${Prensent.length.toString()}`:`${Absent.length.toString()}`}</span></h2>

                        {PresenceState &&
                            <>
                             <div className="w-full flex justify-center">
                                <h1 className="font-semibold text-sm mb-4">{CurrentEvent}</h1>
                             </div>
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
                                    { Prensent.map((data) => 
                                    <>
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
                                    </>
                                    
                                    )}
                                </tbody>
                            </table>
                            </>
                            }
                            {!PresenceState &&
                            <>
                            <div className="w-full flex justify-center">
                                <h1 className="font-semibold text-sm mb-4">{CurrentEvent}</h1>
                            </div>
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
                                    { Absent.map((data) => 
                                    <>
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
                                    </>
                                    
                                    )}
                                </tbody>
                            </table>
                            </>
                            }
                            <br />
                            <div className="flex items-center gap-6 my-4">
                                <button className="bg-orange-400 p-2 rounded-md" type="button" onClick={CloseMod}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="white" d="m8.4 17l3.6-3.6l3.6 3.6l1.4-1.4l-3.6-3.6L17 8.4L15.6 7L12 10.6L8.4 7L7 8.4l3.6 3.6L7 15.6zm3.6 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"/></svg>
                                </button>
                            </div>
                        
            </ReactModal>
        </div>



        
    </>)
    
    }
    
export default Attendance;
