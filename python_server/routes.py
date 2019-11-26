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
  mergeVideos
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
        'cut_end': 7,
      })
      cutting_list.append({
        'cut_start': 8,
        'cut_end': 10,
      })
      
      merge_video_path = os.path.join(
        os.path.dirname(__file__),
        'resources',
        'merge_test_video.mp4')
      mergeVideos(video_path, merge_video_path, cutting_list)

      return 'hello...?'

api.add_resource(Temp, "/temp")

if __name__ == '__main__':
    # ip_address = utils.get_ip_address()
    app.run(host=ADDR,port=PORT_NUMBER,debug=True)
    print(ADDR, PORT_NUMBER, HTTP)
