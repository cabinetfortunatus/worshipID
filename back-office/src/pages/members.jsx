import { useEffect, useState } from "react";
import  {Axios} from  "../api/axios";
import DataTable from "react-data-table-component";
import ReactModal from 'react-modal';
import { useAuthUser } from "react-auth-kit";
import { base64StringToBlob } from "blob-util";
import * as XLSX from 'xlsx';

function Member(){
    const axios =  Axios()
    const User = useAuthUser()
    const [memberData, setmemberData] = useState([])
    const [AccountInfo, setAccountInfo] = useState([])
    const [FilteredData , setFilteredData] = useState([])
    const [GroupList, setGroupList] = useState([])
    const [modIsOpen, setmodIsOpen] = useState(false)
    const [AddToAGroup, setAddToAGroup] = useState(false)
    const [addstate, setAddstate] = useState(false)
    const [ImageFile, setImageFile] = useState(null)
    const [TextSearch, setTextSearch] = useState("")
    const [editMember, seteditMember] = useState({
        "id":"",
        "Name":"",
        "First_name":"",
        "Adress":"",
        "Gender":"",
        "Phone":"",
        "Image":"",
        "group_id":null
    })
    const LoadImage = (Image) => {
              const converted_blob = base64StringToBlob(Image, "image/png");
              const blobUrl = URL.createObjectURL(converted_blob);
              return blobUrl  
          };
    const getMember = async () => {
        let response = await axios.get('members')
        .then((response) => {

            console.log(response.data)
            setmemberData(response.data)
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
            setGroupList(response.data)
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {      
        })

    }
    const Check  = () => {
        setAddToAGroup(!AddToAGroup)
    }
    const OpenMod = (id) => {
        setmodIsOpen(true);
        setAddstate(false)
        console.log(id)
        seteditMember(memberData.filter((data) => data.id === id)[0]);
       
    };
    const CloseMod = () => {
        setmodIsOpen(false);
        seteditMember(null);
       
    };
    const handleAdd = () => {
        setmodIsOpen(true);
        setAddstate(true);
        seteditMember({
            "id":"",
            "Name":"",
            "First_name":"",
            "Adress":"",
            "Gender":"",
            "Phone":"",
            "Image":"",
            "group_id":null
        })
    }
    const handleValueChange = (e) => {
        const { name, value } = e.target;
        seteditMember((prev) => ({ ...prev, [name]: value })); 
        console.log(editMember)
    };
    
    const handleImageFile = (e) => {
        setImageFile(e.target.files[0])
    }
    const HandleSearchInput = (e) => {
        setTextSearch(e.target.value)
    }
    const HandleSearch = () => { TextSearch === "" ? memberData :
        console.log(memberData)
        setFilteredData(memberData.filter((item) => {
            return (
              item.Name && item.Name.toLowerCase().includes(TextSearch.toLowerCase()) ||
              item.id && item.id.toString().includes(TextSearch) || 
              item.First_name && item.First_name.toLowerCase().includes(TextSearch.toLowerCase()) ||
              item.Gender && item.Gender.toLowerCase().includes(TextSearch.toLowerCase()) ||
              item.Adress && item.Adress.toLowerCase().includes(TextSearch.toLowerCase()) ||
              item.Phone && item.Phone.toLowerCase().includes(TextSearch.toLowerCase())
            )
        }))
    }
    const handleSave = (e) => {
        e.preventDefault();
        let formData = new FormData()
        formData.append("Name", editMember.Name)
        formData.append("First_name", editMember.First_name)
        formData.append("Adress", editMember.Adress)
        formData.append("Gender", editMember.Gender)
        formData.append("Phone", editMember.Phone)
        if(editMember.group_id != null ){
            formData.append("group_id", editMember.group_id)
         }
        if(ImageFile != null)
            formData.append("Image", ImageFile)
        
        if(!addstate) {
          console.log(formData)
          console.log(editMember)
          axios.put(`members/${editMember.id}`, formData)
            .then(() => {
              alert('Modification effectuée');
              CloseMod();
              getMember()
            })
            .catch((error) => {
              console.error("Error updating user", error);
            });
        }
        if(addstate){
            console.log(formData)
            axios.post(`members`, formData)
            .then(() => {
              alert('Ajout effectuée');
              CloseMod();
              getMember()
            })
            .catch((error) => {
              console.error("Error updating user", error);
            });
        }
    }
    const CreateAccount =  (id_member) =>{
        const confirm = window.confirm(
            "Voulez-vous créer un compte pour ce profil?"
          );
        let AccountData = memberData.find((data) => data.id === id_member)
        let formData = new FormData()
       
        formData.append("id_admin", User().Id)
        formData.append("id_member", id_member)
        formData.append("Username", AccountData.First_name+id_member)
        formData.append("Password", AccountData.First_name+id_member+2025)

        if(confirm){
          axios.post(`users/signUp`, formData)
            .then(() => {
             
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
            axios.delete(`members/${id}`) 
                .then(() => {
                alert('Item supprimé');
                getMember()
                })
                .catch((error) => {
                console.error("Erreur pendant la suppression", error);
                });
        }

    }
    const exportToExcel = () => {
   
        const formattedData = FilteredData.map(row => ({
            "Id": row.id,
            "Nom":row.Name,
            "Prénoms":row.First_name,
            "Adresse": row.Adress,
            "Sexe": row.Gender,
            "Téléphone": row.Phone,
        }));
    
        const ws = XLSX.utils.json_to_sheet(formattedData);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Data');

        XLSX.writeFile(wb, 'Liste des Membres.xlsx');
      };

    useEffect(() => {   
        getMember()
        getGroup()
    },[])

    useEffect(() => {  
        if(TextSearch===""){
            setFilteredData(memberData)
        }
        else{
            HandleSearch()
        }
    },[TextSearch, memberData])

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: "Images",
            cell: (row) => (
                <div className="m-[0.2rem]">
                    <img className="w-16 h-16 " src={LoadImage(row.Image)} />
                </div>
              ),
            sortable: true,
        },
        {
            name: "Nom",
            selector: (row) => row.Name,
            sortable: true,
        },
        {
            name: "Prénoms",
            selector: (row) => row.First_name,
            sortable: true,
        },
        {
            name: "Adresse",
            selector: (row) => row.Adress,
            sortable: true,
        },
        {
            name: "Genre",
            selector: (row) => row.Gender,
            sortable: true,
        },
        {
            name: "Phone",
            selector: (row) => row.Phone,
            sortable: true,
        },
       
        {
            name: 'Actions',
            cell: (row) => (
              <div className="flex gap-2">
                <button className="p-2 rounded-full " onClick={() => CreateAccount(row.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem"  viewBox="0 0 24 24"><path fill="green" d="M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4"></path></svg>
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
                <button className=" flex items-center gap-2 w-auto p-2 bg-green-600 text-white rounded-md" onClick={handleAdd}>Ajouter un membre
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
                title="Membres" 
                striped
                pagination 
                />

            <ReactModal
                    isOpen={modIsOpen}
                    onRequestClose={CloseMod}
                    contentLabel="Modifier un utilisateur"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-[80%] md:w-[40%] bg-white rounde-lg border-2 p-2 shadow-md"
                    ariaHideApp={false}>
                    <h2 className="text-lg font-semibold mb-4"> {addstate ? 'Ajouter':'Modifier'} </h2>
                    {editMember && (
                    <div className="flex flex-col w-full justify-center items-center">
                        <form className="w-[80%]" onSubmit={handleSave}>
                            <div>
                                <label htmlFor="Name" className="block mb-2 text-sm font-medium text-gray-900">Nom:</label>
                                <input name="Name" id="Name" type="text" onChange={handleValueChange} value={editMember.Name} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <br />
                            <div>
                                <label htmlFor="First_name" className="block mb-2 text-sm font-medium text-gray-900">Prénoms:</label>
                                <input  name="First_name" id="First_name" type="text" onChange={handleValueChange} value={editMember.First_name} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <div>
                                <label htmlFor="Adresse" className="block mb-2 text-sm font-medium text-gray-900">Adresse:</label>
                                <input name="Adress" id="Adresse" type="text" onChange={handleValueChange} value={editMember.Adress} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <div>
                                <label htmlFor="Gender" className="block mb-2 text-sm font-medium text-gray-900">Genre:</label>
                                <select name="Gender" id="Gender" type="text" onChange={handleValueChange} value={editMember.Gender} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required >
                                    <option value="male">Male</option>
                                    <option value="female">Femelle</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="Phone" className="block mb-2 text-sm font-medium text-gray-900">Numéro de téléphone:</label>
                                <input name="Phone" id="Phone" type="number" onChange={handleValueChange} maxLength={10} value={editMember.Phone} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "  required />
                            </div>
                            <div className="flex gap-2 items-center my-4">
                                <span>Ajouter à un groupe:</span>
                                <button onClick={Check} type="button"><svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 20 20"><path fill="blue" d="M11 9V5H9v4H5v2h4v4h2v-4h4V9zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20"></path></svg></button>
                            </div>
                            {AddToAGroup &&
                                <div>
                                        <label htmlFor="group_id" className="block mb-2 text-sm font-medium text-gray-900">Séléctionner un groupe:</label>
                                        <select name="group_id" id="group_id" type="text" onChange={handleValueChange} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required >
                                            <option >Séléctionner un groupe</option>
                                            {GroupList.map((option) => 
                                                <option value={option["id"]} >{option["Name_group"]}</option>
                                            )}
                                        </select>
                                </div>
                            } 
                            <div>
                                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900">Image:</label>   
                                <input onChange={handleImageFile} type="file"  />
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
        </div>  
    </>)
    
    }
    
export default Member;