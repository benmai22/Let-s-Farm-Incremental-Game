const musicVolume = 0.5;

const gameValues = {
    apple: {
        basePrice: 1,
        growthRate: 1.10,
        upgrade: {
            basePrice: 3,
            growthRate: 1.15
        },
        clicker: {
            basePrice: 1.0,
            growthRate: 1.05
        }
    },
    orange: {
        basePrice: 10,
        growthRate: 1.11,
        upgrade: {
            basePrice: 500,
            growthRate: 1.16
        },
        clicker: {
            basePrice: 100,
            growthRate: 1.05
        }
    },
    banana: {
        basePrice: 100,
        growthRate: 1.12,
        upgrade: {
            basePrice: 700,
            growthRate: 1.17
        },
        clicker: {
            basePrice: 1000,
            growthRate: 1.05
        }
    }
};

let apple = {}, orange = {}, banana = {};
let wallet = new Big(1.0), walletPosition;
let buttonSound, music, isMusicStarted = false, claps;
let bg, bg2, bg3, playAgainButton;
const targetMoney = new Big('5000000');
let bonusFruits = [],
    bonusToggles = [false, false, false],
    bonusReaches = [new Big('100000'), new Big('500000'), new Big('1000000')],
    bonusPrices = [new Big('10000'), new Big('50000'), new Big('100000')],
    bonusTimeStarted = false,
    order = 0,
    bonusTimeOut
    bonusMode = 0,
    time = 10;
let autoClicker = setInterval(() => {}, 1000);
let perSecondPrice = 0;
let badges = {
    prices: {
        blue: 10,
        green: 100,
        purple: 1000,
        yellow: 10000
    }
};
let soil2, soil3;

function preload() {
    buttonSound = loadSound('sounds/button-sound.ogg');
    music = loadSound('sounds/music.mp3');
    claps = loadSound('sounds/claps.mp3');
    bg = loadImage('images/soil.png');
    bg2 = loadImage('images/soil-2.png');
    bg3 = loadImage('images/soil-3.png');

}

function setup() {
    const canvas = createCanvas(750, 750);
    canvas.mousePressed(startMusic);

    loadSoils();

    setPositions();


    loadBadges();
    setBonusFruits();

    loadApple();
    loadOrange();
    loadBanana();
}

function startMusic() {
    if (!isMusicStarted) {
        music.loop();
        music.setVolume(musicVolume);
        isMusicStarted = true;
    }
}

function draw() {
    background(bg);
    background(bg2);
    background(bg3);

    textFont('Courier New');

    drawWallet();
    drawAppleUnlock();
    drawOrangeUnlock();
    drawBananaUnlock();

    drawApplePrice();
    drawOrangePrice();
    drawBananaPrice();

    drawAppleClickerLevel();
    drawOrangeClickerLevel();
    drawBananaClickerLevel();

    drawAppleClickerUpgrade();
    drawOrangeClickerUpgrade();
    drawBananaClickerUpgrade();

    stroke(255);
    strokeWeight(3);
    line(0, height / 12, width, height / 12);
    line(0, height / 2.75, width, height / 2.75);
    line(0, height / 1.5, width, height / 1.5);
    strokeWeight(0.5);

    if (wallet.gte(targetMoney)) {
        noLoop();
        loadPlayAgainButton();
        music.stop();
        claps.play();
        background(0, 0, 0, 150);
        drawWallet();
        textSize(40);
        text('You\'re A Great Farmer!', width/2, height/3);
    }

    for (let i = 0; i < 3; i++) {
        if (!bonusToggles[i] && wallet.gte(bonusReaches[i])) {
            bonusToggles[i] = true;
            openBonusMode();
            bonusMode = i;
            bonusTimeOut = setTimeout(() => {
                closeBonusMode();
                time = 10;
            }, 10000);
        }
    }
    
    if (bonusTimeStarted) {
        drawBonusMode();
        fill(255);
        textSize(40);
        text(time, width - 70, 40);
        if (frameCount % 60 === 0) {
            time -= 1;
        }
    }

    drawBlocks();
    drawBadgeAreas();
}

function loadSoils() {
   /*
    soil2 = createImg('images/soil-2.png');
    soil2.position(10, 75);
    soil2.size(width, 2*height/3 - 70);
    soil2.elt.style.opacity = 0;
   */
    // soil3 = createImg('images/soil-3.png');
}

