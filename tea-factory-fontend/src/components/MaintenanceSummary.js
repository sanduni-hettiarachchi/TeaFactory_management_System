import React, { useEffect, useState } from 'react'
import { FaTools, FaUsers, FaMoneyBillWave, FaCalendarCheck, FaCheckCircle, FaClock,FaExclamationTriangle  } from 'react-icons/fa' 
  
import SummaryCard from './SummaryCard'

import './MaintenanceSummary.css'


function MaintenanceSummary() {
  const [data, setData] = useState({
    totalMachines: 0,
    totalTechnicians: 0,
    totalMaintenance: 0,
    scheduledMaintenance: 0,
    completedMaintenance: 0,
    pendingMaintenance: 0,
    overdueMaintenance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Adjust BASE_URL if you use an env var
        const res = await fetch('http://localhost:3001/Dash/summary');
        if (!res.ok) throw new Error('Failed to load dashboard summary');
        const json = await res.json();
        setData(json);
      } catch (e) {
        setError(e.message || 'Failed to load dashboard summary');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="summary-container">
        <h3>Dashboard Overview</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="summary-container">
        <h3>Dashboard Overview</h3>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="summary-container">
      <h3 >Dashboard Overview</h3>
      <div className="summary-grid">
        <SummaryCard icon={<FaTools />}  text="Total Machines" number={data.totalMachines} color="bg-light-green"/>
        <SummaryCard icon={<FaUsers />} text="Total Technicians" number={data.totalTechnicians} color="bg-light-yellow"/>
        <SummaryCard  icon={<FaMoneyBillWave />}  text="Total Maintenance" number={data.totalMaintenance} color="bg-light-red"/>
      </div>

    <div className="maintenance-section">
        <h4 >Maintenance Details</h4>

        <div className="maintenance-grid">
          <SummaryCard icon={<FaCalendarCheck />} text="Scheduled Maintenance " number={data.scheduledMaintenance} color="bg-normal"/> 
          <SummaryCard icon={<FaCheckCircle />} text="Completed Maintenance " number={data.completedMaintenance} color="bg-light-yellow"/> 
          <SummaryCard icon={<FaClock />} text="Pending Maintenance " number={data.pendingMaintenance} color="bg-light-red"/>
          <SummaryCard icon={<FaExclamationTriangle />} text="Overdue Maintenance " number={data.overdueMaintenance} color="bg-light-green"/>
        </div>
    </div>






    </div>
  )
}

export default MaintenanceSummary