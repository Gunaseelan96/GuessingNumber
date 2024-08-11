import React, { useEffect, useState } from "react";
import "./GamePage.css";
import { Link } from "react-router-dom";
import { firebase } from "./firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { getDatabase, ref, get } from "firebase/database";

function Gamepage() {
  let [allData, setAllData] = useState([])//read data
  const ref = collection(firebase, "USERDATA");
  const [container, setContainer] = useState(true);    //div change from start button to username field 
  const [highscore, setHighscore] = useState([]);
  const [second, setSecond] = useState();
  const [finalSecond, setFinalSecond] = useState();

  const [user, setUser] = useState("null");   //User input Name
  const [randoms, setRandoms] = useState("");   //storing random number
  const [input, setInput] = useState("");     //User number input
  const [flag, setFlag] = useState(true);    //div change from username field to user number input
  const [move, setMove] = useState(0);       //Variable to store Move count
  const [time, setTime] = useState("");  //Variable to store time
  const [newBest, setNewBest] = useState(false);
  const [newBesttxt, setNewBesttxt] = useState("All Time New Best Score!!!");

  
  const [errmsg, setErrmsg] = useState("");  //For errmsg in name page
  const [result, setResult] = useState("");  //Final result
  const [clue, setClue] = useState("");

  const [startTime, setStartTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(`00:00:00`);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const [win, setWin] = useState(true);
  const [finalTime, setFinalTime] = useState(0);


  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(ref);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));  // [{},{},{}}]
      setAllData(data);
      console.log(data)
    } catch (error) {
      console.error("Error fetching data from Firestore:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const checkHighScore = () => {
    const minTiming = Math.min(...allData.map(data => data.seconds));
    // console.log('mint : ' + minTiming);
    const minarrObject = allData.filter(data => data.seconds === minTiming);
    const minattObject = Math.min(...minarrObject.map(data => data.Attempt));
    const minObject = minarrObject.find(data => data.Attempt === minattObject);
    console.log("arrobj ");
    console.log(minarrObject);
    console.log("min att ");
    console.log(minattObject);
    console.log("minobj");
    console.log(minObject);
    setHighscore(minObject);
    // console.log(minObject);
  }

  const newBestSc=()=>{
    if(highscore.seconds>second){
      setNewBest(true);
      console.log("New High "+ user, elapsedTime, second, move+1);
    }
  }

  //Function to generate unique 4 digit number
  const generateUniqueRandomNumber = () => {
    let digits = [];
    while (digits.length < 4) {
      let digit = Math.floor(Math.random() * 10);
      if (!digits.includes(digit)) {
        digits.push(digit);
      }
    }
    console.log(digits.join(""))
    return digits.join('');

  };

  //Funtion to compare UserNumber with RandomNumber and it will return the result
  const compareNumbers = (userNumber, randomNumber) => {

    const userDigits = [...userNumber];
    const randomDigits = [...randomNumber];
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


  const click = () => {
    checkHighScore();
    if (user !== "null") {
      setRandoms(generateUniqueRandomNumber());
      setFlag(false);
      setStartTime(new Date().getTime());
      setIsGameStarted(true);
    }

    else {
      setErrmsg("Please Provide Your Name");
    }
  }

  //Function is used to check the user input number and return the result 
  const check = (e) => {

    //updating the move count
    setMove(move + 1);
    setClue("Result Clue:  ");
   
    e.preventDefault();
    if (input.length !== 4 || isNaN(input)) {
      alert('Please enter a valid 4-digit number.');
    }
    else {
      const comparisonResult = compareNumbers(input, randoms);
      
      setResult(comparisonResult);
      if (comparisonResult === "++++") {
       
        setFinalTime(elapsedTime);
        setFinalSecond(second);
        
        setWin(false);

        newBestSc();
        if (win) {
          console.log(user, elapsedTime, move + 1, second)
          let data = {
            user: user,
            time: elapsedTime,
            Attempt: move + 1,
            seconds: second
          }
       if(highscore.seconds===second && highscore.Attempt===move+1){
        setNewBest(true);
        setNewBesttxt("Its Same as Best Score, Try little More");
        console.log( "Already present");
       }
       else{
        try {
          addDoc(ref, data)
        }
        catch (err) {
          console.log(err)
        }
       }
        }
      }
      else {
      }
    }
  }

  // const finals=()=>{}
  const mainmenu = () => {
    window.location.reload();
  }

  useEffect(() => {
    if (isGameStarted) {
      const intervalid = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsed = currentTime - startTime;

        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        setSecond((hours*3600) + (minutes*60) + seconds );
        setElapsedTime(hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0'));

      }, 1000);
      return () => clearInterval(intervalid);
    }
  }, [isGameStarted, startTime]);

  return (
    <>
      <div id="heading">
        <h3>Guessing Number Game</h3>
      </div>

      {win ?
        <div>
          {container ?

            <div id="container1">
              <div id="startdiv">
                Click<button type="button" name="start" id="startbtn" onClick={(e) => setContainer(false)}>Start</button>Button to Start New Guessing Number Game
              </div>
            </div>
            :
            <div id="container2">

              {flag ?
                <div id="playername">
                  <input type="text" name="playername" id="namefield" onChange={(e) => setUser(e.target.value)} placeholder="Enter Your Name*" />
                  <button onClick={click} id="Enter">Enter</button>
                  <p name="errname" id="nameerr">{errmsg}</p>
                </div>
                :
                <div id="playgame">
                  
                  <input type="number" name="playgame" id="inputfield" onChange={(e) => setInput(e.target.value)} maxLength={4} placeholder="Enter Your 4 digit guessing number" />
                  <button onClick={check} id="Check">Check</button>
                  <br />
                  <p id="resultPreview"> {clue}<span id="resultspan">{result}</span></p><br /><br /> 
                  <br /><h4>All Time Best Score</h4>
                  <h5> Name : {highscore.user}, Attemps : {highscore.Attempt}, Timings : {highscore.time} </h5>
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

        <div>{newBest?

          <div id="resulthigh">
            <p>Congratulation!!! {newBesttxt}</p>
          <p>{user}!, You Won this in {finalTime} Timings with {move} moves </p>
          <button id="startbt" onClick={mainmenu}>New Game</button>
        </div>
        :  
        <div id="result">
          <p>Congratulation!!! {user}!, You Won this in {finalTime} Timings with {move} moves </p>
          <button id="startbt" onClick={mainmenu}>New Game</button>
        </div>
      }</div>

      }
    </>
  )
}
export default Gamepage;
