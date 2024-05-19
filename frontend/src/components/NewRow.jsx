import React, { useState, useEffect } from 'react'
import closelogo from '../assets/1024px-VisualEditor_-_Icon_-_Close_-_white.svg.png';
import Plus from '../assets/Plus.svg'
import axios from 'axios';

const NewRow = ({onClose , tableDetail,tableNamE, onRowAdded}) => {
    const [inputBoxes, setInputBoxes] = useState([{ id: 1, value: ''}]);

    useEffect(() => {
        const initialInputBoxes = tableDetail.map((column, index) => ({
            id: index + 1,
            value: ''
        }));
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
        };

    const handleSubmit = () => {
        for (const box of inputBoxes) {
            if (!box.value.trim()) {
            alert("Please fill all fields.");
            return;
            }
        }

        const data = {
            tableName: tableNamE,
            columns: tableDetail.map((column, index) => ({
              name: column.Field,
              value: inputBoxes[index].value
            }))
          };
        console.log(data);
        axios.post('http://localhost:8081/insert-table', data)
            .then(response => {
                console.log(response.data);
                const resetInputBoxes = tableDetail.map((column, index) => ({
                    id: index + 1,
                    value: ''
                }));
                setInputBoxes(resetInputBoxes);
                onRowAdded();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        };

    return (
        <div className='create-new-row'>
        <img src={closelogo} className='create-new-row-close' onClick={onClose} alt='close'></img>
        <table className='create-new-row-container'>
            <thead>
            <tr>
                {tableDetail.map((column, index) => (
                <th key={index} className='create-new-row-coloumns'>{column.Field}</th>
                ))}
            </tr>
            </thead>
            <tbody>
          <tr className='create-new-row-input-container'>
            {inputBoxes.map(box => (
              <td key={box.id}>
                <input
                  type="text"
                  value={box.value}
                  onChange={e => handleInputChange(box.id, e.target.value)}
                  className='create-new-row-input'
                />
              </td>
            ))}
          </tr>
        </tbody>
            </table>
        <button className="create-new-row-submit" onClick={handleSubmit}>Submit</button>
        </div>
    )
}

export default NewRow;