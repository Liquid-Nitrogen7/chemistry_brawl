//setup
let atomInventory = ["H", "H"]
let compoundsInventory = []
const compoundsList = [
    [["H", "H"], "H2"],
    [["H", "H", "O"], "H2O"],
    [["O", "O"], "O2"],
]
const atomsList = [
    ["H", 10, 5],
    ["O", 30, 3],
]
let atomShop = [["H", 10], ["H", 10], ["O", 30]]
let coins = 0;
let score = 0;
let enemies = [];
let enemySpawnChances = 1
let player = [250, 250, 50]
let playerStatus = [0, 0]
let waveTimer = 100;
let wavePower = 1

let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

let gameStarted = false;

let water;

function keyPressed() {
    if (keyCode === LEFT_ARROW || key === 'a') {
        leftPressed = true;
    }
    if (keyCode === RIGHT_ARROW || key === 'd') {
        rightPressed = true;
    }
    if (keyCode === UP_ARROW || key === 'w') {
        upPressed = true;
    }
    if (keyCode === DOWN_ARROW || key === 's') {
        downPressed = true;
    }
}

function keyReleased() {
    if (keyCode === LEFT_ARROW || key === 'a') {
        leftPressed = false;
    }
    if (keyCode === RIGHT_ARROW || key === 'd') {
        rightPressed = false;
    }
    if (keyCode === UP_ARROW || key === 'w') {
        upPressed = false;
    }
    if (keyCode === DOWN_ARROW || key === 's') {
        downPressed = false;
    }
}

//prevent scrolling
window.addEventListener("keydown", function (event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(event.key)) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", function (event) {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"].includes(event.key)) {
        event.preventDefault();
    }
});

function setup() {
    createCanvas(500, 500, document.getElementById("battlefield"))
    noStroke()
    updateChemistry()
    updateAtomShop()
    updateCompoundPurchase()
}
let gameOver = false

function draw() {
    background(0)


    //enemy handling
    for (let e of enemies) {
        //draw enemies
        stroke(255, 0, e[2] * 10)
        strokeWeight(e[2] * 2)
        point(e[0], e[1])
        //move enemies to player
        let xdiff = player[0] - e[0]
        let ydiff = player[1] - e[1]
        let d = dist(player[0], player[1], e[0], e[1])
        e[0] += xdiff * e[4] * 2 / d
        e[1] += ydiff * e[4] * 2 / d
        //water slowness
        if (water) {
            if (dist(e[0], e[1], water[0], water[1]) < 100 - e[4]) {
                e[0] -= xdiff * e[4] / d
                e[1] -= ydiff * e[4] / d
            }
        }
        //knockback & attack
        if (d < player[2] / 5) {
            e[3] = 7
            player[2] -= e[2]
        }
        if (e[3]) {
            e[0] -= xdiff * 5 / d
            e[1] -= ydiff * 5 / d
            e[3]--;
        }
    }

    //show player
    stroke(0, 150, 255)
    strokeWeight(player[2] / 2)
    point(player[0], player[1])

    //show oxygen
    stroke(0, 255, 0, playerStatus[1]*3)
    strokeWeight(player[2] / 2)
    point(player[0], player[1])
    if(playerStatus[1]>0){playerStatus[1]--;}

    //draw water
    if (water) {
        noStroke()
        fill(50, 150, 255, water[2])
        ellipse(water[0], water[1], 100, 100)
        water[2]--;
        if (water[2] < 0) {
            water = undefined;
        }
    }

    //show compounds
    noStroke()
    let num = 0;
    for (let c of compoundsInventory) {
        fill(0, 150, 255)
        rect(num * 70 + 20, 430, 50, 50)
        fill(100, 100)
        rect(num * 70 + 20, 480 - c[1], 50, c[1])
        fill(0)
        textAlign(CENTER, CENTER)
        text(c[0], num * 70 + 45, 455)
        if (c[1] > 0) {
            switch (c[0]) {
                case "H2":
                    c[1] -= 0.5;
                    break;
                case "H2O":
                    c[1] -= 0.4
                    break;
                default:
                    c[1] -= 0.5;
                    break;
            }

        }
        num++;
    }

    if (keyIsPressed) {
        //player motion
        if (((leftPressed || upPressed) && !(leftPressed && upPressed)) && ((leftPressed || downPressed) && !(leftPressed && downPressed)) && ((rightPressed || upPressed) && !(rightPressed && upPressed)) && ((rightPressed || downPressed) && !(rightPressed && downPressed))) {
            if (leftPressed) {
                player[0] -= 3;
            }
            if (rightPressed) {
                player[0] += 3;
            }
            if (upPressed) {
                player[1] -= 3;
            }
            if (downPressed) {
                player[1] += 3;
            }
        } else {
            if (leftPressed) {
                player[0] -= Math.sqrt(4.5);
            }
            if (rightPressed) {
                player[0] += Math.sqrt(4.5);
            }
            if (upPressed) {
                player[1] -= Math.sqrt(4.5);
            }
            if (downPressed) {
                player[1] += Math.sqrt(4.5);
            }
        }

        //oxygen bonus
        console.log(playerStatus[1])
        if (playerStatus[1]>0) {
            if (((leftPressed || upPressed) && !(leftPressed && upPressed)) && ((leftPressed || downPressed) && !(leftPressed && downPressed)) && ((rightPressed || upPressed) && !(rightPressed && upPressed)) && ((rightPressed || downPressed) && !(rightPressed && downPressed))) {
                if (leftPressed) {
                    player[0] -= 6;
                }
                if (rightPressed) {
                    player[0] += 6;
                }
                if (upPressed) {
                    player[1] -= 6;
                }
                if (downPressed) {
                    player[1] += 6;
                }
            } else {
                if (leftPressed) {
                    player[0] -= 2*Math.sqrt(4.5);
                }
                if (rightPressed) {
                    player[0] += 2*Math.sqrt(4.5);
                }
                if (upPressed) {
                    player[1] -= 2*Math.sqrt(4.5);
                }
                if (downPressed) {
                    player[1] += 2*Math.sqrt(4.5);
                }
            }
        }

        //compound use
        if (Number(key)) {
            useCompound(Number(key) - 1)
        }
    }

    //compound effects
    //H2
    if (playerStatus[0]) {
        fill(0, 255, 0, 100)
        ellipse(player[0], player[1], 70)
        for (let e of enemies) {
            if (dist(e[0], e[1], player[0], player[1]) < 35) {
                e[2] -= 1;
                if (e[2] < 0) {
                    enemies.splice(enemies.indexOf(e), 1)
                    coins += 1
                    score += 1
                    updateCoinsAndScore()
                }
            }
        }
        playerStatus[0]--;
    }

    //end
    if (player[2] <= 0 && gameOver == false) {
        gameOver = true;
        alert("Game Over")
        location.reload()
    }

    //waves
    if (gameStarted) { waveTimer--; }
    if (waveTimer == 0) {
        waveTimer = 2000
        wavePower += 0.05
        //enemy spawner
        for (let i = 0; i < wavePower * 5; i++) {
            enemies.push([Math.random() * 500 - 500, Math.random() * 500, Math.ceil(Math.sqrt(Math.random() * wavePower * 5)), 0, Math.random()])
            enemies.push([Math.random() * 500 + 500, Math.random() * 500, Math.ceil(Math.sqrt(Math.random() * wavePower * 5)), 0, Math.random()])
            enemies.push([Math.random() * 500, Math.random() * 500 - 500, Math.ceil(Math.sqrt(Math.random() * wavePower * 5)), 0, Math.random()])
            enemies.push([Math.random() * 500, Math.random() * 500 + 500, Math.ceil(Math.sqrt(Math.random() * wavePower * 5)), 0, Math.random()])
        }
    }
}

