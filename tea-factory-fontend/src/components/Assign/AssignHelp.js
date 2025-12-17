
  import {  useNavigate } from "react-router-dom"
  import axios from 'axios'

 export const columns=[
    
    {
        name:"S No",
        selector:(row)=>row.sno
    },
    

    {
        name:"Technician Name",
        selector:(row)=>row.techname
    },

    {
        name:"Machine Name",
        selector:(row)=>row.machinename
    },

    {
        name:"Assign Date",
       selector: (row) => new Date(row.adate).toLocaleDateString(),
    },
{
        name:"Issue",
        selector:(row)=>row.issue
    },
    {
        name:" Should Complete",
        selector: (row) => new Date(row.edate).toLocaleDateString(),
    },

    {
        name:"Action",
        selector:(row)=>row.action
    },
   
]

export const AssignButtons = ({ id, onAssignDelete }) =>{
    const navigate=useNavigate()
   
const handleDelete=async()=>{
        const confirm = window.confirm("Do you want to delete?")
         if(confirm){
        try{
           
         
        const response= await axios.delete(`http://localhost:3001/Assign/${id}`,{
          headers: {
            "Authorization":`Bearer ${localStorage.getItem('token')}`
          }
        })
        console.log("Server response:", response);
        if (response.status === 200) {
          onAssignDelete(id)
            }

      }catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            alert(error.response?.data?.message || "Error fetching machines");
      }
    }

    }
    
     
    return(
        <div className="action-buttons">
            <button onClick={()=>navigate(`/MainDashboard/assign-info/${id}`)}className="edit-btn">Inform</button>
            <button onClick={handleDelete}className="delete-btn">Delete</button>
           
        </div>
    )

}