const express = require("express");
const mysql = require("mysql")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json());

const db = mysql.createConnection({
    host:  "localhost",
    user:  'root',
    password: '',
    database:  'vahan'
})

app.get('/' , (re,res)=> {
    return res.json("From backend Side");
})

app.get('/tables', (req, res) => {
    const query = "SHOW TABLES";
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching tables:', err);
        return res.status(500).json({ error: 'An error occurred' });
      }
      const tables = result.map(row => row[`Tables_in_${db.config.database}`]);
      res.json(tables);
    });
  });

  app.get("/tables/table", (req, res) => {
    const { name: tableName } = req.query;
    const database = "vahan";
    const query = `DESCRIBE ${database}.${tableName}`; // Use DESCRIBE statement to get table details
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching table details:', err);
        return res.status(500).json({ error: 'An error occurred'});
      }
      res.json(result);
    });
  });

  app.get("/tables/table/info", (req,res) => {
    const { name: tableName } = req.query;
    const database = "vahan";
    const query = `SELECT * from ${database}.${tableName}`; // Use SELECT * statement to get table data
    db.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching table details:', err);
        return res.status(500).json({ error: 'An error occurred'});
      }

      const formattedResults = result.map(row => {
        if (row.Dob) {
            return {
                ...row,
                Dob: row.Dob.toISOString().split('T')[0] // Format date to YYYY-MM-DD
            };
        }
        return row;
    });
    
    res.json(formattedResults);
    });
  });

  app.get("/primary-key", (req, res) => {
    const { name: tableName } = req.query;

    if (!tableName) {
        return res.status(400).json({ error: 'Table name is required' ,tableName: `${tableName}`});
    }

    let query = `SELECT COLUMN_NAME
                 FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
                 WHERE TABLE_SCHEMA = 'vahan'
                 AND TABLE_NAME = '${tableName}'
                 AND CONSTRAINT_NAME = 'PRIMARY';`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error fetching Primary Key:', err);
            return res.status(500).json({ error: 'An error occurred' });
        }
        res.json(result); 
    });
});

  app.post("/create-table", (req, res) => {
    const { tableName, columns } = req.body;

    let primary_key = null;
    // Create the SQL query to create the table
    let query = `CREATE TABLE ${tableName} (`;
    columns.forEach((column, index) => {
        query += `${column.name} ${column.type}, `;

        if(column.isPrimaryKey===true){
          primary_key = column.name;
        }
    });
    query += 'PRIMARY KEY (';
    query += `${primary_key}`;
    query += '))';

    // Execute the SQL query
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
            return res.status(500).json({ error: 'An error occurred while creating table' });
        }
        console.log('Table created successfully');
        res.json({ message: 'Table created successfully' });
    });
});


  app.post("/insert-table", (req,res) => {
    const {tableName,columns} = req.body;

    let query = `INSERT INTO ${tableName} (`;
    columns.forEach((column,index) => {
        query += `${column.name}`;
        if (index !== columns.length - 1) {
          query += ', ';
      }
    });
    query+=') VALUES (';
    columns.forEach((column,index) => {
      if (typeof(column.value)==='string'){
        query +=`\'${column.value}\'`;
      }
      else{
        query += `${column.value}`;
      }
      if (index !== columns.length - 1) {
        query += ', ';
    }
    });
    query+=') ;';

    db.query(query, (err, result) => {
      if (err) {
          console.error('Error inserting into table:', err);
          return res.status(500).json({ error: 'An error occurred while inserting into table'});
      }
      res.json({ message: 'Row inserted successfully' });
  });

  });

  app.post("/update-table", (req, res) => {
    const { tableName, columns, primaryKey, prim_value } = req.body;

    // Filter out columns with empty values
    const filteredColumns = columns.filter(column => column.value && column.name !== primaryKey);

    if (filteredColumns.length === 0) {
        return res.status(400).json({ error: "No valid columns to update" });
    }

    // Construct the UPDATE query
    let query = `UPDATE ${tableName} SET `;
    query += filteredColumns.map(column => `${column.name} = '${column.value}'`).join(", ");
    query += ` WHERE ${primaryKey} = '${prim_value}'`;

    console.log('Executing query:', query); // Log the query for debugging

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error updating table:', err);
            return res.status(500).json({ error: 'An error occurred while updating the table', query });
        }
        res.json({ message: 'Row updated successfully' });
    });
});

  app.post("/delete-row", (req, res) => {
    const { tableNamE, primaryKey, primValue } = req.body;

    const query = `DELETE FROM ${tableNamE} WHERE ${tableNamE}.${primaryKey} = ${primValue}`;

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error deleting row:', err);
            return res.status(500).json({ error: 'An error occurred while deleting the row',qu:query});
        }
        res.json({ message: 'Row deleted successfully', affectedRows: result.affectedRows});
    });
});

app.listen(8081 , () => {
    console.log("listening");
})