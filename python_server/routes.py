#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import sys
import face_models
import blur_utils
from flask import Flask, render_template, Response
from flask_restful import Resource, Api, reqparse
from config import (
  basedir,
  PORT_NUMBER,
  HTTP,
  ADDR,
)
from moviepy.editor import VideoFileClip

app = Flask(__name__)

api = Api(app)

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


def gen(fr):
    jpg_bytes = fr.get_jpg_bytes()
    while jpg_bytes:
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpg_bytes + b'\r\n\r\n')
        jpg_bytes = fr.get_jpg_bytes()

@app.route('/video_feed')
def video_feed():
    input_video = "media/sample1.mov"
    tolerance = 0.5
    output_path = "media/output1.mp4"
    fr = face_models.FaceRecog()
    # fr = face_models.FaceRecog(input_video, tolerance)
    # blur_utils.blurOtherFaces(input_video, output_path)
    return Response(gen(fr),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

class Temp(Resource):
    def post(self):
      return
    def get(self):
      return 'hello...?'

api.add_resource(Temp, "/temp")

if __name__ == '__main__':
    # ip_address = utils.get_ip_address()
    app.run(host=ADDR,port=PORT_NUMBER,debug=True)
    print(ADDR, PORT_NUMBER, HTTP)
