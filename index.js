const express = require('express');
const app = express();
const randomstring = require('randomstring');

const server = app.listen(3000);
console.log("Server Listning at port 3000....")

app.use(express.static('public'));



// All Players info array
let players={};
// Web Sockets Portion



//Game Variables 
let choice1="";
let choice2="";

const socket = require('socket.io');
const io = socket(server);

io.sockets.on('connection', function(socket){
    console.log("We Have a new Client :"+ socket.id);

    // Creating a New room
    socket.on('createRoom',createRoom);
    function createRoom(data)
    {
        const roomId = randomstring.generate({length:4});
        socket.join(roomId);
        players[roomId]=data.name;
        socket.emit("newGame",{roomId:roomId})

        console.log("New Room Created with name:"+data.name);
    }

    // Joining The game

    socket.on('joinGame',joinGame);
    function joinGame(data){
        socket.join(data.roomId);
        socket.to(data.roomId).emit('player2',{player2Name:data.name,player1Name:players[data.roomId]});
        socket.emit('player1',{player1Name:data.name,player2Name:players[data.roomId]});
    }

    // Getting The Answers
  

    socket.on('choice1', gotChoice1);
    function gotChoice1(data)
    {
        console.log("The Choice Entered By Player1"+data.choice);
        choice1=data.choice;
        // socket.to(data.roomId).emit('otherchoice',{other:choice1});

        if(choice2!="")
        {
            console.log("Im in 1");
            console.log("The Choice Entered By Player2"+choice1+" "+choice2+" "+data.roomId);
            let temp1=choice1;
            let temp2=choice2;
            choice1="";
            choice2="";
            socket.to(data.roomId).emit('otherchoice2',{Gchoice1:temp2,Gchoice2:temp1});
            socket.emit('otherchoice1',{Gchoice1:temp1,Gchoice2:temp2});
        }

    }

    socket.on('choice2',gotChoice2);
    function gotChoice2(data)
    {
        choice2=data.choice;
        // console.log("The Choice Entered By Player2"+choice1+" "+choice2);
        // socket.to(data.roomId).emit('otherchoice',{other:choice2})

        if(choice1!="")
        {
            console.log("The Choice Entered By Player2"+choice1+" "+choice2+" "+data.roomId);
            let temp1=choice1;
            let temp2=choice2;
            choice1="";
            choice2="";
            console.log("Im in 2");
            socket.to(data.roomId).emit('otherchoice2',{Gchoice1:temp1,Gchoice2:temp2});
            socket.emit('otherchoice1',{Gchoice1:temp2,Gchoice2:temp1});
        }

    }
})