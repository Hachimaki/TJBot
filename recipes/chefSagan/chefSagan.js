/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const TJBot = require('tjbot');
const config = require('./config');
const Sagan = require('./sagan');

// obtain our credentials from config.js
const credentials = config.credentials;

// these are the hardware capabilities that our TJ needs for this recipe
const hardware = ['led', 'microphone', 'speaker'];

// set up TJBot's configuration
const tjConfig = {
  log: {
    level: 'verbose',
  },
};

// instantiate our TJBot!
const tj = new TJBot(hardware, tjConfig, credentials);

// full list of colors that TJ recognizes, e.g. ['red', 'green', 'blue']
const tjColors = tj.shineColors();

// hash map to easily test if TJ understands a color, e.g. {'red': 1, 'green': 1, 'blue': 1}
const colors = {};
tjColors.forEach((color) => {
  colors[color] = 1;
});

let step = 0;
const steps = [
  'cook spaghetti in a large pot of boiling water according to the directions',
  'cook anchovies, garlic, red pepper flakes, one cup of oil, and a pinch of salt in a large skillet over medium low heat for 6 to 7 minutes until the anchovies dissolve and the garlic is tender',
  'stir in the parsley and remove from heat',
  'heat the remaining oil in a small skillet on medium',
  'add panko and cook for about 5 minutes, stirring often',
  'season with salt and pepper and then transfer to paper towels to cool',
  'add pasta to the anchovy sauce with half the panko mixture',
  'cook over medium while stirring constantly for 1 to 2 minutes or until heated through',
  'season with salt and pepper and serve topped with parmesean and the remaining panko mixture'
];
const ingredients = [
  'one pound of spaghetti',
  'kosher salt to taste',
  'four anchovy fillets in oil',
  'six large garlic cloves thinly sliced',
  'one half teaspoon red pepper flakes',
  'one cup plus three tablespoons olive oil divided',
  'one half cup finely chopped flat leaf parsely',
  'one cup panko or bredcrumbs',
  'frechly ground black pepper',
  'freshly grated parmesan'
];

// let's have a disco party!
function discoParty() {
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const randIdx = Math.floor(Math.random() * tjColors.length);
      const randColor = tjColors[randIdx];
      tj.shine(randColor);
    }, i * 250);
  }
}

function sing() {
  tj.play('./test.mp3');
}

function demo(msg) {
  const findRecipe = msg.indexOf('recipe for spaghetti') >= 0 || msg.indexOf('make spaghetti') >= 0;
  const yield = msg.indexOf('does this recipe') >= 0 || msg.indexOf('will this recipe') >= 0;
  const time = msg.indexOf('how long') >= 0 || msg.indexOf('how much time') >= 0;
  const ingredientList = msg.indexOf('what ingredients') >= 0;

  const ingredientQuery = msg.indexOf('how much') >= 0;
  const containsSpaghetti = msg.indexOf('spaghetti') >= 0;
  const containsSalt = msg.indexOf('salt') >= 0;
  const containsFillet = msg.indexOf('anchovy') >= 0;
  const containsGarlic = msg.indexOf('garlic') >= 0;
  const containsRedPepper = msg.indexOf('pepper flakes') >= 0; 
  const containsOliveOil = msg.indexOf('olive oil') >= 0;
  const containsParsley = msg.indexOf('parsley') >= 0;
  const containsPanko = msg.indexOf('panko') >= 0 || msg.indexOf('breadcrumbs') >= 0;
  const containsBlackPepper = msg.indexOf('pepper') >= 0 && msg.indexOf('flakes') < 0;
  const containsParmesean = msg.indexOf('parmesan') >= 0;

  const getStarted = msg.indexOf('first step') >= 0;
  const nextStep = msg.indexOf('next') >= 0 || msg.indexOf('after that') >= 0;
  const repeat = msg.indexOf('what was that') >= 0 || msg.indexOf('repeat that') >= 0;

  if (findRecipe) {
    tj.speak('I\'ve found a recipe from Epicurious.  Let\'s begin!');
  }  
  else if (yield) {
    tj.speak('The recipe makes four to six servings');
  }
  else if (time) {
    tj.speak('The recipe takes 15 to 20 minutes to cook');
  }
  else if (ingredientList) {
    tj.speak('You\'ll need ');
    for (let i = 0; i < ingredients.length; i++) {
      tj.speak(ingredients[i]);
    }   
  }
  else if (ingredientQuery) {
    if (containsSpaghetti) {
      tj.speak('You\'ll need a pound of spaghetti.');
    }
    else if (containsSalt) {
      tj.speak('Add salt to taste');
    }
    else if (containsFillet) {
      tj.speak('You need four anchovy fillets in oil.');
    }
    else if (containsGarlic) {
      tj.speak('You need 5 large cloves of garlic, thinly sliced.');
    }
    else if (containsRedPepper) {
      tj.speak('You need one half teaspoon of red pepper flakes.');
    }
    else if (containsOliveOil) {
      tj.speak('You need one cup plus three tablespoons of olive oil, divided');
    }
    else if (containsParsley) {
      tj.speak('You need one half cup funely chopped flat leaf parsely.');
    }
    else if (containsPanko) {
     tj.speak('You need one cup of panko or breadcrumbs'); 
    }
    else if (containsBlackPepper) {
      tj.speak('Add black pepper to taste');
    }
    else if (containsParmesean) {
      tj.speak('Add grated parmesean to taste as a topping');
    }
  }
  else if (getStarted) {
    tj.speak('Ok!  First ' + steps[0]);
  }
  else if (nextStep) {
    step++;
    tj.speak('Next ' + steps[step]);
  }
  else if (repeat) {
    const utterance = steps[step];
    tj.speak('Ok, that was ' + steps[step]);
  }

  if (step == steps.length - 1) {
    tj.speak('You\'re all done!');
  }
} 

//tj.speak('Welcome to chef Sagan. Are you ready to cook?');
var firstGreeting = true;

// listen for speech
tj.listen((msg) => {
  const containsTurn = msg.indexOf('turn') >= 0;
  const containsChange = msg.indexOf('change') >= 0;
  const containsSet = msg.indexOf('set') >= 0;
  const containsLight = msg.indexOf('the light') >= 0;
  const containsDisco = msg.indexOf('disco') >= 0;
  const containsSing = msg.indexOf('sing a song') >= 0;

  if (firstGreeting) {
    tj.speak('Welcome to chef Sagan. Are you ready to cook?');
    firstGreeting = false;
  }

  if ((containsTurn || containsChange || containsSet) && containsLight) {
    // was there a color uttered?
    const words = msg.split(' ');
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (colors[word] !== undefined || word === 'on' || word === 'off') {
        // yes!
        tj.shine(word);
        break;
      }
    }
  }
  else if (containsDisco) {
    discoParty();
  }
/*
  else if (containsSing) {
    sing();
  }
*/
  else {
    demo(msg);
    /*
    Sagan.message(msg)
    .then((r) => {
      const res = JSON.parse(r);
      console.log('RESULT OBJ: ' + res.speech.text);
     // tj.speak('message received from Sagan');
     // console.log('R SPEECH TEXT' + r.speech.text);
      tj.speak(res.speech.text);
    }).catch((err) => {
      console.log('ERROR: '+ err);
    });
    */
  }
});