function loadBadges() {
    badges.blue = createImg('images/blue-badge.png');
    badges.blue.position(22.5, 22.5);
    badges.blue.size(40, 40);
    badges.blue.elt.style.opacity = 0;
  
    badges.green = createImg('images/green-badge.png');
    badges.green.position(72.5, 22.5);
    badges.green.size(40, 40);
    badges.green.elt.style.opacity = 0;

    badges.purple = createImg('images/purple-badge.png');
    badges.purple.position(122.5, 22.5);
    badges.purple.size(40, 40);
    badges.purple.elt.style.opacity = 0;

    badges.yellow = createImg('images/yellow-badge.png');
    badges.yellow.position(172.5, 22.5);
    badges.yellow.size(40, 40);
    badges.yellow.elt.style.opacity = 0;
}

function drawBadgeAreas() {
    fill(0);
    rect(15, 15, 40, 40);
    rect(65, 15, 40, 40);
    rect(115, 15, 40, 40);
    rect(165, 15, 40, 40);

    if (wallet.gte(new Big(badges.prices.blue))) {
        badges.blue.elt.style.opacity = 1.0;
    }

    if (wallet.gte(new Big(badges.prices.green))) {
        badges.green.elt.style.opacity = 1.0;
    }

    if (wallet.gte(new Big(badges.prices.purple))) {
        badges.purple.elt.style.opacity = 1.0;
    }

    if (wallet.gte(new Big(badges.prices.yellow))) {
        badges.yellow.elt.style.opacity = 1.0;
    }
}

function drawBlocks() {
    fill(0, 0, 0, 175);
    
    if (apple.isLocked) {
        rect(width/3, height/12, width, height/3.6);
    }

    if (orange.isLocked) {
        rect(0, height/2.75, width, height/3.3);
    }

    if (banana.isLocked) {
        rect(0, 2*height/3, width, height/3);
    }
}

function drawBonusMode() {
    fill(0, 0, 0, 175);
    rect(width/3, 0, 2*width/3, height);
    fill(255);
    textSize(30);
    text("Hit the fruits with this order", 2 * width / 3, height / 10);
}

function openBonusMode() {
    //console.log("bonus time started");

    setBonusFruits();
    time = 10;

    apple.arrow.elt.style.opacity = 0.1;
    orange.arrow.elt.style.opacity = 0.1;
    banana.arrow.elt.style.opacity = 0.1;

    apple.clicker.elt.style.opacity = 0.1;
    orange.clicker.elt.style.opacity = 0.1;
    banana.clicker.elt.style.opacity = 0.1;

    
    bonusTimeStarted = true;
    order = 0;
    let gap = 0;
    bonusFruits.forEach(fruit => {
        fruit.position(2*width / 3, (height / 7) + gap);
        fruit.size(60, 60);
        gap += 70;
    });
}
    
function closeBonusMode() {
    console.log("bonus time ended");

    apple.arrow.elt.style.opacity = 1.0;
    orange.arrow.elt.style.opacity = 1.0;
    banana.arrow.elt.style.opacity = 1.0;

    apple.clicker.elt.style.opacity = 1.0;
    orange.clicker.elt.style.opacity = 1.0;
    banana.clicker.elt.style.opacity = 1.0;

    bonusFruits.map(fruit => { fruit.remove(); });
    bonusFruits = [];

    time = 10;
    bonusTimeStarted = false;
}

function restartGame() {
    playAgainButton.remove();
    wallet = new Big(1.0);
    time = 10;
    
    apple.clicker.intervals.map(interval => { clearInterval(interval); });
    apple.button.remove();
    apple.clicker.remove();
    apple.arrow.remove();
    apple.lock.remove();
    
    orange.clicker.intervals.map(interval => { clearInterval(interval); });
    orange.button.remove();
    orange.clicker.remove();
    orange.arrow.remove();
    orange.lock.remove();
    
    banana.clicker.intervals.map(interval => { clearInterval(interval); });
    banana.button.remove();
    banana.clicker.remove();
    banana.arrow.remove();
    banana.lock.remove();
    
    loadApple();
    loadOrange();
    loadBanana();

    badges.blue.elt.style.opacity = 0;
    badges.green.elt.style.opacity = 0;
    badges.purple.elt.style.opacity = 0;
    badges.yellow.elt.style.opacity = 0;

    isMusicStarted = false;
    startMusic();
    claps.stop();

    loop();
}

function loadPlayAgainButton() {
    playAgainButton = createImg('images/play-again.png', 'play-again');
    playAgainButton.position((width/2)-50, height/2.75);
    playAgainButton.size(100, 100);
    playAgainButton.mouseClicked(restartGame);
    playAgainButton.mouseOver(() => { mouseOverUpgrade(playAgainButton); });
    playAgainButton.mouseOut(() => { mouseOutUpgrade(playAgainButton); });
}

