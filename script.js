// Based on this codepen example code: https://codepen.io/Nishith/pen/ZxGBew

let result = document.getElementById('result');
let fontSizeSlider = document.getElementById('font-size-slider');
let recordingButton = document.getElementsByClassName('btn-recording')[0];
let speechRecognizer = null;
let recording = false;
let textSegments = [];

const renderSegments = () => {
  result.innerHTML = '';

  textSegments.forEach(segment => {
    const el = document.createElement('span');
    el.dataset.identifier = segment.id;

    el.innerHTML = segment.text;

    el.onclick = (evt) => {
      console.log('un-filtered', textSegments, el.dataset.identifier);
      textSegments = textSegments.filter(seg => seg.id !== el.dataset.identifier);
      // textSegments.splice(4, 1, 'May');

      console.log('filtered', textSegments);
      el.remove();
    }
    el.ontouchstart = (evt) => {
      textSegments = textSegments.filter(seg => seg.id !== el.dataset.identifier);
      el.remove();
    }

    result.appendChild(el);
  });
}

const initSpeechRecognizer = () => {
  if ('webkitSpeechRecognition' in window) {
    speechRecognizer = new webkitSpeechRecognition();
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = false;
    speechRecognizer.lang = 'sr-SP';

    // let finalTranscripts = '';

    speechRecognizer.onspeechstart = evt => {
      console.log('SPEECH STARTED');
      recordingButton.style.backgroundColor = 'lightcoral';
      recording = true;
    }

    speechRecognizer.onspeechend = evt => {
      recording = false;
      recordingButton.style.backgroundColor = 'lightgreen';
      console.log('SPEECH ENDED');
    }

    speechRecognizer.onaudioend = evt => {
      console.log('AUDIOEND');
    }

    speechRecognizer.onresult = evt => {
      addSegment(evt.results[0][0].transcript + '. &nbsp;');
      renderSegments();
    };

    speechRecognizer.onend = evt => {
      console.log('ENDED');
    }

    speechRecognizer.onnomatch = evt => {
      console.log('NO MATCH FOUND');
    }

    speechRecognizer.onerror = (evt) => {};
  } else {
    result.innerHTML = 'Your browser is not supported. Please download Google chrome or Update your Google chrome!!';
  }
}

const toggleMicrophone = (evt) => {
  if (recording && speechRecognizer) {
    console.log('toggle button STOPPING');
    speechRecognizer.stop();
  } else {
    console.log('toggle button STARTING');
    speechRecognizer.start();
    recordingButton.style.backgroundColor = 'green';
  }
};

const resetText = evt => {
  result.innerHTML = '';
};

const resizeText = evt => {
  console.log(fontSizeSlider.value);
  result.style.fontSize = fontSizeSlider.value;
};

const addSegment = text => {

  const segment = {
    id: '' + Math.floor(Math.random() * 1000000000000),
    text: text
  };

  textSegments.push(segment);
  renderSegments();
};

const appendToLastSegment = text => {
  if (textSegments.length) {
    const segment = textSegments[textSegments.length - 1];
    segment.text += text;
    renderSegments();
  }
};

// const makeLastSegmentAQuestion = () => {
//   if (textSegments.length) {
//     const segment = textSegments[textSegments.length - 1];
//     const alreadyQuestionmark = segment.text[segment.text.length - 1] === '?';
//
//     if (!alreadyQuestionmark) {
//       segment.text[segment.text.length - 1] = '?';
//       renderSegments();
//     }
//   }
// }

initSpeechRecognizer();




// // TODO convert to cyrillic
// // source: https://stackoverflow.com/questions/11404047/transliterating-cyrillic-to-latin-with-javascript-function
// const lookupTableCyrToLat = {"Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"a","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};
// const lookupTableLatToCyr = Object.entries(lookupTableCyrToLat).reduce((obj, entries) => {
//   obj[entries[1]] = entries[0];
//   return obj;
// }, {})
//
// // function fromCyrillicToLatin(){
// //   return word.split('').map(function (char) {
// //     return lookupTableCyrToLat[char] || char;
// //   }).join("");
// // }
//
// function fromLatinToCyrillic(segment) {
//   const words = segment.split(' ');
//   console.log('words as array', words);
//   const translatedWords = words.map(word => {
//
//     return word.split('').map(char => {
//       if (lookupTableLatToCyr[char]) {
//         return '&#' + lookupTableLatToCyr['H'].charCodeAt([0]) + ';';  // TODO find less hacky way to display cyrillic characters
//       } else {
//         return char;
//       }
//     }).join('');
//   })
//     console.log('translated words', translatedWords);
//
//   return translatedWords.join(' ');
// }
