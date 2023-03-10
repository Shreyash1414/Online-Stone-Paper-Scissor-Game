const playerName= prompt("Enter Your Name:");
let roomId="";
const url_string = window.location.href;
var url = new URL(url_string);
var mode = url.searchParams.get("mode");
let firstPlayer=false;
let secondPlayer=false;
var choice="";

// connect to the socket

const socket = io.connect("http://localhost:3000");

if(mode==="join")
{
    roomId=prompt("Enter the Room Id:");
    socket.emit('joinGame',{name:playerName,roomId:roomId});
    
}

if(mode==="friend")
{
    firstPlayer=true;
    document.getElementsByClassName('asa')[0].setAttribute("style", "display:initial;");
    document.getElementsByClassName('wrapper')[0].setAttribute("style", "display:flex;");
    document.getElementsByClassName('header')[0].setAttribute("style", "display:none;");
    document.getElementsByClassName('container')[0].setAttribute("style", "display:none;");
    socket.emit('createRoom',{name:playerName});
}

socket.on('newGame',(data)=>{
    roomId=data.roomId;
    // console.log("The Room Id is:"+roomId);
    document.getElementById('roomId').innerHTML="Room ID:  "+roomId;

})

socket.on('player1',(data)=>{
    transform(data);
});

socket.on('player2',(data)=>{
    transform(data);
});

const transform=(data)=>{
    document.getElementsByClassName('asa')[0].setAttribute("style", "display:none;");
    document.getElementsByClassName('wrapper')[0].setAttribute("style", "display:none;");
    document.getElementsByClassName('header')[0].setAttribute("style", "display:initial;");
    document.getElementsByClassName('container')[0].setAttribute("style", "display:visible;");
    document.getElementById('p1').innerHTML=data.player1Name;
    document.getElementById('p2').innerHTML=data.player2Name;
};


// Send Choice to the server

var signs =["stone","paper","scissor"];
var score1=0;
var score2=0;

var temp = Array.from(document.getElementsByClassName('click'));
temp.forEach(box=>{
    box.addEventListener('click',function handleClick(event){
        choice=event.target.name;

        if(mode=="friend")
        {
            socket.emit('choice1',{choice:choice,roomId:roomId});
        }
        if(mode=="join")
        {
            socket.emit('choice2',{choice:choice,roomId:roomId});
        }
    })
})


// Get Other pc choice

socket.on('otherchoice1',(data)=>{
        doit(data);

})

socket.on('otherchoice2',(data)=>{
    doit(data);

})

const doit=(data)=>{
    let winner="";
    let result="";
    document.getElementById("userImg").src="./assets/img/"+data.Gchoice2+".png";
    document.getElementById("compImg").src="./assets/img/"+data.Gchoice1+".png";

    if((data.Gchoice1=="stone" && data.Gchoice2=="paper")|| (data.Gchoice1=="paper" && data.Gchoice2=="stone"))
    {
        winner="paper";
        verdict="Paper Covers Stones."
    }
    else if((data.Gchoice1=="scissor" && data.Gchoice2=="paper")|| (data.Gchoice1=="paper" && data.Gchoice2=="scissor"))
    {
        winner="scissor";
        verdict="Scissor Cuts Paper.";
    }
     else if((data.Gchoice1=="stone" && data.Gchoice2=="scissor")|| (data.Gchoice1=="scissor" && data.Gchoice2=="stone"))
    {
        winner="stone";
        verdict="Stone breaks Scissor."
    } 
    else if(data.Gchoice1==data.Gchoice2)
    {
        verdict="Draw";
        winner="Draw";
    }

    if(data.Gchoice1==winner)
    {
        score1++;
        result=document.getElementById('p1').innerText;
        

    }
    else if(data.Gchoice2==winner)
    {
        score2++;
        result=document.getElementById('p2').innerText;

    }

    document.querySelector("#verdict").innerHTML=verdict;
    document.querySelector("#result").innerHTML=result+" wins";
    document.querySelector("#comp").innerHTML=score1;
    document.querySelector("#user").innerHTML=score2;



}