function show_todo(){
        const task={
        "task": 'todo_list',
        "completed": false
    }
    fetch('/todo_list',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    }).then((res)=>{
        if(res.status===200)
            return res.json()
    }).then((todoList)=>{
        for(i=0;i<todoList.length;i++){
            make_element(todoList[i]);
        };
        document.querySelectorAll('.delete').forEach(item => item.addEventListener('click',delete_todo))
        document.querySelectorAll('.todoComplete').forEach(item => item.addEventListener('change',complete_todo))
    }).catch((err)=>{
        alert(err);
    })
}

document.querySelector('#todoBtn').addEventListener('click', function(event){
    event.preventDefault();
    const todo_task=document.querySelector('#taskInput').value;
    if(!todo_task.trim()){
        alert('Enter something in todo')
        return;
    }
    const todoPri=document.querySelector('#taskPriority');
    const todo_pri=todoPri.options[todoPri.selectedIndex].value;
    const task={
        "task": 'todo_insert',
        "completed": false,
        "todo": todo_task,
        "status": 0,
        "priority": todo_pri
    }
    fetch('/todo_insert',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    }).then((res)=>{
        if(res.status===200)
            return res.json()
    }).then((todo_task)=>{
        update_todo(todo_task)
        document.querySelector('#taskInput').value=''
    }).catch(err=>{
        alert(err)
    })
}
)

function update_todo(todoList){
    make_element(todoList);
    document.querySelectorAll('.delete').forEach(item => item.addEventListener('click',delete_todo))
    document.querySelectorAll('.todoComplete').forEach(item => item.addEventListener('change',complete_todo))
}

function delete_todo(){
    const task={
        "task": 'todo_delete',
        "completed": false,
        "todo_id": this.id
    }
    fetch('/todo_delete',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
    }).then(res=>{
        if(res.status===200)
            return res.json()
    }).then(()=>{
    after_delete(this.id);
    }).catch(err=>{
        alert(err);
        return;
    })
}

function complete_todo(){
    const statt=(this.checked)?1:0;
    const task={
        "task": 'todo_update',
        "completed": false,
        "todo_id": this.id,
        "status": statt
    }
    fetch('/todo_update',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(task)
    }).then(res=>{
        if(res.status===200)
            return res.json()
    }).then(()=>{
        change_chk(this.id,statt);
    }).catch(err=>{
        alert(err);
    })
}

function after_delete(element){
    const child=document.getElementById(element);
    child.remove()
}

function make_element(todoList){
    const div = document.createElement('div');
    let classes=(todoList.status===0)?'incomplete':'complete'
    let chked=(todoList.status===0)?'':'checked';

    if(todoList.priority==='high')
        div.setAttribute('class','high todo-item')
    else if(todoList.priority==='medium')
            div.setAttribute('class','medium todo-item')
    else
        div.setAttribute('class','low todo-item')
    
    div.setAttribute('id',`${todoList.id}`)
    div.innerHTML=`<h3 class='${classes}' id='T${todoList.id}'>${todoList.todo}</h3><div><input type='checkbox' class='todoComplete' id='${todoList.id}' ${chked}><span class='delete' id='${todoList.id}'>&#10008</span></div>`;
    
    document.querySelector('#todoList').appendChild(div)
}

function change_chk(element,statt){
    const ele=document.getElementById('T'+element);
    if(statt===1)
        ele.setAttribute('class','complete')
    else
        ele.setAttribute('class','incomplete')
}
show_todo()