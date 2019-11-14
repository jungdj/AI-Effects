/* 여기 ml 관련된거 짜시구요 */

async function speechToText() {
  // Imports the Google Cloud client library
  // const speech = require('@google-cloud/speech');
  const speech = require('@google-cloud/speech').v1p1beta1;
  const fs = require('fs');

  // Creates a client
  const client = new speech.SpeechClient();

  // The name of the audio file to transcribe
  const fileName = '../static/speech_resources/audio.raw';

  // Reads a local audio file and converts it to base64
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
    diarizationSpeakerCount: 4, // need to specify the number of speaker... (default: 2)
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
  const wordsInfo = result.alternatives[0].words;
  wordsInfo.forEach(wordInfo => {
    // NOTE: If you have a time offset exceeding 2^32 seconds, use the
    // wordInfo.{x}Time.seconds.high to calculate seconds.      
    startSecs =
    `${wordInfo.startTime.seconds}` +
    `.` +
    wordInfo.startTime.nanos / 100000000;
    endSecs =
    `${wordInfo.endTime.seconds}` +
    `.` +
    wordInfo.endTime.nanos / 100000000;
    console.log(`Word: ${wordInfo.word}, \
        Time: ${startSecs} secs - ${endSecs} secs, \
        speakerTag: ${wordInfo.speakerTag}`);
  });

}
speechToText().catch(console.error);