function setBonusFruits() {
    bonusFruits = [];

    for (let i = 0; i < 9; i++) {
        if (i < 3) {
            const apple = createImg('images/apple.png');
            apple.id = 0;
            bonusFruits.push(apple);
        } else if (i >= 3 && i < 6) {
            const orange = createImg('images/orange.png');
            orange.id = 1;
            bonusFruits.push(orange);
        } else {
            const banana = createImg('images/banana.png');
            banana.id = 2;
            bonusFruits.push(banana);
        }
    }

    bonusFruits = shuffle(bonusFruits);
}

function checkBonus(id) {
    if (bonusFruits[order].id !== id) {
        // loss bonus
        //console.log("loss bonus");
        clearTimeout(bonusTimeOut);
        closeBonusMode();
        return;
    }
    if (order === 8) {
        // won bonus
        //console.log("won bonus");
        wallet = wallet.plus(bonusPrices[bonusMode]);
        clearTimeout(bonusTimeOut);
        closeBonusMode();
    } else {
        order += 1;
    }
}

function setPositions() {
    const clickerSize = 75;

    // WALLET
    walletPosition = {
        x: width / 2,
        y: height / 25,
        textSize: 20,
        perSecond: {
            position: {
                x: width / 2,
                y: height / 15
            },
            textSize: 15
        }
    };

    // APPLE
    apple.size = {
        x: width / 6,
        y: height / 6
    };

    apple.position = {
        x: width / 15,
        y: height / 10
    };

    apple.lockPosition = {
        x: apple.position.x + apple.size.x / 2.75,
        y: apple.position.y + apple.size.y / 2.25,
        size: {
            x: width / 20,
            y: height / 20
        }
    };

    apple.unlockText = {
        position: {
            x: apple.position.x + apple.size.x / 2.5,
            y: apple.position.y + apple.size.y / 0.9,
        },
        size: 15
    };

    apple.priceText = {
        position: {
            x: apple.position.x + apple.size.x / 2.5,
            y: apple.position.y + apple.size.y / 0.9,
        },
        size: 15
    };

    apple.clickerPosition = {
        position: {
            x: width / 1.25,
            y: height / 10 + clickerSize / 2
        },
        size: {
            x: clickerSize,
            y: clickerSize
        }
    };

    apple.unlockClickerText = {
        position: {
            x: width / 1.25 + clickerSize / 2.5,
            y: apple.position.y + apple.size.y / 0.9,
        },
    };

    apple.clickerLevelText = {
        position: {
            x: width / 1.25 + clickerSize / 0.75,
            y: height / 10 + clickerSize / 0.9
        }
    }

    apple.arrowPosition = {
        position: {
            x: width / 2.25,
            y: height / 7
        },
        size: {
            x: width / 8,
            y: height / 8
        }
    };

    apple.unlockArrowText = {
        position: {
            x: width / 2,
            y: apple.position.y + apple.size.y / 0.9,
        }
    }

    apple.arrowLevelText = {
        position: {
            x: width / 2 + clickerSize / 0.75,
            y: height / 10 + clickerSize / 0.9
        }
    };

    // ORANGE
    orange.size = {
        x: width / 6,
        y: height / 6
    };

    orange.position = {
        x: width / 15,
        y: height / 2.5
    };

    orange.lockPosition = {
        x: orange.position.x + orange.size.x / 2.75,
        y: orange.position.y + orange.size.y / 2.5,
        size: {
            x: width / 20,
            y: height / 20
        }
    };

    orange.unlockText = {
        position: {
            x: orange.position.x + orange.size.x / 2.5,
            y: orange.position.y + orange.size.y / 0.9,
        },
        size: 15
    };

    orange.priceText = {
        position: {
            x: orange.position.x + orange.size.x / 2.5,
            y: orange.position.y + orange.size.y / 0.9,
        },
        size: 15
    };

    orange.clickerPosition = {
        position: {
            x: width / 1.25,
            y: height / 2.5 + clickerSize / 2
        },
        size: {
            x: clickerSize,
            y: clickerSize
        }
    };

    orange.unlockClickerText = {
        position: {
            x: width / 1.25 + clickerSize / 2.5,
            y: orange.position.y + orange.size.y / 0.9,
        },
    };

    orange.clickerLevelText = {
        position: {
            x: width / 1.25 + clickerSize / 0.75,
            y: height / 2.5 + clickerSize / 0.9
        }
    }

    orange.arrowPosition = {
        position: {
            x: width / 2.25,
            y: height / 2.3
        },
        size: {
            x: width / 8,
            y: height / 8
        }
    };

    orange.unlockArrowText = {
        position: {
            x: width / 2,
            y: orange.position.y + orange.size.y / 0.9,
        }
    }

    orange.arrowLevelText = {
        position: {
            x: width / 2 + clickerSize / 0.75,
            y: height / 2.5 + clickerSize / 0.9
        }
    };

    // BANANA
    banana.size = {
        x: width / 6,
        y: height / 6
    };

    banana.position = {
        x: width / 15,
        y: height / 1.4
    };

    banana.lockPosition = {
        x: banana.position.x + banana.size.x / 2.75,
        y: banana.position.y + banana.size.y / 2.25,
        size: {
            x: width / 20,
            y: height / 20
        }
    };

    banana.unlockText = {
        position: {
            x: banana.position.x + banana.size.x / 2.5,
            y: banana.position.y + banana.size.y / 0.8,
        },
        size: 15
    };

    banana.priceText = {
        position: {
            x: banana.position.x + banana.size.x / 2.5,
            y: banana.position.y + banana.size.y / 0.75,
        },
        size: 15
    };

    banana.clickerPosition = {
        position: {
            x: width / 1.25,
            y: height / 1.4 + clickerSize / 2
        },
        size: {
            x: clickerSize,
            y: clickerSize
        }
    };

    banana.unlockClickerText = {
        position: {
            x: width / 1.25 + clickerSize / 2.5,
            y: banana.position.y + banana.size.y / 0.9,
        },
    };

    banana.clickerLevelText = {
        position: {
            x: width / 1.25 + clickerSize / 0.75,
            y: height / 1.4 + clickerSize / 0.9
        }
    }

    banana.arrowPosition = {
        position: {
            x: width / 2.25,
            y: height / 1.375
        },
        size: {
            x: width / 8,
            y: height / 8
        }
    };

    banana.unlockArrowText = {
        position: {
            x: width / 2,
            y: banana.position.y + banana.size.y / 0.9,
        }
    }

    banana.arrowLevelText = {
        position: {
            x: width / 2 + clickerSize / 0.75,
            y: height / 1.4 + clickerSize / 0.9
        }
    };
}

