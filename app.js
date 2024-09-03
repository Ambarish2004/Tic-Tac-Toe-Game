let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let player1Input = document.querySelector("#player1");
let player2Input = document.querySelector("#player2");

let turnO = true;

let winPatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
       if(turnO){
            box.innerText = "O";
            turnO = false;
       }
       else{
            box.innerText = "X";
            turnO = true;
       }
       box.disabled = true;

       checkWinner();
    });
});

const disableBoxes = () => {
    for(let box of boxes){
        box.disabled = true;
    }
};

const showWinner = (winner) => {
    let winnerName = winner === "O" ? player1Input.value : player2Input.value;
    msg.innerText = `Congratulations, Winner is ${winnerName}`;
    msg.classList.remove("hide");
    msgContainer.classList.remove("hide");
    disableBoxes();
    
    // Save the game result to the database
    let player1 = player1Input.value;
    let player2 = player2Input.value;
    saveGameResult(player1, player2, winner);
};

const checkWinner = () => {
    for(let pattern of winPatterns) {
        let pos1val = boxes[pattern[0]].innerText;
        let pos2val = boxes[pattern[1]].innerText;
        let pos3val = boxes[pattern[2]].innerText;

        if(pos1val !== "" && pos2val !== "" && pos3val !== ""){
            if(pos1val === pos2val && pos2val === pos3val){
                console.log("Winner", pos1val);
                showWinner(pos1val);
                return;
            }
        }
    }
};

const enableBoxes = () => {
    for(let box of boxes){
        box.disabled = false;
        box.innerText = "";
    }
}

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
    msg.classList.add("hide");
    
    // Clear player names after game reset
    player1Input.value = "";
    player2Input.value = "";
}

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

const saveGameResult = (player1, player2, winner) => {
    fetch('/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ player1, player2, winner })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Game result saved successfully');
        } else {
            console.error('Error saving game result:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
};
