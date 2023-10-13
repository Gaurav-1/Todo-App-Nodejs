const express = require('express')
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const dirname=path.join(__dirname)
// home request
app.get('/',(req,res)=>{
    res.sendFile(dirname+'/FrontEnd/index.html')
})

//todo list request
app.post('/todo_list',(req,res)=>{
    list_read((err,data)=>{
        if(err){
            res.send(err)
            return;
        }
        todo_list=data;
        res.status(200).end(JSON.stringify(todo_list))
    })
})

//todo insert
app.post('/todo_insert',(req,res)=>{
    const new_todo=req.body.todo;
    const new_status=req.body.status;
    const new_pri= req.body.priority;
    list_insert(new_todo,new_status,new_pri,(err,data)=>{
        if(err){
            res.send(err)
            return;
        }
        res.status(200).end(JSON.stringify(data))
    });
})

//todo update
app.post('/todo_update',(req,res)=>{
    const old_todo=req.body.todo_id;
    const statt=req.body.status;
    status_todo(old_todo,statt,(err,data)=>{
        if(err){
            res.json(err)
            return;
        }
        res.json(data)
    })
})

// todo delete
app.post('/todo_delete',(req,res)=>{
    const old_todo=req.body.todo_id;
    delete_todo(old_todo,(err,data)=>{
        if(err){
            res.json(err)
            return;
        }
        res.json(data);
    })
})

app.get('/todo_script.js',(req,res)=>{
    res.sendFile(dirname+'/Script/todo_script.js')
})

app.listen(3000,(req,res)=>{
    console.log('Hearing port 3000')
})

function list_read(callback){
    fs.readFile(dirname+'/DB/data.json',(err,data)=>{
        if(err){
            console.log('Database error')
            callback(err)
            return;
        }
        if(data.length==0){
            data="[]"
        }
        try{
            data=JSON.parse(data);
            callback(null,data)
        }
        catch(err){
            callback(err.message)
            return
        }
    })
}

function list_insert(new_todo,todo_status,todo_priority,callback){
    list_read((err,data)=>{
        if(err){
            callback(err)
            return;
        }
        try{
            const uid=uuid.v4();
            new_data={id:`${uid}`, todo:`${new_todo}`, status:todo_status, priority:`${todo_priority}`}
            data.push(new_data)
            fs.writeFile(dirname+'/DB/data.json',JSON.stringify(data,null,2),(err)=>{
                if(err){
                    callback('Unable to insert')
                    return;
                }
                callback(null,new_data)
                return;
            })
        }
        catch(err){
            callback(err)
            return;
        }
        
    })
}

function delete_todo(old_todo,callback){
    list_read((err,data)=>{
        if(err){
            callback(err)
            return;
        }
        let arr=data.filter(map=>map.id!==old_todo)
        fs.writeFile(dirname+'/DB/data.json',JSON.stringify(arr,null,2),(err)=>{
            if(err){
                callback(err)
                return
            }
            callback(null,data)
            return
        })
    })
}

function status_todo(old_todo,statt,callback){
    list_read((err,data)=>{
        if(err){
            callback(err)
            return;
        }
        let i=0;
        while(data[i].id!==old_todo){
            i++;
        }
        data[i].status=statt
        fs.writeFile(dirname+'/DB/data.json',JSON.stringify(data,null,2),(err)=>{
            if(err){
                callback(err)
                return
            }
            callback(null,data)
            return
        })
    })
}