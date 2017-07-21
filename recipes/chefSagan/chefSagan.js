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
//tj.speak('Welcome to chef Sagan. Are you ready to cook?');
var firstGreeting = true;

// listen for speech
tj.listen((msg) => {
  const containsTurn = msg.indexOf('turn') >= 0;
  const containsChange = msg.indexOf('change') >= 0;
  const containsSet = msg.indexOf('set') >= 0;
  const containsLight = msg.indexOf('the light') >= 0;
  const containsDisco = msg.indexOf('disco') >= 0;

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
  else {
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
  }
});
