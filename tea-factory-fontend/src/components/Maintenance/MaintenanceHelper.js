
 import {  useNavigate } from "react-router-dom"
  import axios from 'axios'
  import './List.css'

 export const columns=[
    
    {
        name:"S No",
        selector:(row)=>row.sno
    },
    

    {
        name:"Machine Name",
        selector:(row)=>row.machineName
    },

    {
        name:"Priority",
        selector:(row)=>row.priority
    },

    {
        name:"Date",
       selector: (row) => new Date(row.date).toLocaleDateString(),
    },
{
        name:"Description",
        selector:(row)=>row.description
    },
    {
        name:"Maintenance Status",
        selector:(row)=>row.status
    },

    {
        name:"Action",
        selector:(row)=>row.action
    },
   
]

export const MaintenanceButtons = ({id, onMaintenanceDelete}) =>{
    
    const navigate=useNavigate()

    const handleDelete=async()=>{
        const confirm = window.confirm("Do you want to delete?")
         if(confirm){
        try{
           
         
        const response= await axios.delete(`http://localhost:3001/Maintenance/${id}`,{
          headers: {
            "Authorization":`Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log("Server response:", response);
        if (response.status === 200) {
          onMaintenanceDelete(id)
            }

      }catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || "Error fetching machines");
      }
    }

    }

     
    return(
        <div className="action-buttons">
            <button onClick={()=>navigate(`/MainDashboard/maintenance/${id}`)}className="edit-btn">Edit</button>
            <button onClick={handleDelete}className="delete-btn">Delete</button>
            <button  onClick={() => navigate(`/MainDashboard/add-technician?id=${id}`)}className="tech-btn">Technicians</button>
           
        </div>
    )

}