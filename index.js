const express = require("express");
const app = express();
const pool = require("./db");
const uuid = require('uuid');
const moment = require('moment');

app.use(express.json()); // req.body

/** 
 * POST
 * URL: http://localhost:5000/notice
 * JSON data input:
 * {
    "name": "RAVI",
    "notice_text": "Hostels will be closed till 2nd Jan",
    "expiry_date": "2021-01-10",
    "hostel_name": "H4"
  }
 * Response:
   {
    "id": "bd05514f-024c-43b2-9cf2-57f082be8ae0",
    "name": "RAVI",
    "notice_text": "Hostels will be closed till 2nd Jan",
    "expiry_date": "2021-01-09T18:30:00.000Z",
    "hostel_name": "H4"
  }
 * Status Code: 
 * 200 - If inserted successfully.
 * 500 - If any internal error.
 */
app.post('/notice', async(req, res) =>{
    try{
        const uid = uuid.v4();
        const { name } = req.body;
        const { notice_text } = req.body;
        const { expiry_date } = req.body;
        const { hostel_name } = req.body;

        const insert_notice = await pool.query("INSERT INTO notice_details (id, name, notice_text, expiry_date, hostel_name) VALUES($1, $2, $3, $4, $5) RETURNING id, name, notice_text, expiry_date, hostel_name",[uid, name, notice_text, expiry_date, hostel_name]);
        res.status(200).json(insert_notice.rows[0]);
    }catch(err){
        res.status(500).json({response: false, error_message: err});
    }
});

/**
 * GET
 * URL: http://localhost:5000/notices?expiry_date={date}
 * Response:
 * [
    {
        "id": "eca490e8-9457-4db8-9037-c9031e7860d7",
        "name": "RAVI1",
        "notice_text": "Hostels will be closed till 2nd Jan",
        "expiry_date": "2021-01-10T18:30:00.000Z",
        "hostel_name": "H4"
    },
    {
        "id": "44d18901-afa8-4386-9532-e82c471944ec",
        "name": "RAVI2",
        "notice_text": "Hostels will be closed till 2nd Jan",
        "expiry_date": "2021-01-10T18:30:00.000Z",
        "hostel_name": "H4"
    }
]
 */
app.get('/notices', async(req, res) =>{
    try{
        if(req.query.expiry_date == null || req.query.expiry_date == undefined || !moment(req.query.expiry_date, "YYYY-MM-DD", true).isValid()){
            res.status(400).json();
            return;
        }
        const { expiry_date } = req.query;
        console.log(expiry_date);
        const select_notice = await pool.query("SELECT * FROM notice_details WHERE expiry_date = $1",[expiry_date]);
        res.status(200).json(select_notice.rows);
        
    }catch(err){
        res.status(500).json({response: false, error_message: err});
    }
});

app.listen(5000, () =>{
// SERVER START
});

module.exports = app;