// will contain all of my exhibits routes
const express = require('express')
const exhibits_router = express.Router()
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

// GET exhibits based on exhibitID
exhibits_router.get('/exhibits/:id', (req, res) => {
    console.log("Fetching exhibit with id " + req.params.id)
    const connection = getMuseDBConnection()
    const exhibitID = req.params.id
    const queryExhibitID = "SELECT exhibit.exhibitID AS exhibitID, exhibit.name AS exhibit, type, description, exhibit.photo AS photo, creator.name AS creator FROM exhibit JOIN creator_creates_exhibit ON exhibit.exhibitID = creator_creates_exhibit.exhibitID JOIN creator ON creator.creatorID = creator_creates_exhibit.creatorID WHERE exhibit.exhibitID = ?"
      connection.query(queryExhibitID, [exhibitID], (err, rows) => {
      if (err) {
        console.log("Failed to query for exhibit: " + err)
        res.sendStatus(500)
        res.end()
        return
      }
      console.log("I think we fetched exhibit with ID: " + req.params.id)
      const exhibits = rows.map((row) => {
        return {
          id: row.exhibitID,
          name: row.exhibit,
          type: row.type,
          description: row.description,
          photo: row.photo,
          exhibitionID: row.exhibitionID,
          creator: row.creator
        }
      })
      res.json(exhibits)
      res.setHeader('Content-Type', 'application/json')
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    })
  })
  
  
  // GET all exhibits
  exhibits_router.get('/exhibits', (req, res) => {
    console.log("Fetching all exhibits")
    const connection = getMuseDBConnection()
    const queryAllExhibits = "SELECT exhibit.exhibitID AS exhibitID, exhibit.name AS exhibit, type, description, exhibit.photo AS photo, creator.name AS creator FROM exhibit JOIN creator_creates_exhibit ON exhibit.exhibitID = creator_creates_exhibit.exhibitID JOIN creator ON creator.creatorID = creator_creates_exhibit.creatorID"
      connection.query(queryAllExhibits, (err, rows) => {
      if (err) {
        console.log("Failed to query for exhibit: " + err)
        res.sendStatus(500)
        res.end()
        return
      }
      console.log("I think we fetched exhibits successfully")
      const exhibits = rows.map((row) => {
        return {
          id: row.exhibitID,
          name: row.exhibit,
          type: row.type,
          description: row.description,
          photo: row.photo,
          exhibitionID: row.exhibitionID,
          creator: row.creator
        }
      })
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
      res.setHeader('Content-Type', 'application/json')
      res.json(exhibits)
    })
  })

  module.exports = exhibits_router