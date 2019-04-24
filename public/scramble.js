"use strict";
/*
Author: Riley campillo
scrambler.js contains the js code for 
the html web page scrambler.html.
The js code adds functionality so that
the user can guess which words
can be formed with the given letters
Section: CSC 337-001

*/

(function(){
    
    //GLOBAL VARIABLES
    let gameNumber = 1;
    let correctGuessedNumber = 0;
    let guessedList = [];


    //function that runs when page is loaded
    // sets up buttons, and first level screen
     /**
    * @param {void}
    * @returns {void}
    */
     window.onload = function(){

        getWords();
        let scrambleButton = document.getElementById("scramble");
        scrambleButton.onclick = getWords;

        let newGameButton = document.getElementById("new-game");
        newGameButton.onclick = newGame;

        let submitButton = document.getElementById("submit");
        submitButton.onclick = guess;  
    };


    function validate(guess){
        let regexpression = /^[a-z]+$/i;
        if (regexpression.test(guess)){
            return true;
        }
        else{
            alert("Not a valid input");
            return false;
        }
    }

    //function that runs when the guess button is pushed
    // uses a fetch to gether potential words
    // and compares what the user has inputed to
    // see if that guess is correct or incorrect
     /**
    * @param {void}
    * @returns {void}
    */
    function guess(){
        let url = "https://final-unscramble-4.herokuapp.com?number="+gameNumber; 
        let guessWord = document.getElementById("guess").value;
        if (validate(guessWord) == false){
            return;
        }
        for(let i = 0; i < guessedList.length; i++) {
            if (guessWord == guessedList[i]){
                alert("You already guessed that!");
                return;
            }
        }
        guessedList.push(guessWord);
      

        fetch(url)

            .then(checkStatus)
            .then(function(responseText) {
                let wordList = JSON.parse(responseText).words;
                
                for(let i = 0; i < wordList.length; i++) {
                    if (guessWord == wordList[i]){
                        correctGuessedNumber += 1;
                        let correctGuesses = document.getElementById("correct-guess-list");
                        let node = document.createTextNode(guessWord);
                        correctGuesses.prepend(document.createElement("br"));
                        correctGuesses.prepend(node);
                        if (correctGuessedNumber == JSON.parse(responseText).letterCount){
                            alert("You won the game by finding" + 
                                " all the possible words! The winning word: " + guessWord + "!");
                            newGame();
                            guessedList = [];
                        }
                        return;
                    }
                }
                    
                    let incorrectGuesses = document.getElementById("bad-guess-list");
                    let node = document.createTextNode(guessWord);
                    incorrectGuesses.prepend(document.createElement("br"));
                    incorrectGuesses.prepend(node);
                    console.log("incorrect");  
            })

            .catch(function(error) {
                if (error == "Error: 410: Gone"){
                    
                    error + " (There is no data for the indicated state/entry)";
                }
                else{
                    alert(error);
                }
        });

        
    }

    // function that runs when there is a new game to load
    // increments gameNumber and clears divs
     /**
    * @param {void}
    * @returns {void}
    */
    function newGame(){
        let incorrectGuesses = document.getElementById("bad-guess-list");
        let correctGuesses = document.getElementById("correct-guess-list");
        incorrectGuesses.innerHTML = "";
        correctGuesses.innerHTML = "";
        if (gameNumber == 5){
            gameNumber = 1;
        }
        else{
            gameNumber +=1;
        }

        getWords();

    }

    // function that runs when the scramble button is pushed
    // clears a div and adds new scrambled formation of the letters
     /**
    * @param {scrambledWord, string of letters to be scrambled}
    * @returns {scrambledWord.join(""), a list of letters joined to a string}
    */
    function scramble(scrambledWord){
        scrambledWord = scrambledWord.split("");
        let length = scrambledWord.length;
        for(let i = 0; i < length; i++) {
            let randIndex = Math.floor(Math.random() * (i + 1));
            let tmp = scrambledWord[i];
            scrambledWord[i] = scrambledWord[randIndex];
            scrambledWord[randIndex] = tmp;
        }
        let scrambledWordDiv = document.getElementById("display");
        scrambledWordDiv.innerHTML = scrambledWord.join("");
        return scrambledWord.join("");
    }

    //function that runs when page is loaded
     /**
    * @param {void}
    * @returns {void}
    */
    function getWords(){

        let url = "https://final-unscramble-4.herokuapp.com?number="+gameNumber; 

        fetch(url)

            .then(checkStatus)
            .then(function(responseText) {
                let response = JSON.parse(responseText);

                scramble(response.words[0]);
                return;   
            })
            .catch(function(error) {
                if (error == "Error: 410: Gone"){
                    
                    error + " (There is no data for the indicated state/entry)";
                }
                else{
                    alert(error);
                }
        });
    }

    
    // returns the response text if the status is in the 200s
    // otherwise rejects the promise with a message including the status
    //handles the voter query
     /**
    * @param {response}
    * @returns {void}
    */
    function checkStatus(response) { 
        if (response.status >= 200 && response.status < 300) {  
            return response.text();
        } else {  
            return Promise.reject(new Error(response.status+": "+response.statusText)); 
        } 
    }
    

}) ();