//update functions
function updateChemistry() {
    atomInventory.sort()
    let inv = ""
    for (x of atomInventory) {
        inv += x + ", "
    }
    let inv2 = inv.split("")
    inv2.splice(-2, 2)
    inv = inv2.join("")
    $("#inventory").html(inv2)
}
function updateAtomShop() {
    let atomShopHTML = ""
    for (x of atomShop) {
        if (coins >= x[1]) {
            atomShopHTML += `<button onclick="buyAtom('${x[0]}', ${x[1]})"'`
        } else {
            atomShopHTML += "<button style='background-color:grey'"
        }
        atomShopHTML += `>${x[0]}<br>Cost: ${x[1]}</button>`
    }
    $("#atomShop").html(atomShopHTML)
}
function updateCompoundPurchase() {
    let compoundPurchaseHTML = ""
    for (x of compoundsList) {
        let viable = true;
        let remainingAtoms = [...atomInventory]
        for (i of x[0]) {
            let atomIndex = remainingAtoms.indexOf(i)
            if (atomIndex == -1) {
                viable = false;
                break;
            } else {
                remainingAtoms.splice(atomIndex, 1)
            }
        }

        if (viable) {
            for (c of compoundsInventory) {
                if (c[0] == x[1]) {
                    viable = false
                    break;
                }
            }
            if (viable) {
                compoundPurchaseHTML += `<button onclick='createCompound([[`
                for (y of x[0]) {
                    compoundPurchaseHTML += `"${y}",`
                }
                compoundPurchaseHTML += `], "${x[1]}"])'>Create ${x[1]}</button>`
            }
        }
    }
    $("#compoundPurchase").html(compoundPurchaseHTML)
}
function updateCoinsAndScore() {
    $("#coins").html(coins)
    $("#score").html(score)
    updateAtomShop()
}


//purchase functions
function createCompound(recipe) {
    for (x of recipe[0]) {
        atomInventory.splice(atomInventory.indexOf(x), 1)
    }
    compoundsInventory.push([recipe[1], 0])
    if (recipe[1] == "H2") {
        gameStarted = true;
    }
    updateChemistry()
    updateCompoundPurchase()
}
function buyAtom(x, y) {
    if (coins >= y) {
        coins -= y
        atomInventory.push('' + x)
        updateCoinsAndScore()
        updateChemistry()
        updateCompoundPurchase()
        atomInventory.sort()
    }
}

//combat functions
function useCompound(c) {
    try {
        let compound = compoundsInventory[c]
        if (compound[1] <= 0) {
            if (compound[0] == "H2") {
                playerStatus[0] = 5;
                compound[1] += 50
            } else if (compound[0] == "H2O") {
                water = [player[0], player[1], 200]
                compound[1] += 50
            } else if (compound[0] == "O2") {
                playerStatus[1] = 40;
                compound[1] += 50
            }
        }
    } catch (e) { }
}