function mouseClickedFruit(fruit) {
    buttonSound.play();
    startMusic();
    if (bonusTimeStarted) {
        if (fruit === apple) {
            checkBonus(0);
            return;
        } else if (fruit === orange) {
            checkBonus(1);
            return;
        } else if (fruit === banana) {
            checkBonus(2);
            return;
        }
    }

    if (fruit.isLocked) {
        if (wallet.gte(fruit.unlockPrice)) {
            wallet = wallet.minus(fruit.unlockPrice);
            fruit.isLocked = false;
            fruit.lock.remove();
            fruit.button.elt.style.opacity = 1.0;
            fruit.arrow.elt.style.opacity = 1.0;
            fruit.clicker.elt.style.opacity = 1.0;
        }    
    } else {
        wallet = wallet.plus(fruit.price);
    }
}

function mouseClickedLock(fruit) {
    buttonSound.play();
    startMusic()
    if (wallet.gte(fruit.unlockPrice)) {
        wallet = wallet.minus(fruit.unlockPrice);
        fruit.isLocked = false;
        fruit.lock.remove();
        fruit.button.elt.style.opacity = 1.0;
        fruit.arrow.elt.style.opacity = 1.0;
        fruit.clicker.elt.style.opacity = 1.0;
    }
}

function mouseClickedClicker(fruit) {
    buttonSound.play();
    startMusic();
    if (!fruit.isLocked && wallet.gte(fruit.clicker.price)) {
        fruit.clicker.isLocked = false;
        wallet = wallet.minus(fruit.clicker.price);
        fruit.clicker.level += 1;
        /*
        if (fruit === apple) {
            fruit.clicker.levelPrice = fruit.clicker.levelPrice.plus(1);
        } else if (fruit === orange) {
            fruit.clicker.levelPrice = fruit.clicker.levelPrice.plus(10)
        } else if (fruit === banana) {
            fruit.clicker.levelPrice = fruit.clicker.levelPrice.plus(100);
        }
        // fruit.clicker.price = fruit.clicker.price.plus(fruit.clicker.levelPrice);
        */
        
        fruit.clicker.price = fruit.clicker.basePrice.times(fruit.clicker.growthRate.pow(fruit.clicker.level)).round(1);

        const applePricePerSecond = apple.price.times(apple.clicker.level).div(10);
        const orangePricePerSecond = orange.price.times(orange.clicker.level).div(10);
        const bananaPricePerSecond = banana.price.times(banana.clicker.level).div(10);
        perSecondPrice = applePricePerSecond.plus(orangePricePerSecond).plus(bananaPricePerSecond);
        clearInterval(autoClicker);
        autoClicker = setInterval(() => {
            wallet = wallet.plus(perSecondPrice);
        }, 1000);
    }
}

