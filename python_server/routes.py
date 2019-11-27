#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import sys
from flask import Flask
from flask_restful import Resource, Api, reqparse
from config import (
  basedir,
  PORT_NUMBER,
  HTTP,
  ADDR,
)
from speechToText import (
  speech_to_text,
  find_words
)
from video_utils import (
  getAudioLength,
  getVideoLength,
  mergeVideos,
  newWordList,
  addSubtitles,
)

app = Flask(__name__)

api = Api(app)

@app.route('/')
@app.route('/index')
def index():
  return "test: hello world!"

class Temp(Resource):
    def post(self):
      return
    def get(self):
      # get audio file from frontend wav!
      # temp
      video_path = os.path.join(
        os.path.dirname(__file__),
        'resources',
        'test_video.mp4')
      audio_path = os.path.join(
        os.path.dirname(__file__),
        'resources',
        'audio.raw')

      # duration = getAudioLength(audio_path)
      # print("duration: ", duration)

      words_list = speech_to_text(audio_path)
      cutting_list = find_words(words_list)

      # temp cutting_list
      cutting_list = []
      cutting_list.append({
        'cut_start': 3.2,
        'cut_end': 7.0,
      })
      cutting_list.append({
        'cut_start': 8.2,
        'cut_end': 10.0,
      })

      # temp words_list
      words_list = [
        {
          'value': 'rockbuster',
          'start_secs': 2.3,
          'end_secs': 3.2,
          'speaker_tag': 2
        },
        { 'value': 'the', 'start_secs': 3.2, 'end_secs': 4.2, 'speaker_tag': 2 },
        { 'value': 'stock', 'start_secs': 4.2, 'end_secs': 4.7, 'speaker_tag': 2 },
        { 'value': 'that', 'start_secs': 4.7, 'end_secs': 4.9, 'speaker_tag': 2 },
        { 'value': 'the', 'start_secs': 4.9, 'end_secs': 5.0, 'speaker_tag': 2 },
        { 'value': 'judge', 'start_secs': 5.0, 'end_secs': 5.4, 'speaker_tag': 2 },
        { 'value': 'that', 'start_secs': 5.4, 'end_secs': 6.7, 'speaker_tag': 2 },
        { 'value': 'will', 'start_secs': 6.7, 'end_secs': 7.0, 'speaker_tag': 2 },
        { 'value': 'be', 'start_secs': 7.0, 'end_secs': 7.1, 'speaker_tag': 2 },
        {
          'value': 'obstacles',
          'start_secs': 7.1,
          'end_secs': 7.4,
          'speaker_tag': 2
        },
        { 'value': 'but', 'start_secs': 7.4, 'end_secs': 8.2, 'speaker_tag': 2 },
        { 'value': "it's", 'start_secs': 8.2, 'end_secs': 8.4, 'speaker_tag': 2 },
        { 'value': 'all', 'start_secs': 8.4, 'end_secs': 8.6, 'speaker_tag': 2 },
        { 'value': 'about', 'start_secs': 8.6, 'end_secs': 8.7, 'speaker_tag': 2 },
        { 'value': 'finding', 'start_secs': 8.7, 'end_secs': 9.1, 'speaker_tag': 2 },
        { 'value': 'a', 'start_secs': 9.1, 'end_secs': 9.5, 'speaker_tag': 2 },
        { 'value': 'way', 'start_secs': 9.5, 'end_secs': 9.7, 'speaker_tag': 2 },
        {
          'value': 'through',
          'start_secs': 9.7,
          'end_secs': 10.0,
          'speaker_tag': 2
        },
        {
          'value': 'bushing',
          'start_secs': 10.0,
          'end_secs': 11.5,
          'speaker_tag': 2
        },
        { 'value': 'on', 'start_secs': 11.5, 'end_secs': 11.6, 'speaker_tag': 2 },
        {
          'value': 'upwards',
          'start_secs': 11.6,
          'end_secs': 13.1,
          'speaker_tag': 2
        },
        { 'value': 'until', 'start_secs': 13.9, 'end_secs': 14.5, 'speaker_tag': 2 },
        {
          'value': 'finally',
          'start_secs': 14.5,
          'end_secs': 14.9,
          'speaker_tag': 2
        },
        {
          'value': 'reaching',
          'start_secs': 14.9,
          'end_secs': 15.7,
          'speaker_tag': 2
        },
        { 'value': 'the', 'start_secs': 15.7, 'end_secs': 15.9, 'speaker_tag': 2 },
        { 'value': 'talk', 'start_secs': 15.9, 'end_secs': 16.4, 'speaker_tag': 2 },
        {
          'value': 'Buxton',
          'start_secs': 16.4,
          'end_secs': 17.9,
          'speaker_tag': 2
        },
        { 'value': 'his', 'start_secs': 17.9, 'end_secs': 18.7, 'speaker_tag': 2 },
        { 'value': 'to', 'start_secs': 18.7, 'end_secs': 18.8, 'speaker_tag': 2 },
        { 'value': 'the', 'start_secs': 18.8, 'end_secs': 18.9, 'speaker_tag': 2 },
        {
          'value': 'up-and-coming',
          'start_secs': 18.9,
          'end_secs': 19.6,
          'speaker_tag': 2
        }
      ]
      
      merge_video_path = os.path.join(
        os.path.dirname(__file__),
        'resources',
        'merge_test_video.mp4')
      subtitle_video_path = os.path.join(
        os.path.dirname(__file__),
        'resources',
        'subtitle_test_video.mp4')
      
      mergeVideos(video_path, merge_video_path, cutting_list)
      # mergeVideo의 text time이 필요...
      new_words_list = newWordList(words_list, cutting_list)
      addSubtitles(merge_video_path, subtitle_video_path, new_words_list)

      return 'hello...?'

api.add_resource(Temp, "/temp")

if __name__ == '__main__':
    # ip_address = utils.get_ip_address()
    app.run(host=ADDR,port=PORT_NUMBER,debug=True)
    print(ADDR, PORT_NUMBER, HTTP)
