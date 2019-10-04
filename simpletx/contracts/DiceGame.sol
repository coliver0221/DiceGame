pragma solidity >=0.4.22 <0.6.0;

contract DiceGame{

    struct Bet{
      uint8  currentBet; // this is target, used to set a new bet
      bool  isBetSet; // default value is false
      uint8  destiny; // contains the number when you roll the dice
     }

    mapping (address => Bet) private bets;

    uint8 private randomFactor; // used to randomize results

    event NewBetIsSet(address bidder, uint8 currentBet);
    event GameResult(address bidder, uint8 currentBet, uint8 destiny);

    constructor () public {
        randomFactor = 10;
    }

    function getNewBet () public returns(uint8) {
        // check if a bet is already set for the player
        require(bets[msg.sender].isBetSet == false, "Bet has been set");
        // set the bet
        bets[msg.sender].isBetSet = true;
        // get random number and set the current bet
        bets[msg.sender].currentBet = random();
        randomFactor += bets[msg.sender].currentBet;
        emit NewBetIsSet(msg.sender, bets[msg.sender].currentBet);
        return bets[msg.sender].currentBet;
    }

    function roll() public payable returns(address, uint8, uint8) {
        // check if the bet is set  for the player
        require(bets[msg.sender].isBetSet == true, "Bet has not been set");
        // set destiny (roll the dice)
        bets[msg.sender].destiny = random();
        randomFactor += bets[msg.sender].destiny;
        bets[msg.sender].isBetSet = false;
        // check result
        if(bets[msg.sender].destiny == bets[msg.sender].currentBet){
            //msg.sender.transfer(100000000000000); // 0.00001 ether
        }
        emit GameResult(msg.sender, bets[msg.sender].currentBet, bets[msg.sender].destiny);
        return (msg.sender, bets[msg.sender].currentBet, bets[msg.sender].destiny);
    }

    function random() private view returns (uint8) {
        uint256 blockValue = uint256(blockhash(block.number-1 + block.timestamp));
        blockValue = blockValue + uint256(randomFactor);
        return uint8(blockValue%5) + 1;
    }

    function isBetSet () public view returns (bool) {
        return bets[msg.sender].isBetSet;
    }

    function getBet () public view returns (uint8) {
        require(bets[msg.sender].isBetSet == true, "Bet has not been set");
        return bets[msg.sender].currentBet;
    }

}