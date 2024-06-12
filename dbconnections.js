const sql = require('mssql');
const config = {

}
const dbtable = "dbo.blacklist";


async function addNewTable(rio, charname, realm, guild = null, reason, addedby = null, dateadded = null) {
  try {
  sql.connect(config)
  .then(async pool => {
    console.log('Connected to SQL Server');
    const query = `INSERT INTO ${dbtable} (rio, name, realm, guild, reason, addedby, dateadded) VALUES (@rio, @name, @realm, @guild, @reason, @addedby, @dateadded)`;

    const request = pool.request();
  
    request.input('rio', sql.NVarChar, rio);
    request.input('name', sql.NVarChar, charname);
    request.input('realm', sql.NVarChar, realm);
    request.input('guild', sql.NVarChar, guild);
    request.input('reason', sql.NVarChar, reason);
    request.input('addedby', sql.NVarChar, addedby);
    request.input('dateadded', sql.NVarChar, dateadded);
  
    const result = await request.query(query);
    console.log(result);
  })
  .catch(err => {
    console.log('Connection error: ', err);
  });

  }catch (err) {
    console.log('Error: ', err);
    return err;
  }
}

async function checkIfUserExists(rio){
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    console.log("rio: " + rio)
    const query = `SELECT * FROM ${dbtable} WHERE rio LIKE '${rio}'`;
    const result = await pool.request().query(query);
    console.log("result: "+result.recordset);
    return (result.recordset.length > 0);
  } catch (err) {
    console.log('Error: ', err);
    return false;
  }
}


async function getBlacklistEntryByRio(rio) {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    console.log("rio: " + rio)
    const query = `SELECT * FROM ${dbtable} WHERE rio = @rio`;
    const result = await pool.request().input('rio', sql.NVarChar, rio).query(query);
    console.log("result: "+result.recordset);
    return result.recordset[0];
  } catch (err) {
    console.log('Error: ', err);
    return null;
  }
}

async function getBlacklistEntriesByName(name) {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    const query = `SELECT * FROM ${dbtable} WHERE name = @name`;
    const result = await pool.request().input('name', sql.NVarChar, name).query(query);
    console.log("result: "+result.recordset);
    return result.recordset;
  } catch (err) {
    console.log('Error: ', err);
    return null;
  }
}

async function getBlacklistEntriesByRealm(realm) {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    const query = `SELECT * FROM ${dbtable} WHERE realm = @realm`;
    const result = await pool.request().input('realm', sql.NVarChar, realm).query(query);
    console.log("result: "+result.recordset);
    return result.recordset;
  } catch (err) {
    console.log('Error: ', err);
    return null;
  }
}

async function getBlacklistEntriesByGuild(guild) {
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    const query = `SELECT * FROM ${dbtable} WHERE guild = @guild`;
    const result = await pool.request().input('guild', sql.NVarChar, guild).query(query);
    console.log("result: "+result.recordset);
    return result.recordset;
  } catch (err) {
    console.log('Error: ', err);
    return null;
  }
}



async function removeEntryByRio(rio){
  try {
    const pool = await sql.connect(config);
    console.log('Connected to SQL Server');
    const query = `DELETE FROM ${dbtable} WHERE rio = @rio`;
    const result = await pool.request().input('rio', sql.NVarChar, rio).query(query);
    console.log("Number of rows deleted: "+result.rowsAffected);
  } catch (err) {
    console.log('Error: ', err);
  }
}


module.exports = {
  addNewTable,
  checkIfUserExists,
  getBlacklistEntryByRio,
  removeEntryByRio,
  getBlacklistEntriesByName, 
  getBlacklistEntriesByRealm,
  getBlacklistEntriesByGuild
};