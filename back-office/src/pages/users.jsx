import { useEffect, useState } from "react";
import  {Axios} from  "../api/axios";
import DataTable from "react-data-table-component";
function Users(){
    const axios =  Axios()
    const [userData, setUserData] = useState([])
    useEffect(() => {
        const getUser = async () => {
            let response = await axios.get('users')
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
        getUser()
    },[])
    const columns = [
        {
            name: "ID",
            selector: (row) => row.ID,
        },
        {
            name: "Nom d'utilisateur",
            selector: (row) => row.username,
        },
        {
            name: "Mot de passe",
            selector: (row) => row.password,
        },
    ];

    const rows = [
        userData.map((data) => {
            [
                {
                    ID: data.id,
                    username:data.username,
                    password:data.password,
                }
            ]
        })
    ];
    return(<>
    
        <div>
            <DataTable columns={columns} 
            data={rows} 
            fixedHeader
            title="Admin/Utilisateurs" />
        </div>
        
    </>)
    
    }
    
export default Users;