function mouseClickedArrow(fruit) {
    buttonSound.play();
    startMusic();
    if (!fruit.isLocked && wallet.gte(fruit.arrow.price)) {
        fruit.arrow.isLocked = false;
        wallet = wallet.minus(fruit.arrow.price);
        fruit.arrow.level += 1;
        /*
        if (fruit === apple) {
            fruit.arrow.levelPrice = fruit.arrow.levelPrice.plus(1.9);
            fruit.arrow.upgradePrice = fruit.arrow.upgradePrice.plus(0.05);
        } else if (fruit === orange) {
            fruit.arrow.levelPrice = fruit.arrow.levelPrice.plus(19)
            fruit.arrow.upgradePrice = fruit.arrow.upgradePrice.plus(0.5);
        } else if (fruit === banana) {
            fruit.arrow.levelPrice = fruit.arrow.levelPrice.plus(190);
            fruit.arrow.upgradePrice = fruit.arrow.upgradePrice.plus(5);
        }
        fruit.price = fruit.price.plus(fruit.arrow.upgradePrice);
        fruit.arrow.price = fruit.arrow.price.plus(fruit.arrow.levelPrice);
        */

        fruit.price = fruit.basePrice.times(fruit.growthRate.pow(fruit.arrow.level)).round(1);
        fruit.arrow.price = fruit.arrow.basePrice.times(fruit.arrow.growthRate.pow(fruit.arrow.level)).round(1);

        const applePricePerSecond = apple.price.times(apple.clicker.level).div(10);
        const orangePricePerSecond = orange.price.times(orange.clicker.level).div(10);
        const bananaPricePerSecond = banana.price.times(banana.clicker.level).div(10);
        perSecondPrice = applePricePerSecond.plus(orangePricePerSecond).plus(bananaPricePerSecond);
    }
}

function mouseOverFruit(fruit) {
    const size = fruit.button.height + 30;
    fruit.button.size(size, size);
    fruit.button.position(
        fruit.button.x - 15,
        fruit.button.y - 15
    );
}

function mouseOutFruit(fruit) {
    const size = fruit.button.height - 30;
    fruit.button.size(size, size);
    fruit.button.position(
        fruit.button.x + 15,
        fruit.button.y + 15
    );
}

function mouseOverUpgrade(fruit) {
    const size = fruit.height + 30;
    fruit.size(size, size);
    fruit.position(
        fruit.x - 15,
        fruit.y - 15
    );
}

function mouseOutUpgrade(fruit) {
    const size = fruit.height - 30;
    fruit.size(size, size);
    fruit.position(
        fruit.x + 15,
        fruit.y + 15
    );
}

function loadApple() {
    /// APPLE
    apple.button = createImg('images/apple.png', 'apple');
    apple.button.position(apple.position.x, apple.position.y);
    apple.button.size(apple.size.x, apple.size.y);
    apple.button.mouseOver(() => { mouseOverFruit(apple) });
    apple.button.mouseOut(() => { mouseOutFruit(apple) });
    apple.button.mouseClicked(() => { mouseClickedFruit(apple) });
    apple.button.elt.style.opacity = 0.5;

    apple.basePrice = new Big(gameValues.apple.basePrice);
    apple.growthRate = new Big(gameValues.apple.growthRate);

    apple.isLocked = true;
    apple.price = new Big(gameValues.apple.basePrice);
    apple.unlockPrice = new Big(1);

    // APPLE LOCK
    apple.lock = createImg('images/lock.png', 'apple-lock');
    apple.lock.position(apple.lockPosition.x, apple.lockPosition.y);
    apple.lock.size(apple.lockPosition.size.x, apple.lockPosition.size.y);
    apple.lock.mouseClicked(() => mouseClickedLock(apple));

    // APPLE UPGRADE ARROW
    apple.arrow = createImg('images/arrow.png', 'apple-arrow');
    apple.arrow.position(apple.arrowPosition.position.x, apple.arrowPosition.position.y);
    apple.arrow.size(apple.arrowPosition.size.x, apple.arrowPosition.size.y);
    apple.arrow.mouseClicked(() => { mouseClickedArrow(apple); });
    apple.arrow.mouseOver(() => { mouseOverUpgrade(apple.arrow); });
    apple.arrow.mouseOut(() => { mouseOutUpgrade(apple.arrow); });
    apple.arrow.elt.style.opacity = 0.5;
    apple.arrow.level = 0;
    
    apple.arrow.basePrice = new Big(gameValues.apple.upgrade.basePrice);
    apple.arrow.growthRate = new Big(gameValues.apple.upgrade.growthRate);

    apple.arrow.levelPrice = new Big(0.9);
    apple.arrow.upgradePrice = new Big(0.1);
    apple.arrow.price = new Big(gameValues.apple.upgrade.basePrice);
    apple.arrow.isLocked = true;

    // APPLE CLICKER
    apple.clicker = createImg('images/cursor.png', 'apple-clicker');
    apple.clicker.position(apple.clickerPosition.position.x, apple.clickerPosition.position.y);
    apple.clicker.size(apple.clickerPosition.size.x, apple.clickerPosition.size.y);
    apple.clicker.mouseClicked(() => { mouseClickedClicker(apple); });
    apple.clicker.mouseOver(() => { mouseOverUpgrade(apple.clicker); });
    apple.clicker.mouseOut(() => { mouseOutUpgrade(apple.clicker); });
    apple.clicker.elt.style.opacity = 0.5;
    apple.clicker.level = 0;
    apple.clicker.levelPrice = new Big(1);
    apple.clicker.price = new Big(gameValues.apple.clicker.basePrice);

    apple.clicker.basePrice = new Big(gameValues.apple.clicker.basePrice);
    apple.clicker.growthRate = new Big(gameValues.apple.clicker.growthRate);

    apple.clicker.isLocked = true;
    apple.clicker.intervals = [];
}

