// will contain all of my museums routes
const express = require('express')
const museums_router = express.Router()
const mysql = require('mysql')
const bodyParser = require('body-parser').json();

function getMuseDBConnection() {
    return mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '19mariamaria',
      database: 'musedb'    
    })
  }

// GET all museums
museums_router.get('/museums', (req, res) => {
    console.log("Fetching all museums")
    const connection = getMuseDBConnection()
    const queryAllMuseums = "SELECT * FROM museum"
      connection.query(queryAllMuseums, (err, rows) => {
      if (err) {
        console.log("Failed to query for museums: " + err)
        res.sendStatus(500)
        res.end()
        return
      }
      console.log("I think we fetched museums successfully")
      const museums = rows.map((row) => {
        return {
          id: row.museumID,
          name: row.name,
          type: row.type,
          description: row.description,
          photo: row.image
        }
      })
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.json(museums)
    })
  })
  
  // GET museums based on museumID
  museums_router.get('/museums/:id', (req, res) => {
    console.log("Fetching museum with id " + req.params.id)
    const connection = getMuseDBConnection()
    const museumID = req.params.id
    const queryMuseumID = "SELECT * FROM museum WHERE museumID = ?"
      connection.query(queryMuseumID, [museumID], (err, rows) => {
      if (err) {
        console.log("Failed to query for museum: " + err)
        res.sendStatus(500)
        res.end()
        return
      }
      console.log("I think we fetched museum with ID: " + req.params.id)
      const museums = rows.map((row) => {
        return {
          id: row.museumID,
          name: row.name,
          type: row.type,
          description: row.description,
          photo: row.image
        }
      })
      res.json(museums)
    })
  })

    // GET museum's tickets and schedules based on museumID
    museums_router.get('/museum_tickets_schedules/:id', (req, res) => {
      console.log("Fetching museum schedules and tickets with id " + req.params.id)
      const connection = getMuseDBConnection()
      const museumID = req.params.id
      const queryMuseumID = "SELECT * FROM musedb.tickets_and_schedules_of_museum WHERE museumID = ?;"
        connection.query(queryMuseumID, [museumID], (err, rows) => {
        if (err) {
          console.log("Failed to query for museum: " + err)
          res.sendStatus(500)
          res.end()
          return
        }
        console.log("I think we fetched museum_tickets_schedules for museum with ID: " + req.params.id)
        const museum_tickets_schedules = rows.map((row) => {
          return {
            id: row.museumID,
            name: row.museum,
            visitorType: row.visitor_type,
            price: row.description,
            currenct: row.image,
            schedule: row.schedule,
            day: row.day,
            from: row.from,
            to: row.to
          }
        })
        res.json(museum_tickets_schedules)
      })
    })

module.exports = museums_router