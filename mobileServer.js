let express=require("express");
let cors = require("cors");
let app = express();
app.use(express.json());
app.use(cors());
app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
    );
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With,Content-Type,Accept"
    );
    next();
});
//process.env.PORT ||
const port = process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}`));

let {client} = require("./mobileDB.js");
client.connect();

app.get("/mobiles",function(req,res){
    let query = `SELECT * FROM mobiles`;
    client.query(query,function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in fetching data");
        }else res.send(results.rows);
    })
})

app.get("/mobiles/:id",function(req,res){
    let id = +req.params.id;
    let query = `SELECT * FROM mobiles WHERE id=$1`;
    console.log(query);
    client.query(query,[id],function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in fetching data");
        }
        else res.send(results.rows);
        // client.end();
    })
})

app.post("/mobiles",function(req,res){
    let body = req.body;
    let query = `INSERT INTO mobiles(name,price,brand,ram,rom,os) VALUES($1,$2,$3,$4,$5,$6)`;
    client.query(query,[body.name,body.price,body.brand,body.ram,body.rom,body.os],function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in inserting data");
        }else res.send(results);
    })
})

app.put("/mobiles/:id",function(req,res){
    let id = +req.params.id;
    let body = req.body;
    let query = `UPDATE mobiles SET name=$1,price=$2,brand=$3,ram=$4,rom=$5,os=$6 WHERE id=$7`;
    let params = [body.name,body.price,body.brand,body.ram,body.rom,body.os,id];
    client.query(query,params,function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in updation data");
        }
        else res.send(results);
    })
})

app.delete("/mobiles/:id",function(req,res){
    let id = +req.params.id;
    let query = `DELETE FROM mobiles WHERE id=$1`;
    client.query(query,[id],function(err,results){
        if(err){
            console.log(err);
            res.status(404).send("Error in deletion data");
        }
        else res.send(results);
    })
})