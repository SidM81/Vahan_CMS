import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plus from '../assets/Plus.png'
import Entity from './Entity';

const Sidebar = ({onEntityClick}) => {
  
  const [tables, setTables] = useState([]);
  const [entityActive, setEntityActive] = useState(false);

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:8081/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const openEntityActive = () => {
    setEntityActive(true);
  }

  const closeEntityActive = () => {
    setEntityActive(false);
  }
  
  const handleEntityAdded = () => {
    fetchTables();
    closeEntityActive();
  }

  return (
    <div className='sidebar'>
        <p className='sidebar-heading'>Entities</p>
        <div className="entity-list-container">
        {tables.map((table, index) => (
          <div key={index} className="entity-list-box" onClick={() => onEntityClick(table)}>
            <h3 >{table.charAt(0).toUpperCase()+table.substring(1)}</h3>
          </div>
        ))}
      </div>
      <div>
        <img src={Plus} className='plus-img' onClick={openEntityActive} alt='plus'></img>
        {entityActive && <Entity onClose={closeEntityActive} onEntityAdded={handleEntityAdded}/>}
      </div>
    </div>
  )
}

export default Sidebar;
