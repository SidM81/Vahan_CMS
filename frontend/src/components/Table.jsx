import React, { useState, useEffect } from 'react';
import Plus from '../assets/Plus.png'
import NewRow from './NewRow';
import UpdateRow from './UpdateRow';

const Table = ({tableName}) => {

    const [tableDetails, setTableDetails] = useState([]);
    const [newRowActive,setNewRowActive] = useState(false);
    const [updateRowActive,setUpdateRowActive] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [primaryKey, setPrimaryKey] = useState('');
    const [primaryValue,setPrimaryValue] = useState('');

    const openNewRow = () => {
      setNewRowActive(true);
    }

    const closeNewRow = () => {
      setNewRowActive(false);
    }

    const openUpdateRow = () => {
      setUpdateRowActive(true);
    }

    const closeUpdateRow = () => {
      setUpdateRowActive(false);
    }

    const fetchPrimaryKey = async () => {
      const data = {
          tableName: tableName
      };
  
      try {
          const response = await fetch(`http://localhost:8081/primary-key?name=${tableName}`);
          if (!response.ok) {
              throw new Error('Failed to fetch Primary Key');
          }
          const result = await response.json();
          setPrimaryKey(result[0].COLUMN_NAME);
      } catch (error) {
          console.error('Error fetching Primary Key:', error);
      }
  };

    const fetchTableDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8081/tables/table?name=${tableName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch table details');
        }
        const data = await response.json();
        setTableDetails(data);
      } catch (error) {
        console.error('Error fetching table details:', error);
      }
    };

    const fetchTableData = async () => {
      try{
        const response = await fetch(`http://localhost:8081/tables/table/info?name=${tableName}`);
        if (!response.ok) {
          throw new Error('Failed to fetch table details');
        }
        const data = await response.json();
        
        console.log(data);
        setTableData(data);
        tableData.map((column,index) => {
          if(column.Field==primaryKey){
            setPrimaryValue(column.value);
          }
        })
      }catch(error){
        console.error('Error fetching table details:', error);
      }
    };

    useEffect(() => {
      if (tableName){
        fetchTableDetails();
        fetchPrimaryKey();
        fetchTableData();
      }
    }, [tableName]);

    const handleRowAdded = () => {
      fetchTableData();
      closeNewRow();
    }

    const handleRowUpdated = () => {
        fetchTableData();
        closeUpdateRow();
    }

  return (
    <div className='entity-container'>
        <h2 className='entity-heading'>{tableName.charAt(0).toUpperCase()+tableName.substring(1)}</h2>
        <table className='entity-table-container'>
        <thead>
          <tr>
            {tableDetails.map((column, index) => (
              <th key={index} className='entity-table-coloumns' >{column.Field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row,index) => (
            <tr className='entity-table-row'>
              {tableDetails.map((column, colIndex) => (
                  <td key={colIndex} className='entity-table-rowD' onClick={openUpdateRow}>{row[column.Field]}</td>
                ))}
                { updateRowActive && <UpdateRow onClose={closeUpdateRow} tableDetail={tableDetails} rowDetail={row} tableNamE={tableName} primaryKey={primaryKey} primValue={row[primaryKey]} onRowUpdated={handleRowUpdated}/>}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <img src={Plus} className='plus-img-table' alt='plus' onClick={openNewRow}></img>
        {newRowActive && <NewRow onClose={closeNewRow} tableDetail={tableDetails} tableNamE={tableName} onRowAdded={handleRowAdded}/>}
      </div>
    </div>
  )
}

export default Table;