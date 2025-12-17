import React from 'react'
import SideBar from '../SideBars'
import MaintenanceSummary from '../MaintenanceSummary'
import Navbar from '../Navbar'

function Home() {
  return (
    <div className="flex"> {/* home-container */}
      <SideBar />
      <div className="flex-1 ml-64 bg-[#b5fcca] h-screen"> {/* home-main */}
        <Navbar />
        <MaintenanceSummary />
      </div>
    </div>
  )
}

export default Home