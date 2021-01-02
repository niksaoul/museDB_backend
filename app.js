// load our app server
const express = require('express')
const app = express()
const mysql = require('mysql')
const bodyParser = require('body-parser').json();

app.use(express.static('./public'))

// GET user/:id
app.get('/user/:id', (req, res) => {
  console.log("Fetching user with id: " + req.params.id)
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '19mariamaria',
    database: 'nodejsdb'
  })

  const userId = req.params.id
  const queryOneUser = "SELECT * FROM user WHERE user = ?"

  connection.query(queryOneUser, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      res.end()
      return
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return {
        id: row.user,
        firstName: row.first_name,
        lastName: row.last_name
      }
    })

    res.json(users)
  })

})

app.get("/", (req, res) => {
  console.log("Responding to root route")
  res.send("Hello from ROOOOOT")
})

// POST user
app.post('/user', bodyParser, (req, res) => {
  console.log("Trying to create a new user...")
  console.log("Yoooooo");
  console.log(req.headers);
  console.log(req.body);
  const firstName = req.body.firstName
  const lastName = req.body.lastName

  const queryString = "INSERT INTO user (first_name, last_name) VALUES (?, ?)"
  getConection().query(queryString, [firstName, lastName], (err, results, fields) => {
    if (err) {
      console.log("Failed to insert user: " + err)
      res.sendStatus(500)
      return
    }

    console.log("Inserted user: " + firstName + " " + lastName)
    res.sendStatus(201)
    res.end()
  })

})

function getConection() {
  return mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '19mariamaria',
    database: 'nodejsdb'
  })
}

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
app.get('/museums', (req, res) => {
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
app.get('/museums/:id', (req, res) => {
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

// GET exhibits based on exhibitID
app.get('/exhibits/:id', (req, res) => {
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
app.get('/exhibits', (req, res) => {
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
    // res.setHeader('Content-Type', 'application/json')
  })
})

function getConectionWithSqlInvoicing() {
  return mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '19mariamaria',
    database: 'sql_invoicing'
  })
}

// GET users
app.get('/users', (req, res) => {
  console.log("Fetching all users")
  const connection = getConection()

  const userId = req.params.id
  const queryAllUsers = "SELECT * FROM user"
    connection.query(queryAllUsers, [userId], (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for users: " + err)
      res.sendStatus(500)
      res.end()
      return
    }

    console.log("I think we fetched users successfully")

    const users = rows.map((row) => {
      return {
        id: row.user,
        firstName: row.first_name,
        lastName: row.last_name
      }
    })
    res.json(users)
  })

})


//localhost:3003
app.listen(3003, () => {
  console.log("Server is up and listening on 3003...")
})


/////////////////////////////////////////////////////////
// GET clients
app.get('/clients', (req, res) => {
  console.log("Fetching all clients")
  const connection = getConectionWithSqlInvoicing()

  const userId = req.params.id
  const queryAllClients = "SELECT * FROM clients"
    connection.query(queryAllClients, (err, rows, fields) => {
    if (err) {
      console.log("Failed to query for clients: " + err)
      res.sendStatus(500)
      res.end()
      return
    }

    console.log("I think we fetched clients successfully")

    const clients = rows.map((row) => {
      return {
        id: row.client_id,
        name: row.name,
        address: row.address,
        city: row.city,
        state: row.state,
        phone: row.phone
      }
    })
    res.json(clients)
  })

})