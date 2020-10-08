const express = require('express')
const app = express()
const port = 3000
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kw31'
});

db.connect();
app.use(cors())
app.use(bodyParser.json())


let responseData = {
    status: 0,
};

// app.get('/', (req, res) => res.send('Hello World!'))

app.get('/sys/firendslink', (req, res) => {
    db.query('SELECT * FROM web', (error, result) => {
        if (error) throw error;
        res.send(result)
    })
})
app.get('/sys/detailfl', (req, res) => {
    let { id } = req.query
    db.query(`SELECT * FROM web where id ='${id}'`, (error, result) => {
        if (error) throw error;
        responseData.status = 201
        res.json({ result, responseData })
    })

})
app.post('/sys/detailfl', (req, res) => {
    let { id, webname, website } = req.body
    db.query(`UPDATE web SET webname = '${webname}',website='${website}' WHERE id ='${id}';`)
    responseData.status = 201
    res.json(responseData)

})
app.delete('/sys/removefl', (req, res) => {
    let { id } = req.query
    db.query(`DELETE FROM web WHERE id='${id}'`)
    responseData.status = 201
    res.json(responseData)
})
app.post('/sys/savefl', (req, res) => {
    let { webname, website } = req.body
    db.query(`INSERT INTO web(webname, website) VALUES('${webname}', '${website}')`, (err, result) => {
        if (err) throw err;
        responseData.status = 200
        res.json(responseData)
    })
})
app.listen(port, () => console.log(`服务器启动成功`)) 