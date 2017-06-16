//variables declarations
var cards, faceUpCards, moveCount, matchCount, availableValues, startTime, timer;
var iconPaths = [
    'assets\\icons\\001-building.svg',
    'assets\\icons\\002-shape-1.svg',
    'assets\\icons\\003-leaf-shape.svg',
    'assets\\icons\\004-sun-ecological-power.svg',
    'assets\\icons\\005-sign.svg',
    'assets\\icons\\006-black.svg',
    'assets\\icons\\007-transport.svg',
    'assets\\icons\\008-black-2.svg'
];

startGame();

/**
* @description sets initial values for global conditions
*/
function resetConditions(){
    //set variables intial values
    moveCount = 0;
    matchCount = 0;
    availableValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    faceUpCards = [];

    //start timer
    startTime = stopWatch(0);
    timer = setInterval(updateTime,1000);

    //set HTML showing moves
    updateMoves(0);
}//end reserConditions

/**
* @description creates an object for cardDetails
* @param {object} element html element of class card
* @returns {object} assigned details of card
*/
function newCardObject(element){
    var cardDetails = {
        cardHTMLElement: element,
        cardValue: assignValue(),
        isMatched: false,
        isflipped: false,
        //updates card details when card is flipped
        flipCard: function () {
            this.cardHTMLElement.classList.toggle('flipped');
            this.cardHTMLElement.innerHTML = this.isflipped ? "" : '<img src=' + iconPaths[(this.cardValue - 1)] + '>';
            this.isflipped = this.isflipped ? false : true;

        },
        //updates card details when card is matched
        match: function () {
            this.isMatched = true;
            this.cardHTMLElement.classList.add('matched')
        },
        //resets the card details and html
        reset: function(){
            this.cardValue = assignValue();
            this.isflipped = false;
            this.cardHTMLElement.classList.remove('flipped');
            this.isMatched = false;
            this.cardHTMLElement.classList.remove('matched');
            this.cardHTMLElement.innerHTML = "";
        }   
    };
    return(cardDetails);
}

/**
* @description sets initial values and assigns event listeners
*/
function startGame() {
    //create card array
    cards = [[], []];
    //setConditions for new game
    resetConditions();

    //get's all the cards elements from the DOM
    var cardClassElements = document.getElementsByClassName("card");

    //creates cardDetails object and adds to cards array at same index in second array as the html element
    for (var i = 0, len = cardClassElements.length; i < len; i++) {
        cardDetails = newCardObject(cardClassElements[i]);

        //Adds click listener and value to all card elements
        cardClassElements[i].addEventListener("click", function () {
            flipCard(this);
        });
        
        //adds new pair to the double array at next index in each respectively 
        cards[0].push(cardClassElements[i]);
        cards[1].push(cardDetails);
    }
    //Adds click listner to refreshIcon
    document.getElementById("refreshIcon").addEventListener("click", function () { restartGame() });

}


/**
* @description resets state of game and assigns new values to each card
*/
function restartGame(){
    //reset variables
    resetConditions();
    //for each card reset cards details
    for (var i = 0, len = cards[0].length; i < len; i++){
        cards[1][i].reset();
    }
}

/**
* @description creates an object for cardDetails
* @returns {number} value of card used for match comparison
*/
function assignValue() {
    var random = Math.floor(Math.random() * (availableValues.length - 1));
    var valueToAssign = availableValues.splice(random, 1);
    return (valueToAssign[0]);
}

/**
* @description calls flip on card object then checks match if two cards are faceup
*/
function flipCard(cardHTMLElement) {
    var card = getCardDetails(cardHTMLElement);
    if (!card.isMatched) {
        card.flipCard();
        faceUpCards.push(card);
        //add short delay between flip and check to animate
        if (faceUpCards.length > 1) {
            checkMatch();
        }
    }
}

/**
* @description looks up card object based on html element
* @param {object} cardHTMLElement element of class card 
* @returns {object} assigned card details associated with html element of class card
*/
function getCardDetails(cardHTMLElement) {
    var indexOfDetails = cards[0].indexOf(cardHTMLElement);
    if (indexOfDetails > -1) {
        return (cards[1][indexOfDetails]);
    }
    return -1;
}

/**
* @description checks if the face up cards match then updates match of flips the cards back over
*/
function checkMatch() {
    //removes cards from list of face up cards
    var cardOne = faceUpCards.pop();
    var cardTwo = faceUpCards.pop();
    //if match update card details and match count 
    if (cardOne !== cardTwo && cardOne.cardValue == cardTwo.cardValue) {
        cardOne.match();
        cardTwo.match();
        matchCount++;
        if (checkWin()) { win() }
    } else { //else flip cards back over
        //adds short delay between flip and check to animate
        var delayMilliS = 1000;
        setTimeout(function () {
            cardOne.flipCard();
            cardTwo.flipCard();
        }, delayMilliS);
    }
    //increments moves by 1
    updateMoves(1);
}

/**
* @description stops timer, alerts user they won, and displays user stats
*/
function win() {
    //stops timer
    window.clearInterval(timer);
    //pulls game durations from timer
    timeInS = document.getElementById("timer").innerHTML; 
    //Information pop-up
    alert("You Won in "+moveCount+"moves.\n It took "+ timeInS +".\n\nIf you'd like to play again simply hit the restart button");
}

/**
* @description checks to see if match count equals all possible matches
*/
function checkWin() {
    return (matchCount >= cards[0].length / 2);
}

/**
* @description increments movesCount by numToAdd & updates the HTML span showing num moves
* @param {number} numToAdd 
*/
function updateMoves(numToAdd) {
    moveCount += numToAdd;
    numMoves = document.getElementById("numMoves")
    numMoves.innerHTML = " Moves : " + moveCount;
    //call to update stars after move is incremented
    updateStars();
}

/**
* @description determines the star ranking based on moves made and updates html span approapriately
*/
function updateStars(){
    starString='Rating : ***';
    if (moveCount > 9 && moveCount < 14){
        starString=starString.slice(0,-1);
    } else if (moveCount > 13){
        starString=starString.slice(0,-2);
    }
    stars = document.getElementById("stars")
    stars.innerHTML = starString;
}

/**
* @description gets the timer span and upates it with the current duration
*/
function updateTime(){
    durationInS = Math.floor(stopWatch(startTime)/(10*10*10));
    document.getElementById("timer").innerHTML = durationInS + " s";
}

/**
* @description gives the difference between input time and current time
* @param {number} time assumes to be time in past or 0
* @returns {object} returns time difference in ms
*/
function stopWatch(time){
    var d = new Date();
    var timeNow = d.getTime();
    return (timeNow-time);
}