function loadOrange() {
    // ORANGE
    orange.button = createImg('images/orange.png', 'orange');
    orange.button.position(orange.position.x, orange.position.y);
    orange.button.size(orange.size.x, orange.size.y);
    orange.button.mouseOver(() => { mouseOverFruit(orange) });
    orange.button.mouseOut(() => { mouseOutFruit(orange) });
    orange.button.mouseClicked(() => { mouseClickedFruit(orange) });
    orange.button.elt.style.opacity = 0.5;

    orange.basePrice = new Big(gameValues.orange.basePrice);
    orange.growthRate = new Big(gameValues.orange.growthRate);
 
    orange.isLocked = true;
    orange.price = new Big(gameValues.orange.basePrice);
    orange.unlockPrice = new Big(100);

    // ORANGE LOCK
    orange.lock = createImg('images/lock.png', 'orange-lock');
    orange.lock.position(orange.lockPosition.x, orange.lockPosition.y);
    orange.lock.size(orange.lockPosition.size.x, orange.lockPosition.size.y);
    orange.lock.mouseClicked(() => mouseClickedLock(orange));

    // ORANGE UPGRADE ARROW
    orange.arrow = createImg('images/arrow.png', 'orange-arrow');
    orange.arrow.position(orange.arrowPosition.position.x, orange.arrowPosition.position.y);
    orange.arrow.size(orange.arrowPosition.size.x, orange.arrowPosition.size.y);
    orange.arrow.mouseClicked(() => { mouseClickedArrow(orange); });
    orange.arrow.mouseOver(() => { mouseOverUpgrade(orange.arrow); });
    orange.arrow.mouseOut(() => { mouseOutUpgrade(orange.arrow); });

    orange.arrow.basePrice = new Big(gameValues.orange.upgrade.basePrice);
    orange.arrow.growthRate = new Big(gameValues.orange.upgrade.growthRate);

    orange.arrow.elt.style.opacity = 0.5;
    orange.arrow.level = 0;
    orange.arrow.levelPrice = new Big(90);
    orange.arrow.upgradePrice = new Big(10);
    orange.arrow.price = new Big(gameValues.orange.upgrade.basePrice);
    orange.arrow.isLocked = true;

    // ORANGE CLICKER
    orange.clicker = createImg('images/cursor.png', 'orange-clicker');
    orange.clicker.position(orange.clickerPosition.position.x, orange.clickerPosition.position.y);
    orange.clicker.size(orange.clickerPosition.size.x, orange.clickerPosition.size.y);
    orange.clicker.mouseClicked(() => { mouseClickedClicker(orange); });
    orange.clicker.mouseOver(() => { mouseOverUpgrade(orange.clicker); });
    orange.clicker.mouseOut(() => { mouseOutUpgrade(orange.clicker); });

    orange.clicker.basePrice = new Big(gameValues.orange.clicker.basePrice);
    orange.clicker.growthRate = new Big(gameValues.orange.clicker.growthRate);

    orange.clicker.elt.style.opacity = 0.5;
    orange.clicker.level = 0;
    orange.clicker.levelPrice = new Big(100);
    orange.clicker.price = new Big(gameValues.orange.clicker.basePrice);
    orange.clicker.isLocked = true;
    orange.clicker.intervals = [];
}

