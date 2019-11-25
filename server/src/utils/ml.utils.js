/* 여기 ml 관련된거 짜시구요 */

async function speechToText(fileName) {
  // Imports the Google Cloud client library
  // const speech = require('@google-cloud/speech');
  const speech = require('@google-cloud/speech').v1p1beta1;
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  const file = fs.readFileSync(fileName);
  const audioBytes = file.toString('base64');

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
    enableWordTimeOffsets: true,
    enableSpeakerDiarization: true,
    diarizationSpeakerCount: 2, // need to specify the number of speaker... (default: 2)
    // model: 'video', // option for video.. let just use default now..
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  // long audio file with async
  const [operation] = await client.longRunningRecognize(request);
  console.log("Waiting for operation to complete...")
  const [response] = await operation.promise();

  // TODO : timeout limitations?

  response.results.forEach(result => {
    let alternative = result.alternatives[0]
    // lets now just ignore last result (results[-1])
    console.log(`Transcription: ${alternative.transcript}, Confidence: ${alternative.confidence}`);
  });

  // Note: The transcript within each result is separate and sequential per result.
  // However, the words list within an alternative includes all the words
  // from all the results thus far. Thus, to get all the words with speaker
  // tags, you only have to take the words list from the last result:
  const result = response.results[response.results.length - 1];

  // TODO: handle exception case :  UnhandledPromiseRejectionWarning: TypeError: Cannot read property 'alternatives' of undefined
  // return null; nothing now..
  if (typeof result == 'undefined') {
    return false;
  }
  const wordsInfo = result.alternatives[0].words;

  var wordsList = wordsInfo.map(wordInfo => {
    // NOTE: If you have a time offset exceeding 2^32 seconds, use the
    // wordInfo.{x}Time.seconds.high to calculate seconds
    let wordDict = {};
    let startSecs =
    `${wordInfo.startTime.seconds}` +
    `.` +
    wordInfo.startTime.nanos / 100000000;
    let endSecs =
    `${wordInfo.endTime.seconds}` +
    `.` +
    wordInfo.endTime.nanos / 100000000;
    console.log(`Word: ${wordInfo.word}, \
        Time: ${startSecs} secs - ${endSecs} secs, \
        speakerTag: ${wordInfo.speakerTag}`);
    
    wordDict['value'] = wordInfo.word;
    wordDict['startSecs'] = startSecs;
    wordDict['endSecs'] = endSecs;
    wordDict['speakerTag'] = wordInfo.speakerTag;
    return wordDict;
  });
  
  return wordsList;
}

function findWords(wordsList) {
  const signals = 'no no'.split(' ');
  const sLength = signals.length;
  const cuttingList = [];

  // TODO: 문장 중 'no no no' 가 있을 경우...? -> 현재 match가 앞의 'no no', 뒤의 'no no' 두번 찾아냄

  for (let i=0; i<wordsList.length; i++) {
    if (wordsList[i].value == signals[0]) {
      let match = true;
      for (let j=i+1; j<i+sLength; j++) {
        if (j > wordsList.length-1) {
          match = false;
          break
        }
        else if (wordsList[j].value != signals[j-i]) {
          match = false;
          break
        }
      }
      if (match) {
        // TODO: 일단 signals 바로 다음 3개 words 정도 가져와서 
        // 이전 20 words중에서 matching되는 곳 찾음

        // if there is only '2' words left after signals...? -> no cut
        if (i+sLength+2 > wordsList.length-1) break
        
        let next3Words = wordsList.slice(i+sLength,i+sLength+3);

        // if there is no 20 prev words -> find words until idx '0' wordsList
        // TODO: signals string 가장 근처 뒤부터 일치하는 단어구간 찾음...
        // (현재) what if i say 'I want to, i want to go... no no I want to go home.'
        // => 뒤의 I want to 가 찾아져서 결국 'I want to, I want to go home' 이 만들어짐
        // 20 words 앞부터 찾아야 하나....?
        // 2 = 0 + (next3Words.length-1)
        for (let j=i-1; j >= i-20 && j >= 2; j--) {
          let idx = 2;

          if (wordsList[j].value == next3Words[idx].value) {
            let match3Words = true;

            for (let k=j-1; k >= j-2; k--) {
              idx--;
              if (wordsList[k].value != next3Words[idx].value) {
                match3Words = false;
                break
              }
            }
            if (match3Words) {
              cuttingList.push({
                'cut_start': wordsList[j-2].startSecs,
                'cut_end': next3Words[0].startSecs,
              });
              break
            }
          }
        }
        break
      }
    }
  }
  return cuttingList;
}

// speechToText().catch(console.error);
module.exports = {speechToText, findWords}
