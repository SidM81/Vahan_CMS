import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar';
import Table from './Table';

const Home = () => {

  const [tableName,setTableName] = useState("");

  const handleEntityClick = (tableName) => {
    setTableName(tableName);
  }

  return (
    <div>
      <Navbar />
      <Sidebar onEntityClick={handleEntityClick}/>
      <Table tableName={tableName}/>
    </div>
  )
}

export default Home;