function loadBanana() {
    // BANANA
    banana.button = createImg('images/banana.png', 'banana');
    banana.button.position(banana.position.x, banana.position.y);
    banana.button.size(banana.size.x, banana.size.y);
    banana.button.mouseOver(() => { mouseOverFruit(banana) });
    banana.button.mouseOut(() => { mouseOutFruit(banana) });
    banana.button.mouseClicked(() => { mouseClickedFruit(banana) });
    banana.button.elt.style.opacity = 0.5;

    banana.basePrice = new Big(gameValues.banana.basePrice);
    banana.growthRate = new Big(gameValues.banana.growthRate);
    
    banana.isLocked = true;
    banana.price = new Big(gameValues.banana.basePrice);
    banana.unlockPrice = new Big(10000);

    // BANANA LOCK
    banana.lock = createImg('images/lock.png', 'banana-lock');
    banana.lock.position(banana.lockPosition.x, banana.lockPosition.y);
    banana.lock.size(banana.lockPosition.size.x, banana.lockPosition.size.y);
    banana.lock.mouseClicked(() => mouseClickedLock(banana));

    // BANANA UPGRADE ARROW
    banana.arrow = createImg('images/arrow.png', 'banana-arrow');
    banana.arrow.position(banana.arrowPosition.position.x, banana.arrowPosition.position.y);
    banana.arrow.size(banana.arrowPosition.size.x, banana.arrowPosition.size.y);
    banana.arrow.mouseClicked(() => { mouseClickedArrow(banana); });
    banana.arrow.mouseOver(() => { mouseOverUpgrade(banana.arrow); });
    banana.arrow.mouseOut(() => { mouseOutUpgrade(banana.arrow); });

    banana.arrow.basePrice = new Big(gameValues.banana.upgrade.basePrice);
    banana.arrow.growthRate = new Big(gameValues.banana.upgrade.growthRate);

    banana.arrow.elt.style.opacity = 0.5;
    banana.arrow.level = 0;
    banana.arrow.levelPrice = new Big(9000);
    banana.arrow.upgradePrice = new Big(1000);
    banana.arrow.price = new Big(gameValues.banana.upgrade.basePrice);

    banana.arrow.isLocked = true;

    // BANANA CLICKER
    banana.clicker = createImg('images/cursor.png', 'orange-clicker');
    banana.clicker.position(banana.clickerPosition.position.x, banana.clickerPosition.position.y);
    banana.clicker.size(banana.clickerPosition.size.x, banana.clickerPosition.size.y);
    banana.clicker.mouseClicked(() => { mouseClickedClicker(banana) });
    banana.clicker.mouseOver(() => { mouseOverUpgrade(banana.clicker); });
    banana.clicker.mouseOut(() => { mouseOutUpgrade(banana.clicker); });

    banana.clicker.basePrice = new Big(gameValues.banana.clicker.basePrice);
    banana.clicker.growthRate = new Big(gameValues.banana.clicker.growthRate);

    banana.clicker.elt.style.opacity = 0.5;
    banana.clicker.level = 0;
    banana.clicker.levelPrice = new Big(7000);
    banana.clicker.price = new Big(gameValues.banana.clicker.basePrice);
    banana.clicker.isLocked = true;
    banana.clicker.intervals = [];
}

function drawWallet() {
    fill(255);
    textSize(walletPosition.textSize);
    textAlign(CENTER);
    text("Wallet = $" + wallet.toString(), walletPosition.x, walletPosition.y);
    textSize(walletPosition.perSecond.textSize);
    const applePricePerSecond = apple.price.times(apple.clicker.level).div(10);
    const orangePricePerSecond = orange.price.times(orange.clicker.level).div(10);
    const bananaPricePerSecond = banana.price.times(banana.clicker.level).div(10);
    const perSecond = applePricePerSecond.plus(orangePricePerSecond).plus(bananaPricePerSecond);
    text("Per second = $" + perSecondPrice.toString(), walletPosition.perSecond.position.x, walletPosition.perSecond.position.y);
}

function drawAppleUnlock() {
    if (apple.isLocked) {
        fill(255);
        textSize(apple.unlockText.size);
        textAlign(CENTER);
        text("Unlock $1", apple.unlockText.position.x, apple.unlockText.position.y);
        text("First unlock apple", apple.unlockClickerText.position.x, apple.unlockClickerText.position.y);
        text("First unlock apple", apple.unlockArrowText.position.x, apple.unlockArrowText.position.y);
    }
}

