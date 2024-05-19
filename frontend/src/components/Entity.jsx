import React, {useState} from 'react'
import axios from 'axios';
import closelogo from '../assets/1024px-VisualEditor_-_Icon_-_Close_-_white.svg.png';
import Plus from '../assets/Plus.svg'
import Minus from '../assets/minus.svg'

const Entity = ({onClose,onEntityAdded}) => {

  const [inputBoxes, setInputBoxes] = useState([{ id: 1, value: '', selectedOption: '' }]);
  const [tableName, setTableName] = useState('');
  const [primaryKey, setPrimaryKey] = useState(null);

  const handleAddInput = () => {
    if(inputBoxes.length === 8) {
      return ;
    }
    const newInputBoxes = [...inputBoxes, { id: inputBoxes.length + 1, value: '', selectedOption: '' }];
    setInputBoxes(newInputBoxes);
  };

  const handleInputChange = (id, value) => {
    const newInputBoxes = inputBoxes.map(box => {
      if (box.id === id) {
        return { ...box, value };
      }
      return box;
    });
    setInputBoxes(newInputBoxes);
  };

  const handleSelectChange = (id, selectedOption) => {
    const newInputBoxes = inputBoxes.map(box => {
      if (box.id === id) {
        return { ...box, selectedOption };
      }
      return box;
    });
    setInputBoxes(newInputBoxes);
  };

  const handlePrimaryKeyChange = (id) => {
    setPrimaryKey(id);
  };

  const handleRemoveInput = (id) => {
    if (inputBoxes.length === 1) {
      return;
    }
    const newInputBoxes = inputBoxes.filter(box => box.id !== id);
    setInputBoxes(newInputBoxes);
    if (primaryKey === id) {
      setPrimaryKey(null);
    }
  };

  const handleSubmit = () => {
    if (!tableName.trim()) {
      alert("Please enter a table name.");
      return;
    }
  
    for (const box of inputBoxes) {
      if (!box.value.trim()) {
        alert("Please enter column names for all fields.");
        return;
      }
    }
  
    for (const box of inputBoxes) {
      if (!box.selectedOption.trim()) {
        alert("Please select column types for all fields.");
        return;
      }
    }

    if (primaryKey === null) {
      alert("Please select a primary key.");
      return;
    }
    
    const data = {
      tableName: tableName,
      columns: inputBoxes.map(box => ({ 
        name: box.value, 
        type: box.selectedOption === 'VARCHAR' ? 'VARCHAR(255)' : box.selectedOption,
        isPrimaryKey: primaryKey === box.id
      }))
    };
    axios.post('http://localhost:8081/create-table', data)
      .then(response => {
        console.log(response.data);
        setTableName(''); 
        setInputBoxes([{ id: 1, value: '', selectedOption: '' }]);
        setPrimaryKey(null);
        onEntityAdded();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <div className='create-entity'>
      <img src={closelogo} className='create-entity-close' onClick={onClose} alt='close'></img>
      <div> 
        <label htmlFor="tableName" className="create-entity-name-label">Table Name: </label>
        <input type="text" className="create-entity-name-box" id="tableName" value={tableName} onChange={e => setTableName(e.target.value)} />
      </div>
      <div>
        <p className='create-entity-column-name'>Column Name</p>
        <p className='create-entity-column-type'>Column Type</p>
        <p className='create-entity-primary-key'>Primary Key</p>
      </div>
      <div className="create-entity-divs">
        {inputBoxes.map(box => (
          <div key={box.id} className="create-entity-input-row">
            <input
              type="text"
              value={box.value}
              onChange={e => handleInputChange(box.id, e.target.value)}
              placeholder={`Column Name `}
              className='create-entity-input-row-name'
            />
            <select
              value={box.selectedOption}
              onChange={e => handleSelectChange(box.id, e.target.value)}
              className='create-entity-input-row-type'
            >
              <option value="">Select...</option>
              <option value="INT">INT</option>
              <option value="VARCHAR">VARCHAR</option>
              <option value="TEXT">TEXT</option>
              <option value="DATE">DATE</option>
              <option value="BOOLEAN">BOOLEAN</option>
              <option value="DOUBLE">DOUBLE</option>
            </select>
            <input
              type="radio"
              checked={primaryKey === box.id}
              onChange={() => handlePrimaryKeyChange(box.id)}
              className='create-entity-primary-key-radio'
            />
            <img src={Minus} className='create-entity-minus-img' onClick={() => handleRemoveInput(box.id)} alt="Minus"></img>
          </div>
        ))}
      </div>
      <img src={Plus} className='create-entity-plus-img' onClick={handleAddInput} alt='plus'></img>
      <button className="create-entity-submit" onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default Entity;