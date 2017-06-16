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

//game setup
function startGame() {
    //set variables intial values
    cards = [[], []];
    faceUpCards = [];
    moveCount = 0;
    matchCount = 0;
    availableValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];

    //start timer
    startTime = stopWatch(0);

    //set HTML showing moves
    updateMoves(0);
    timer = setInterval(updateTime,1000);

    //get's all the cards being shown
    cardClassElements = document.getElementsByClassName("card");

    //creates cardDetails object and adds to cards array at same index in second array as the html element
    for (var i = 0, len = cardClassElements.length; i < len; i++) {
        var cardDetails = {
            cardHTMLElement: cardClassElements[i],
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

            reset: function(){
                this.cardValue = assignValue();
                this.isflipped = false;
                this.cardHTMLElement.classList.remove('flipped');
                this.isMatched = false;
                this.cardHTMLElement.classList.remove('matched');
                this.cardHTMLElement.innerHTML = "";
            }   

        };
        //Adds click listener and value to all card elements
        cardClassElements[i].addEventListener("click", function () {
            flipCard(this);
        });
        

        cards[0].push(cardClassElements[i]);
        cards[1].push(cardDetails);
    }

    document.getElementById("refreshIcon").addEventListener("click", function () { restartGame() });

}

//resets state of game and assigns new values to each card
function restartGame(){
    //reset variables
    startTime = stopWatch(0);
    moveCount = 0;
    matchCount = 0;
    availableValues = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
    faceUpCards = [];

    //update HTML
    updateMoves(0);
    timer = setInterval(updateTime,1000);

    //reset cards details
    for (var i = 0, len = cards[0].length; i < len; i++){
        cards[1][i].reset();
    }
}

//randomly hands out available values
function assignValue() {
    var random = Math.floor(Math.random() * (availableValues.length - 1));
    var valueToAssign = availableValues.splice(random, 1);
    return (valueToAssign[0]);
}

//calls flip on card object then checks match if two cards are faceup
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

//looks up card object based on html element
function getCardDetails(cardHTMLElement) {
    var indexOfDetails = cards[0].indexOf(cardHTMLElement);
    if (indexOfDetails > -1) {
        return (cards[1][indexOfDetails]);
    }
    return -1;
}

//checks if the face up cards match
//updates match of flips the cards back over
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

//stops timer, alerts user they won, and displays user stats
function win() {
    //stops timer
    window.clearInterval(timer);
    //pulls game durations from timer
    timeInS = document.getElementById("timer").innerHTML; 
    //Information pop-up
    alert("You Won in "+moveCount+"moves.\n It took "+ timeInS +" seconds.");
}

//checks to see if match count equals all possible matches
function checkWin() {
    return (matchCount >= cards[0].length / 2);
}

//increments movesCount by numToAdd & updates the HTML span showing num moves
function updateMoves(numToAdd) {
    moveCount += numToAdd;
    numMoves = document.getElementById("numMoves")
    numMoves.innerHTML = " Moves : " + moveCount;
    //call to update stars after move is incremented
    updateStars();
}

//determines the star ranking based on moves made and updates html span approapriately
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

//gets the timer span and upates it with the current duration
function updateTime(){
    durationInS = Math.floor(stopWatch(startTime)/(10*10*10));
    document.getElementById("timer").innerHTML = durationInS + " s";
}

//returns current time minus time argument; time in ms
function stopWatch(time){
    var d = new Date();
    var timeNow = d.getTime();
    return (timeNow-time);
}


