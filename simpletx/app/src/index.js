import Web3 from 'web3';
import metaDiceGame from '../../build/contracts/DiceGame.json';

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

  function getNewBet(){
    console.log("in getNewBet function");
    metaContract.methods.getNewBet().send({
      from: defaultAccount,
    }).then(result => {
      // console.log(result.events.NewBetIsSet.returnValues.currentBet);
      $("#newBet").text("Your target is : " + result.events.NewBetIsSet.returnValues.currentBet);
      $("#message").text("Bet is set, please roll the dice!");
    });
  };

  function roll(){
    console.log("in roll function");
    metaContract.methods.roll().send({
      from: defaultAccount,
    }).then(result => {
      // console.log("curr_bet : " + result.events.GameResult.returnValues.currentBet);
      // console.log("destiny : " + result.events.GameResult.returnValues.destiny);
      let curr_bet = result.events.GameResult.returnValues.currentBet;
      let destiny = result.events.GameResult.returnValues.destiny;
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
})();