import { useEffect, useState } from "react";
import  {Axios} from  "../api/axios";
import DataTable from "react-data-table-component";
import ReactModal from 'react-modal';
import  User from '../assets/images/user.png';
import { base64StringToBlob } from "blob-util";

function Admin(){
    const axios =  Axios()
    const [userData, setUserData] = useState([])
    const [modIsOpen, setmodIsOpen] = useState(false)
    const [addstate, setAddstate] = useState(false)
    const [ImageFile, setImageFile] = useState(null)
    const [error_msg, setError_msg] = useState("")
    const [editUser, seteditUser] = useState({
        "Username":"",
        "Password":"",
        "Permission":"",
        "new_password":"",
        "confirm":"",
    })
    const LoadImage = (Image) => {
          const converted_blob = base64StringToBlob(Image, "image/png");
          const blobUrl = URL.createObjectURL(converted_blob);
          return blobUrl  
      };

    const getUser = async () => {
        let response = await axios.get('Admin/signUp')
        .then((response) => {

            console.log(response.data)
            setUserData(response.data)
            
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
        seteditUser(userData.filter((data) => data.id === id)[0]);
       
    };
    const CloseMod = () => {
        setmodIsOpen(false);
        seteditUser(null);
       
    };
    const handleAdd = () => {
        setmodIsOpen(true);
        setAddstate(true);
        seteditUser({
            "Username":"",
            "Password":"",
            "Permission":"",
            "new_password":"",
            "confirm":""
        })
    }
    const handleValueChange = (e) => {
        const { name, value } = e.target;
        seteditUser((prev) => ({ ...prev, [name]: value })); 
    };
    
    const handleImageFile = (e) => {
        setImageFile(e.target.files[0])
    }

    const handleSave = (e) => {
        e.preventDefault();
        let formData = new FormData()
        formData.append("Username", editUser.Username)
        formData.append("Password", editUser.Password)
        formData.append("Permission", editUser.Permission)
        formData.append("Image", ImageFile)
        if(!addstate) {
          axios.put(`Admin/signUp/${editUser.id}`, formData)
            .then(() => {
              alert('Modification effectuée');
              CloseMod();
              getUser()
            })
            .catch((error) => {
              console.error("Error updating user", error);
            });
        }
        if(addstate && editUser.Password===editUser.confirm){
            axios.post(`Admin/signUp`, formData)
            .then(() => {
              alert('Ajout effectuée');
              CloseMod();
              getUser()
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
            axios.delete(`Admin/signUp/${id}`)
                .then(() => {
                alert('Item supprimé');
                getUser()
                })
                .catch((error) => {
                console.error("Erreur pendant la suppression", error);
                });
        }

        }

    useEffect(() => {   
        getUser()
    },[])

    const columns = [
        {
            name: "ID",
            selector: (row) => row.id,
        },
        {
            name: "Images",
            cell: (row) => (
                <div className="w-16 h-16 rounded-full m-[0.2rem]">
                    <img className="object-cover rounded-full" src={LoadImage(row.Image)} />
                </div>
              ),
        },
        {
            name: "Nom d'utilisateur",
            selector: (row) => row.Username,
        },
        {
            name: "Privilège",
            selector: (row) => row.Permission,
        },
        {
            name: "Mot de passe",
            selector: (row) => row.Password,
        },
       
        {
            name: 'Actions',
            cell: (row) => (
              <div className="flex gap-2">
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
            <div className="ml-4 my-4">
                <button className=" flex items-center gap-2 w-auto p-2 bg-blue-600 text-white rounded-md" onClick={handleAdd}>Ajouter un utilisateur
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5rem" height="1.5rem" viewBox="0 0 24 24"><path fill="white" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z"></path></svg>
                </button>
            </div>
            <DataTable 
            columns={columns} 
            data={userData} 
            title="Admin"
            striped
            pagination 
            />

            <ReactModal
                    isOpen={modIsOpen}
                    onRequestClose={CloseMod}
                    contentLabel="Modifier un utilisateur"
                    className="absolute z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-[80%] md:w-[40%] bg-white rounde-lg border-2 p-2 shadow-md"
                    ariaHideApp={false}>
                    <h2 className="text-lg font-semibold mb-4"> {addstate ? 'Ajouter':'Modifier'} </h2>
                    {editUser && (
                    <div className="flex flex-col w-full justify-center items-center">
                        <form className="w-[80%]" onSubmit={handleSave}>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Nom d'utilisateur:</label>
                                <input name="Username" type="text" onChange={handleValueChange} value={editUser.Username} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Username" required />
                            </div>
                            <br />
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Mot de passe:</label>
                                <input  name="Password" type="password" onChange={handleValueChange} value={editUser.Password} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Password" required />
                            </div>
                            {addstate && 
                               (<> <div>
                                    <label  className="block mb-2 text-sm font-medium text-gray-900">Confirmer votre mot de passe:</label>
                                    <input name="confirm" type="password" onChange={handleValueChange} value={editUser.confirm} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Password" required />
                                </div>
                                <div>
                                    <p className="text-red-400 text-sm">{error_msg}</p>
                                </div>
                                </>)
                                
                            }
                            
                            {!addstate && 
                               ( <div>
                                    <label  className="block mb-2 text-sm font-medium text-gray-900">Nouveau mot de passe:</label>
                                    <input name="new_password" type="password" onChange={handleValueChange} value={editUser.new_password} className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Password"  />
                                </div>
                                 )
                            }
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900">Permission:</label>
                                <select name="Permission" onChange={handleValueChange} defaultValue="admin" className=" border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " required>
                                    <option value="admin">Admin</option>
                                    <option value="simple">Simple</option>
                                </select>
                            </div>
                            <div>
                                <label  className="block mb-2 text-sm font-medium text-gray-900">Image:</label>   
                                <input onChange={handleImageFile} type="file" aria-required={true}/>
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
    
export default Admin;