function drawOrangeUnlock() {
    if (orange.isLocked) {
        fill(255);
        textSize(orange.unlockText.size);
        textAlign(CENTER);
        text("Unlock $100", orange.unlockText.position.x, orange.unlockText.position.y);
        text("First unlock orange", orange.unlockClickerText.position.x, orange.unlockClickerText.position.y);
        text("First unlock orange", orange.unlockArrowText.position.x, orange.unlockArrowText.position.y);
    }
}

function drawBananaUnlock() {
    if (banana.isLocked) {
        fill(255);
        textSize(banana.unlockText.size);
        textAlign(CENTER);
        text("Unlock $10000", banana.unlockText.position.x, banana.unlockText.position.y);
        text("First unlock banana", banana.unlockClickerText.position.x, banana.unlockClickerText.position.y);
        text("First unlock banana", banana.unlockArrowText.position.x, banana.unlockArrowText.position.y);
    }
}

function drawAppleClickerLevel() {
    if (!apple.isLocked) {
        fill(255);
        textSize(25);
        textAlign(CENTER);
        text(apple.clicker.level, apple.clickerLevelText.position.x, apple.clickerLevelText.position.y);
        text(apple.arrow.level, apple.arrowLevelText.position.x, apple.arrowLevelText.position.y);
    }
}

function drawOrangeClickerLevel() {
    if (!orange.isLocked) {
        fill(255);
        textSize(25);
        textAlign(CENTER);
        text(orange.clicker.level, orange.clickerLevelText.position.x, orange.clickerLevelText.position.y);
        text(orange.arrow.level, orange.arrowLevelText.position.x, orange.arrowLevelText.position.y);
    }
}

function drawBananaClickerLevel() {
    if (!banana.isLocked) {
        fill(255);
        textSize(25);
        textAlign(CENTER);
        text(banana.clicker.level, banana.clickerLevelText.position.x, banana.clickerLevelText.position.y);
        text(banana.arrow.level, banana.arrowLevelText.position.x, banana.arrowLevelText.position.y);
    }
}

function drawApplePrice() {
    if (!apple.isLocked) {
        fill(255);
        textSize(apple.priceText.size);
        textAlign(CENTER);
        text("Price: $" + apple.price.toString(), apple.priceText.position.x, apple.priceText.position.y);
    }    
}

function drawOrangePrice() {
    if (!orange.isLocked) {
        fill(255);
        textSize(orange.priceText.size);
        textAlign(CENTER);
        text("Price: $" + orange.price.toString(), orange.priceText.position.x, orange.priceText.position.y);
    }    
}

function drawBananaPrice() {
    if (!banana.isLocked) {
        fill(255);
        textSize(banana.priceText.size);
        textAlign(CENTER);
        text("Price: $" + banana.price.toString(), banana.priceText.position.x, banana.priceText.position.y);
    }    
}

function drawAppleClickerUpgrade() {
    fill(255);
    textSize(apple.unlockText.size);
    textAlign(CENTER);
    if (!apple.isLocked) {
        if (!apple.clicker.isLocked) {
            text("Add a clicker $" + apple.clicker.price,  apple.unlockClickerText.position.x, apple.unlockClickerText.position.y);
        } else {
            text("Unlock $1",  apple.unlockClickerText.position.x, apple.unlockClickerText.position.y);
        }
        text("Upgrade apple price for $" + apple.arrow.price,  apple.unlockArrowText.position.x, apple.unlockArrowText.position.y); 
    }
}

function drawOrangeClickerUpgrade() {
    fill(255);
    textSize(orange.unlockText.size);
    textAlign(CENTER);
    if (!orange.isLocked) {
        if (!orange.clicker.isLocked) {
            text("Add a clicker $" + orange.clicker.price, orange.unlockClickerText.position.x, orange.unlockClickerText.position.y);
        } else {
            text("Unlock $" + orange.unlockPrice, orange.unlockClickerText.position.x, orange.unlockClickerText.position.y);
        }
        text("Upgrade orange price for $" + orange.arrow.price,  orange.unlockArrowText.position.x, orange.unlockArrowText.position.y); 
    }
}

function drawBananaClickerUpgrade() {
    fill(255);
    textSize(banana.unlockText.size);
    textAlign(CENTER);
    if (!banana.isLocked) {
        if (!banana.clicker.isLocked) {
            text("Add a clicker $" + banana.clicker.price, banana.unlockClickerText.position.x, banana.unlockClickerText.position.y);
        } else {
            text("Unlock $" + banana.unlockPrice, banana.unlockClickerText.position.x, banana.unlockClickerText.position.y);
        }
        text("Upgrade banana price for $" + banana.arrow.price, banana.unlockArrowText.position.x, banana.unlockArrowText.position.y); 
    }
}
