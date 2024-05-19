import React ,{useState, useEffect} from 'react'
import closelogo from '../assets/1024px-VisualEditor_-_Icon_-_Close_-_white.svg.png';
import axios from 'axios';

const UpdateRow = ({onClose, tableDetail,rowDetail,tableNamE,primaryKey,primValue,onRowUpdated}) => {
    const [inputBoxes, setInputBoxes] = useState([{ id: 1, value: ''}]);

    const initialInputBoxes = tableDetail.map((column, index) => ({
      id: index + 1,
      value: ''
    }));

    useEffect(() => {
        setInputBoxes(initialInputBoxes);
    }, [tableDetail]);

    const handleInputChange = (id, value) => {
        const newInputBoxes = inputBoxes.map(box => {
            if (box.id === id) {
            return { ...box, value };
            }
            return box;
        });
        setInputBoxes(newInputBoxes);
    }

    const handleUpdateRow = () => {
        const data = {
            tableName: tableNamE,
            columns: tableDetail
              .map((column, index) => ({
                name: column.Field,
                value: inputBoxes[index] ? inputBoxes[index].value : '',
              }))
              .filter(column => column.value !== '' || column.name !== primaryKey),
            primaryKey: primaryKey,
            prim_value: primValue
          };

          axios.post('http://localhost:8081/update-table', data)
            .then(response => {
              console.log(response.data);
              setInputBoxes(initialInputBoxes);
              onRowUpdated();
            })
            .catch(error => {
              console.error('Error:', error.response ? error.response.data : error.message);
            });
    }

    const handleDeleteRow = () => {
      const confirmation = window.confirm('Are you sure you want to delete this row? This action cannot be undone.');
      
      if(confirmation){
        const data = {
          tableNamE: tableNamE,
          primaryKey: primaryKey,
          primValue: primValue
        };
        axios.post('http://localhost:8081/delete-row', data)
              .then(response => {
                console.log(response.data);
                setInputBoxes(initialInputBoxes);
                onRowUpdated();
              })
              .catch(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
              });
      }
      else{
        console.log('Deletion cancelled.');
      }
    }

  return (
    <div className='update-row'>
    <img src={closelogo} className='update-row-close' onClick={onClose} alt='close'></img>
    <table className='update-row-container'>
            <thead>
            <tr>
                {tableDetail.map((column, index) => (
                <th key={index} className='update-row-columns'>{column.Field}</th>
                ))}
            </tr>
            </thead>
            <tbody>
          <tr className='update-row-input-container'>
            {inputBoxes.map(box => (
              <td key={box.id}>
                <input
                  type="text"
                  value={box.value}
                  onChange={e => handleInputChange(box.id, e.target.value)}
                  className='update-row-input'
                />
              </td>
            ))}
          </tr>
        </tbody>
            </table>
    <button className="update-row-update" onClick={handleUpdateRow}>Update</button>
    <button className="update-row-delete" onClick={handleDeleteRow}>Delete</button>
    </div>
  )
}

export default UpdateRow;