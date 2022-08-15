const { sql } = require('slonik')

async function insertSurface(db, { x, y, id }) {
  return db.query(sql`
    INSERT INTO surfaces (x, y, mission_id) 
    VALUES (${x}, ${y}, ${id});
  `)
}

async function searchExistingSurface(db, { x, y, id }) {
  return await db.query(sql`
    SELECT * 
    FROM surfaces 
    WHERE 
      x = ${x}
      AND y = ${y}
      AND mission_id = ${id};
  `)
}

async function insertMission(db) {
  return await db.query(sql`
    INSERT INTO missions 
    DEFAULT VALUES 
    RETURNING id;
  `)
}

module.exports = {
  insertMission,
  insertSurface,
  searchExistingSurface,
}
