import {  useNavigate } from "react-router-dom"
 import axios from 'axios'
 import './MachineHelper.css'

export const columns=[
    
    {
        name:"S No",
        selector:(row)=>row.sno
    },
    

    {
        name:"Machine Name",
        selector:(row)=>row.name
    },

    {
        name:"Machine Type",
        selector:(row)=>row.type
    },

    {
        name:"Machine Location",
        selector:(row)=>row.location
    },

    {
        name:"Machine Status",
        selector:(row)=>row.status
    },

    {
        name:"Action",
        selector:(row)=>row.action
    },
   
]
export const MachineButtons = ({id,onMachineDelete}) =>{
    const navigate=useNavigate()

    const handleDelete=async()=>{
        const confirm = window.confirm("Do you want to delete?")
         if(confirm){
        try{
           
         
        const response= await axios.delete(`http://localhost:3001/Machine/${id}`,{
          headers: {
            "Authorization":`Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log("Server response:", response);
        if (response.status === 200) {
          onMachineDelete(id)
            }

      }catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || "Error fetching machines");
      }
    }

    }
    return(
        <div>
            <button onClick={()=>navigate(`/MainDashboard/machines/${id}`)}className="edit-btn">Edit</button>

            <button onClick={handleDelete} className="delete-btn">Delete</button>
        </div>
    )

}