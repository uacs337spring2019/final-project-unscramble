// CSC 337 Final Project Word Scramble
// web service for bestreads.js
// service side for fetching in bestreads.html, must have books director
// in the same directory

const express = require("express"); const app = express();
app.use(express.static('public'));
console.log("web service started");

// reads data asynchronously from the passed in file name
// returns the contents of the file as a string
function read_file(file_name) {
    let fs = require('fs');
    let f = 0;

    try {  
        f = fs.readFileSync(file_name, 'utf8');
         
    } catch(e) {
        console.log('Error:', e.stack);
    }
    return f;
}



// uses the given number to open a file with
// that number in the name, opens and reads
// that file and returns the contents and number
// of leeter arragements in that file int he form
// of a dictionary
function getLetters(number){
    let filename = number + ".txt";
    let words = {"words":[], "letterCount": 0};
    fileContents = read_file(filename);
    fileContents = fileContents.split("\n");
    for (let i=0;i<fileContents.length;i++){
        words["words"].push(fileContents[i]);
        words["letterCount"] += 1;
    }

    return words;
}

app.get('/', function (req, res) { 
    res.header("Access-Control-Allow-Origin", "*");
    const queryParams = req.query;
    let number = queryParams.number;
    
    

    res.send(JSON.stringify(getLetters(number)));
    return;

    


})
app.listen(process.env.PORT);
