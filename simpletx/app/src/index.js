import Web3 from 'web3';
import metaDiceGame from '../../build/contracts/DiceGame.json';

import img_dice_1 from './img/001.png';
import img_dice_2 from './img/002.png';
import img_dice_3 from './img/003.png';
import img_dice_4 from './img/004.png';
import img_dice_5 from './img/005.png';
import img_dice_6 from './img/006.png';

(async () => {
  // get network
  const provider = new Web3('http://localhost:7545');
  // get contract
  const networkID = await provider.eth.net.getId();
  const deployNetwork = metaDiceGame.networks[networkID];
  const metaContract = new provider.eth.Contract(
    metaDiceGame.abi, 
    deployNetwork.address
  );
  console.log("Account address : " + deployNetwork.address);
  $("#accountAddress").html("Your Account : " + deployNetwork.address );
  // get account
  const accounts = await provider.eth.getAccounts();
  const defaultAccount = accounts[1];
  console.log("acc[0] address : " + accounts[0]);
  document.getElementById("getNewBet_btn").addEventListener('click', () => {
    getNewBet();
  });
  document.getElementById("roll_btn").addEventListener('click', () =>{
    roll();
  });
  // init dice image
  document.getElementById("img_bet").src=img_dice_1;
  document.getElementById("img_destiny").src=img_dice_1;

  function getNewBet(){
    console.log("in getNewBet function");
    metaContract.methods.getNewBet().send({
      from: defaultAccount,
    }).then(async result => {
      await rolling("img_bet");
      setImg("img_bet", result.events.NewBetIsSet.returnValues.currentBet);
      $("#newBet").text("Your target is : " + result.events.NewBetIsSet.returnValues.currentBet);
      $("#message").text("Bet is set, please roll the dice!");
    });
  };

  function roll(){
    console.log("in roll function");
    metaContract.methods.roll().send({
      from: defaultAccount,
    }).then(async result => {
      let curr_bet = result.events.GameResult.returnValues.currentBet;
      let destiny = result.events.GameResult.returnValues.destiny;
      await rolling("img_destiny");
      setImg("img_destiny", destiny);
      console.log(curr_bet);
      console.log(destiny);
      if(curr_bet==destiny){
        $("#result").text("You win!");
      }
      else{
        $("#result").text("Bad lock, you rolled a " + destiny);
      }
      $("#message").text("Set New Bet");
    })
  }

  async function rolling(id){
    for(var i=0; i<10; i++){
      var index = Math.floor(Math.random()*6+1);
      // delay 500 ms
      // setTimeout(setImg(id, index), 500);
      await delay(100);
      // set temp img
      await setImg(id, index.toString());
    }
  }

  var delay = function(s){
    return new Promise(function(resolve,reject){
     setTimeout(function(){
       resolve(s);
       console.log("in delay function");
     },s); 
    });
  };

  var setImg = function(id, index){
    return new Promise(function(resolve, reject){
      resolve(id);
      console.log("in setImg function");
      console.log("id : " + id);
      console.log("index : " + index);
      switch(index){
        case '1': 
          console.log("in switch case 1");
          document.getElementById(id).src=img_dice_1;
          break;
        case '2': 
          console.log("in switch case 2");
          document.getElementById(id).src=img_dice_2;
          break;
        case '3':
          console.log("in switch case 3"); 
          document.getElementById(id).src=img_dice_3;
          break;
        case '4':
          console.log("in switch case 4"); 
          document.getElementById(id).src=img_dice_4;
          break;
        case '5':
          console.log("in switch case 5"); 
          document.getElementById(id).src=img_dice_5;
          break;
        case '6':
          console.log("in switch case 6"); 
          document.getElementById(id).src=img_dice_6;
          break;
      }
    });
  }

})();