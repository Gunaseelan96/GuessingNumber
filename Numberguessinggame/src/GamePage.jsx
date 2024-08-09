import React, { useEffect, useState } from "react";
import "./GamePage.css";
import { Link } from "react-router-dom";

function Gamepage(){

    const [container, setContainer] = useState(true);    //div change from start button to username field 

    const [user, setUser] = useState("null");   //User input Name
    const [randoms, setRandoms]=useState("");   //storing random number
    const [input, setInput] = useState("");     //User number input
    const [flag, setFlag] = useState(true);    //div change from username field to user number input
    const [move, setMove] = useState(0);       //Variable to store Move count
    const [time, setTime] = useState("");  //Variable to store time

    // const [val, setVal]=useState("");  //Setting the value for temp
    // const [val2, setVal2]=useState("-");
    const [errmsg, setErrmsg]=useState("");  //For errmsg in name page
    const [result, setResult]=useState("");  //Final result
    // const [resultop, setResultop]=useState("");   //Final result in txt
    const [clue, setClue]=useState("");

    const [startTime, setStartTime]=useState(0);
    const [elapsedTime, setElapsedTime]=useState(`00:00:00`);
    const [isGameStarted, setIsGameStarted]=useState(false);
    
    const [win, setWin] = useState(true);
    const [finalTime, setFinalTime]=useState(0);

    //Function to generate unique 4 digit number
    const generateUniqueRandomNumber = () => {
        let digits = [];
        while (digits.length < 4) {
          let digit = Math.floor(Math.random() * 10);
          if (!digits.includes(digit)) {
            digits.push(digit);
          }
        }
        return digits.join('');
      };

    //Funtion to compare UserNumber with RandomNumber and it will return the result
    const compareNumbers = (userNumber, randomNumber) => {

        // const userDigits = userNumber.split('');
        const userDigits=[...userNumber];
        // console.log(`user :  ${userDigits}`);

        // const randomDigits = randomNumber.split('');
        const randomDigits = [...randomNumber];
        // console.log(`random :  ${randomDigits}`);
        let comparisonResult = '';
        for (let i = 0; i < 4; i++) {
          if (userDigits[i] === randomDigits[i]) {
            comparisonResult += '+';
          } else if (userDigits.includes(randomDigits[i])) {
            comparisonResult += '-';
          } else {
            comparisonResult += '_';
          }
        }
        return comparisonResult;
      };


    const click = () =>{
        if(user!=="null"){
            setRandoms(generateUniqueRandomNumber()); 
            setFlag(false);  
            setStartTime(new Date().getTime());
            setIsGameStarted(true);
        }
         
         else{
         setErrmsg("Please Provide Your Name");
         }
    }

    //Function is used to check the user input number and return the result 
    const check = (e) =>{
        
        //updating the move count
        setMove(move+1);
        setClue("Result Clue:  ");
        // const arrrandom=[...randoms];
        // console.log(arrrandom);

        // const arruser=[...input];
        // console.log(arruser);

        e.preventDefault();
        if (input.length !== 4 || isNaN(input)) {
        alert('Please enter a valid 4-digit number.');
        } 
        else {
        const comparisonResult = compareNumbers(input, randoms);
        // console.log(comparisonResult);
        setResult(comparisonResult);
        if(comparisonResult==="++++"){
            // console.log("final won");
            // console.log(move);
            // setResultop("final won");
            // console.log(elapsedTime);
            setFinalTime(elapsedTime);
            setWin(false);
          }
        else{
            // console.log("not final won");
            // setResultop("");
        }
        }
    }

    // const finals=()=>{}
    const mainmenu=()=>{
      window.location.reload();
    }

    useEffect(()=>{
        if(isGameStarted){
          const intervalid = setInterval(()=>{
             const currentTime = new Date().getTime();
             const elapsed = currentTime-startTime;
    
             const hours = Math.floor(elapsed/3600000);
             const minutes = Math.floor((elapsed%3600000)/60000);
             const seconds = Math.floor((elapsed % 60000)/1000);
    
            setElapsedTime(hours.toString().padStart(2,'0')+":"+minutes.toString().padStart(2,'0')+":"+seconds.toString().padStart(2,'0'));
           },1000);
        return() => clearInterval(intervalid);
        }
        }, [isGameStarted, startTime]);

return(
    <>
        <div id="heading">
        <h3>Guessing Number Game</h3>
         </div>
        
    {win ?
        <div>
        {container ? 
            
            <div id="container1">
                 <div id="startdiv">
                 Click<button type="button" name="start" id="startbtn" onClick={(e)=>setContainer(false)}>Start</button>Button to Start New Guessing Number Game
                 </div>
            </div>
        :
            <div id="container2">
    
                 {flag ? 
                    <div id="playername">
                    <input type="text" name="playername" id="namefield"  onChange={(e)=>setUser(e.target.value)} placeholder="Enter Your Name*" />
                    <button onClick={click} id="Enter">Enter</button>
                    <p name="errname" id="nameerr">{errmsg}</p>
                    </div>
                 :    
                    <div id="playgame">
                    <input type="number" name="playgame" id="inputfield" onChange={(e)=>setInput(e.target.value)} maxLength={4} placeholder="Enter Your 4 digit guessing number" />
                    <button onClick={check} id="Check">Check</button>
                    <br />
                    <p id="resultPreview"> {clue}<span id="resultspan">{result}</span></p><br /><br />

                    <p id="details"> 
                    1. If a digit You Provide exists in the computer in the same place, the computer will report "+".<br />
                    2. If a digit You Provide exists in the computer but not in the same place, the computer will report "-". <br />
                    3. If a digit You Provide not exist in the computer, the computer will report "_". <br />
                    4. This Clues will be show based on the computer number.</p>
                   
                    </div>
                }
            </div>
        }
        </div>
    :

        <div id="result">
        <p>{user}!, You Won this in {finalTime} Timings with {move} moves </p>
        <button id="startbt" onClick={mainmenu}>New Game</button>
        </div>
    }
    </>
)}
export default Gamepage;