import { useEffect, useState } from "react";
import  {Axios} from  "../api/axios";
import DataTable from "react-data-table-component";
import ReactModal from 'react-modal';
import { useAuthUser } from "react-auth-kit";
import { base64StringToBlob } from "blob-util";
import * as XLSX from 'xlsx';

function Group(){
    const axios =  Axios()
    const User = useAuthUser()
    const [GroupData, setGroupData] = useState([])
    const [GroupMembers, setGroupMembers] = useState([])
    const [GroupId, setGroupId] = useState([])
    const [modIsOpen, setmodIsOpen] = useState(false)
    const [SecondmodIsOpen, setSecondmodIsOpen] = useState(false)
    const [FilteredData , setFilteredData] = useState([])
    const [addstate, setAddstate] = useState(false)
    const [TextSearch, setTextSearch] = useState("")
    const [error_msg, setError_msg] = useState("")
    const [editGroup, seteditGroup] = useState({

        "Id_admin": null,
        "Name_group": "",
        "Fonction": ""
    })
   
    const LoadImage = (Image) => {
        const converted_blob = base64StringToBlob(Image, "image/png");
        const blobUrl = URL.createObjectURL(converted_blob);
        return blobUrl  
    };

    const getGroup = async () => {
        let response = await axios.get('groups')
        .then((response) => {

            setGroupData(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {      
    })}

    const getGroupMembers = async (id_group) => {
        let response = await axios.get(`groups/${id_group}/members`)
        .then((response) => {

            setGroupId(id_group)
            setGroupMembers(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => { 
            SecondModOpen()     
    })}

    const RemoveFromGroup = async (id_member, id_group) => {
        const confirm = window.confirm(
            "Etes-vous vraiment sûr de vouloir retirer cette personne du groupe ?"
          );
        if(confirm){
        let response = await axios.delete(`groups/${id_group}/members/${id_member}`)
        .then((response) => {
                getGroupMembers(id_group)
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {     
        }  
    )}
    }

    const OpenMod = (id) => {
        setmodIsOpen(true);
        setAddstate(false)
        seteditGroup(GroupData.filter((data) => data.id === id)[0]);
       
    };

    const SecondModOpen = () =>  {
        setSecondmodIsOpen(true);
    };

    const CloseSecondMod = () => {
        setSecondmodIsOpen(false);
    };

    const CloseMod = () => {
        setmodIsOpen(false);
        seteditGroup(null);
       
    };
    const handleAdd = () => {
        setmodIsOpen(true);
        setAddstate(true);
        seteditGroup({
            "Id_admin": null,
            "Name_group": "",
            "Fonction": ""
        })
    }
    const HandleSearch = () => { TextSearch === "" ? GroupData :
        setFilteredData(GroupData.filter((item) => {
            return (
              item.Id_admin && item.Id_admin.toString().includes(TextSearch) || 
              item.Name_group && item.Name_group.toLowerCase().includes(TextSearch.toLowerCase()) || 
              item.Fonction && item.Fonction.toLowerCase().includes(TextSearch.toLowerCase()) 
            )
        }))
    }
    const HandleSearchInput = (e) => {
        setTextSearch(e.target.value)
    }
    const handleValueChange = (e) => {
        const { name, value } = e.target;
        seteditGroup((prev) => ({ ...prev, [name]: value })); 
    };


    const handleSave = (e) => {
        e.preventDefault();
        let formData = new FormData()
        formData.append("Id_admin", User().Id)
        formData.append("Name_group", editGroup.Name_group)
        formData.append("Fonction", editGroup.Fonction)
 
        if(!addstate) {
          axios.put(`groups/${editGroup.id}`, formData)
            .then(() => {
              alert('Modification effectuée');
              CloseMod();
              getGroup()
            })
            .catch((error) => {
              console.error("Error updating user", error);
            });
        }
        if(addstate){
            axios.post(`groups/`, formData)
            .then(() => {
              alert('Ajout effectuée');
              CloseMod();
              getGroup()
            })
            .catch((error) => {
              console.error("Error updating user", error);
            });
        }
        else{
            setError_msg("Erreur lors de la confirmation du mot de passe")
        }
    }
    const HandleDelete = async (id) => {
        const confirm = window.confirm(
            "Etes-vous vraiment sûr de vouloir supprimer?"
          );
        if(confirm){
            axios.delete(`groups/${id}`)
                .then(() => {
                alert('Item supprimé');
                getGroup()
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
                    "Nom du groupe": row.Name_group,
                    "Fonction": row.Fonction
                    
                }));
            
                const ws = XLSX.utils.json_to_sheet(formattedData);
        
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Data');
        
                XLSX.writeFile(wb, 'Liste des Groupes.xlsx');
              };

    useEffect(() => {   
        getGroup()
    },[])

    useEffect(() => {  
        if(TextSearch===""){
            setFilteredData(GroupData)
        }
        else{
            HandleSearch()
        }
    },[TextSearch, GroupData])

    const columns = [
        {
            name: "ID du groupe",
            selector: (row) => row.id,
        },
        {
            name: "Id utilisateur",
            selector: (row) => row.Id_admin,
        },
        {
            name: "Nom du groupe",
            selector: (row) => row.Name_group,
        },
        {
            name: "Fonction",
            selector: (row) => row.Fonction,
        },
       
        {
            name: 'Actions',
            cell: (row) => (
              <div className="flex items-center gap-2">
                <div className="text-xs text-blue-600 "><button onClick={() => getGroupMembers(row.id)} className="hover:underline hover:underline-offset-2">Voir membres</button></div>
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
        <div className="bg-white">
            <div className="flex gap-4 ml-4 my-4">
                <button className=" flex items-center gap-2 w-auto p-2 bg-blue-600 text-white rounded-md" onClick={handleAdd}>Ajouter un groupe
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
            <DataTable 
            columns={columns} 
            data={FilteredData} 
            title="Groupes"
            striped
            pagination 
            />

            <ReactModal
                    isOpen={modIsOpen}
                    onRequestClose={CloseMod}
                    contentLabel="Modifier un groupe"
                    className="absolute  z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-[80%] md:w-[40%] bg-white rounde-lg border-2 p-2 shadow-md"
                    ariaHideApp={false}>
                    <h2 className="text-lg font-semibold mb-4"> {addstate ? 'Ajouter':'Modifier'} </h2>
                    {editGroup && (
                    <div className="flex flex-col w-full justify-center items-center">
                        <form className="w-[80%]" onSubmit={handleSave}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Nom du groupe:</label>
                                <input name="Name_group" type="text" onChange={handleValueChange} value={editGroup.Name_group} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <br />
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Fonction:</label>
                                <textarea  name="Fonction"  onChange={handleValueChange} value={editGroup.Fonction} className=" border border-gray-300 h-48 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required />
                            </div>
                          
                            
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
                    isOpen={SecondmodIsOpen}
                    onRequestClose={CloseSecondMod}
                    contentLabel="Modifier un groupe"
                    className="absolute  z-50 overflow-y-auto  top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[50%] w-[80%] md:w-[50%] bg-white rounde-lg border-2 p-2 shadow-md"
                    ariaHideApp={false}>
                    <h2 className="text-lg font-semibold mb-4">Liste des membres:<span className="font-bold text-xl ml-4">{GroupMembers.length.toString()}</span></h2>
                    {GroupMembers &&
                        <table className="table-auto w-full ">
                            <thead>
                                <tr>
                                <th className="border-2">Image</th>
                                <th className="border-2">Nom</th>
                                <th className="border-2">Prénoms</th>
                                <th className="border-2">Adresse</th>
                                <th className="border-2">Numéro</th>
                                <th className="border-2">Retirer</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {GroupMembers.map((data) => 
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
                                        <td>
                                            <button onClick={() => RemoveFromGroup(data.id, GroupId)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 1024 1024"><path fill="red" d="M512 64a448 448 0 1 1 0 896a448 448 0 0 1 0-896M288 512a38.4 38.4 0 0 0 38.4 38.4h371.2a38.4 38.4 0 0 0 0-76.8H326.4A38.4 38.4 0 0 0 288 512"></path></svg>
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                
                            </tbody>
                        </table>
                    }
                    
            </ReactModal>
        </div>



        
    </>)
    
    }
    
export default Group;
