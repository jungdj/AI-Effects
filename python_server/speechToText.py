import io
import os
# Imports the Google Cloud client library
from google.cloud import speech_v1p1beta1 as speech
from google.cloud.speech_v1p1beta1 import enums
from google.cloud.speech_v1p1beta1 import types

# TODO: receive fileName, duration
def speech_to_text(audio_path):
    # Instantiates a client
    client = speech.SpeechClient()

    # Loads the audio into memory
    with io.open(audio_path, 'rb') as audio_file:
        content = audio_file.read()
        audio = types.RecognitionAudio(content=content)

    config = types.RecognitionConfig(
    encoding=enums.RecognitionConfig.AudioEncoding.LINEAR16,
    # encoding=enums.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED,
    sample_rate_hertz=16000,
    language_code='en-US',
    enable_word_time_offsets=True,
    enable_speaker_diarization=True,
    diarization_speaker_count=3,
    audio_channel_count=2,
    # model='video',
    )

    # async longrunnning audio file to text
    operation = client.long_running_recognize(config, audio)

    # Detects speech in the audio file
    print("Waiting for operation to complete...")
    # response = client.recognize(config, audio)
    response = operation.result(timeout=90)

    '''
    Each result is for a consecutive portion of the audio. Iterate through
    them to get the transcripts for the entire audio file.
    '''
    words_list = []

    # for result in response.results:
    result = response.results[-1]
    alternative = result.alternatives[0]
    print(u'Transcript: {}'.format(alternative.transcript))
    print('Confidence: {}'.format(alternative.confidence))

    for word_info in alternative.words:
        word = word_info.word
        start_time = word_info.start_time
        start_secs = start_time.seconds + start_time.nanos * 1e-9
        end_time = word_info.end_time
        end_secs = end_time.seconds + end_time.nanos * 1e-9
        
        print('Word: {}, start_time: {}, end_time: {}, speaker_tag: {}'.format(
        word,
        start_time.seconds + start_time.nanos * 1e-9,
        end_time.seconds + end_time.nanos * 1e-9,
        word_info.speaker_tag,
        ))

        words_list.append({
        'value': word_info.word,
        'start_secs': start_secs,
        'end_secs': end_secs,
        'speaker_tag': word_info.speaker_tag,
        })
    return words_list

def find_youknow(words_list):
  signals = 'you know'.split(' ')
  s_length = len(signals)
  cutting_list = []
  for i in range(len(words_list)):
    if (words_list[i]['value'] == signals[0]):
      match = True
      for j in range(i+1, i+s_length):
        if (j > len(words_list)-1):
          match = False
          break
        elif (words_list[j]['value'] != signals[j-i]):
          match = False
          break

      if (match):
        cutting_list.append({
          'cut_start': words_list[i]['start_secs'],
          'cut_end': words_list[i+2]['start_secs'],
        })
  return cutting_list

def find_words(words_list):
  signals = 'no no'.split(' ')
  s_length = len(signals)
  cutting_list = []

  # TODO: 문장 중 'no no no' 가 있을 경우...? -> 현재 match가 앞의 'no no', 뒤의 'no no' 두번 찾아냄

  for i in range(len(words_list)):
    if (words_list[i]['value'] == signals[0]):
      match = True
      for j in range(i+1, i+s_length):
        if (j > len(words_list)-1):
          match = False
          break
        elif (words_list[j]['value'] != signals[j-i]):
          match = False
          break
      
      if (match):
        # TODO: 일단 signals 바로 다음 3개 words 정도 가져와서 
        # 이전 20 words중에서 matching되는 곳 찾음

        # if there is only '2' words left after signals...? -> no cut
        if (i+s_length+2 > len(words_list)-1): break

        next_3_words = words_list[i+s_length:i+s_length+3]

        # if there is no 20 prev words -> find words until idx '0' wordsList
        # TODO: signals string 가장 근처 뒤부터 일치하는 단어구간 찾음...
        # (현재) what if i say 'I want to, i want to go... no no I want to go home.'
        # => 뒤의 I want to 가 찾아져서 결국 'I want to, I want to go home' 이 만들어짐
        # 20 words 앞부터 찾아야 하나....?
        # 2 = 0 + (next3Words.length-1)
        for j in range(i-1, i-21, -1):
          idx = 2

          if (words_list[j]['value'] == next_3_words[idx]['value']):
            match_3_words = True

            for k in range(j-1, j-3, -1):
              idx-=1
              if (words_list[k]['value'] != next_3_words[idx]['value']):
                match_3_words = False
                break

            if (match_3_words):
              cutting_list.append({
                'cut_start': words_list[j-2]['start_secs'],
                'cut_end': next_3_words[0]['start_secs'],
              })
              break
        
        break
  return cutting_list
