const db = require('../src/config/database')
const { sql } = require('slonik')

;(async () => {
  try {
    return db.transaction(async (tx) => {
      // DROP EXISTING

      await tx.query(sql`
      DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
      `)
      await tx.query(sql`
      DROP TABLE IF EXISTS danger_zones CASCADE;
      `)
      await tx.query(sql`
      DROP TABLE IF EXISTS robots_logs CASCADE;
      `)
      await tx.query(sql`
      DROP TABLE IF EXISTS robots CASCADE;
      `)
      await tx.query(sql`
      DROP TABLE IF EXISTS surfaces CASCADE;

      `)
      await tx.query(sql`
      DROP TABLE IF EXISTS missions CASCADE;
      `)

      // CREATING DB:
      await tx.query(sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS missions (
        id              uuid            PRIMARY KEY default uuid_generate_v4(),
        created_at      TIMESTAMP       not null default (now() at time zone 'UTC')
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS surfaces (
        id              uuid            PRIMARY KEY default uuid_generate_v4(),
        mission_id      uuid            not null default uuid_generate_v4(), 
        x               INTEGER         not null,
        y               INTEGER         not null
      );
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS robots (
        id              uuid            PRIMARY KEY default uuid_generate_v4(),
        surface_id      uuid            not null default uuid_generate_v4(),
        mission_id      uuid            not null default uuid_generate_v4(), 
        batch           INTEGER         ,
        x               INTEGER         not null,
        y               INTEGER         not null,
        compass         CHAR(1)         not null,
        instructions    VARCHAR(100)    not null,
        lost_signal     BOOLEAN         default false                    
      );
      
      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS robots_logs (
        id              uuid            PRIMARY KEY default uuid_generate_v4(),
        robot_id        uuid            not null default uuid_generate_v4(),
        surface_id      uuid            not null default uuid_generate_v4(),
        mission_id      uuid            not null default uuid_generate_v4(), 
        step            INTEGER         not null,
        batch           INTEGER         not null,
        x               INTEGER         not null,
        y               INTEGER         not null,
        compass         CHAR(1)         not null,
        instruction     CHAR(1)         ,
        lost_signal     BOOLEAN         default false,
        created_at      TIMESTAMP       not null default (now() at time zone 'UTC')
      );  

      `)
      await tx.query(sql`
      CREATE TABLE IF NOT EXISTS danger_zones (
        id              uuid            PRIMARY KEY default uuid_generate_v4(),
        robot_id        uuid            not null default uuid_generate_v4(),
        surface_id      uuid            not null default uuid_generate_v4(),
        mission_id      uuid            not null default uuid_generate_v4(), 
        x               INTEGER         not null,
        y               INTEGER         not null,
        compass         CHAR(1)         not null
      );
      `)
      await tx.query(sql`
      ALTER TABLE surfaces
        ADD FOREIGN KEY(mission_id) REFERENCES missions(id);
    
      `)
      await tx.query(sql`
      ALTER TABLE robots
        ADD FOREIGN KEY(mission_id) REFERENCES missions(id),
        ADD FOREIGN KEY(surface_id) REFERENCES surfaces(id);
    
      `)
      await tx.query(sql`
      ALTER TABLE robots_logs
        ADD FOREIGN KEY(robot_id) REFERENCES robots(id),
        ADD FOREIGN KEY(mission_id) REFERENCES missions(id),
        ADD FOREIGN KEY(surface_id) REFERENCES surfaces(id);
    
      `)
      await tx.query(sql`
      ALTER TABLE danger_zones
        ADD FOREIGN KEY(robot_id) REFERENCES robots(id),
        ADD FOREIGN KEY(mission_id) REFERENCES missions(id),
        ADD FOREIGN KEY(surface_id) REFERENCES surfaces(id);
    
      `)

      console.info('> ✅ [Success] tables created')
    })
  } catch (error) {
    console.info('> ❌ [Error] creating the tables')
    console.info('>', error.message)
  }
})()
