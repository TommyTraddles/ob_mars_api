# NODE - Martian Robots API (local)

> ## ✅ Features

- Creates a mission for each surface sent.
- Persistently stores the journey of the defined robots in the mission petition.
- Flag a robot as lost when it goes outside the defined surface.
- When a robot gets lost, flag the last seen place as a "danger zone".
- When a robot is over a place flagged as "danger zone" facing the void direction, the F instruction is skipped.
- logs the complete journey on the terminal to have some fun.
- Returns the complete journey of each robot.
- Returns the complete statistics of the launched mission.

> ## 👋 Stack

- Application running
  - API: `node`, `express`
  - script: `node`
- Testing
  - API e2e: `jest` and `supertest`
- Persistence layer:
  - DB: `PostgreSQL` via `Slonik` ( on top of `pg`)
- Shipping:
  - `Docker`: database && node (optional)

<br/>

> Environment setup requirements

Make sure you have installed:

- API:
  - `node` >= 14.17.0
- containers:
  - `docker` >= 1.29.2

<br/>

> ## 👋 Setup

<br/>

```
git clone …
cd …
npm install
npm run docker:up
```

Within the main folder, create a `.env`, and update its info based on the `.env-sample` variables:

⛔️ Create the tables for the database with (API wont work if the tables are not created)

```
npm run seed
```

scaffold:

```bash
  |- /script
  |- /src
  |   |- /api
  |       |- router, services, query …
  |   |- /config
  |       |- setup…
  |   |- /middlewares
  |       |- error handler, input validator …
  |   |- /test
  |       |- api tests …
  |   |- index.js
  |- .env
  |- package.json
  |- docker-compose.yml
```

<br/>

> ## 👋 scripts

<br/>

### `npm run test`

Execute all available tests (`/src/test`)

<hr/>

### `npm run easter:egg`

Play in console with the visualizer (`/script/easter-egg.js`).

Uncomment your desired queries to `visualize` each robot's journey.

<hr/>

### `npm run start`

After starting the server, import the postman queries (`/postman`), define the following env variables in postman, and update the env variables `{{base_url}}` `{{port}}`.

Or import them with this .json [postman snapshot](https://www.getpostman.com/collections/ac4e03b318d28b51f2a5).

<br/>

> endpoint:

### `input`

```bash
  method:  POST
  url:     /
```

body schema:

```json
{
  "surface": {
    // number
    "x": 3,
    // number
    "y": 5
  },
  "robots": [
    // add as many robots Object you want inside this Array
    {
      // number
      "x": 1,
      // number
      "y": 1,
      // char
      "compass": "E",
      // string
      "instructions": "RFRFRFRF"
    }
  ]
}
```

### `output`

❌ Failure response:

```
  status: 400
```

```json
{
  "success": false,
  "message": "Error message"
}
```

✅ Success response:

```
  status: 200
```

```json
{
  "success": true,
  "missionStatistics": {
    // unique UUID id
    "missionId": "84faad9c…",

    // total count of sent robots
    "sentRobots": 1,

    // total count of lost robots
    "lostRobots": 0,

    // sent surface dimensions
    "surfaceDimentions": [3, 5],
    "surfaceTotalArea": "15 m2",

    // total area covered by all the robots
    "totalExploredSurface": "4 m2 | 26%",
    "exploredSurface": [
      { "x": 0, "y": 0 },
      { "x": 0, "y": 1 },
      { "x": 1, "y": 0 },
      { "x": 1, "y": 1 }
    ],

    // last seen place of all the lost robots
    "dangerousZonesIdentified": [],

    // information sent for each robot
    "robotLogs": [
      {
        // unique UUID id
        "robotId": "523e748a…",

        // explored surface
        "totalExploredSurface": "4 m2 | 26%",

        // last seen place
        "resume": { "position": [1, 1], "compass": "E", "lost": false },

        // complete journey
        "robotJourney": [
          { "step": 0, "x": 1, "y": 1, "compass": "E", "lost_signal": false },
          { "step": 1, "x": 1, "y": 1, "compass": "S", "lost_signal": false },
          { "step": 2, "x": 1, "y": 0, "compass": "S", "lost_signal": false },
          { "step": 3, "x": 1, "y": 0, "compass": "W", "lost_signal": false },
          { "step": 4, "x": 0, "y": 0, "compass": "W", "lost_signal": false },
          { "step": 5, "x": 0, "y": 0, "compass": "N", "lost_signal": false },
          { "step": 6, "x": 0, "y": 1, "compass": "N", "lost_signal": false },
          { "step": 7, "x": 0, "y": 1, "compass": "E", "lost_signal": false },
          { "step": 8, "x": 1, "y": 1, "compass": "E", "lost_signal": false }
        ]
      }
    ]
  }
}
```

<hr/>
