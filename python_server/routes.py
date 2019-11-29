#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import sys
import json
import face_models
import blur_utils
from werkzeug.utils import secure_filename
from flask import (
    Flask,
    request,
    redirect,
    url_for,
    jsonify,
    abort,
    Response,
    render_template
)
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from config import (
    basedir,
    PORT_NUMBER,
    HTTP,
    ADDR,
)
from moviepy.editor import VideoFileClip
from speechToText import (
    speech_to_text,
    find_words
)
from video_utils import (
    videoToAudio,
    getAudioLength,
    getVideoLength,
    mergeVideos,
    newWordList,
    addSubtitles,
)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
if not os.path.isdir(UPLOAD_FOLDER):
		os.mkdir(UPLOAD_FOLDER)

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

CORS(app)

api = Api(app)

@app.route('/')
@app.route('/index')
def index():
    return 'hello world'
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

class Upload(Resource):
    def post(self):
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            fr = face_models.FaceRecog(filepath, 0.5)
            blur_utils.blurAllFaces(filepath, os.path.join(app.config['UPLOAD_FOLDER'], 'result', 'blur_' + filename))
            return redirect(url_for('upload',
                                    filename=filename))

        return redirect(request.url)

    def get(self):
      return 'hello upload'

class SpeechToText(Resource):
    def post(self):
        return 'get?'
    # def post(self):
    def get(self):
        # get audio file from frontend wav!
        # temp
        video_path = os.path.join(
            os.path.dirname(__file__),
            'resources',
            'test2.mov')
        audio_path = os.path.join(
            os.path.dirname(__file__),
            'resources',
            'test2.wav')
        videoToAudio(video_path, 'resources/test2.wav')

        words_list = speech_to_text(audio_path)
        cutting_list = find_words(words_list)
        # print("words_list: ", words_list)
        
        merge_video_path = os.path.join(
            os.path.dirname(__file__),
            'resources',
            'merge_test_video.mp4')
        subtitle_video_path = os.path.join(
            os.path.dirname(__file__),
            'resources',
            'subtitle_test_video.mp4')
        
        mergeVideos(video_path, merge_video_path, cutting_list)
        # need mergeVideo's each text word (start, end) time
        new_words_list = newWordList(words_list, cutting_list)
        addSubtitles(merge_video_path, subtitle_video_path, new_words_list)

        return 'hello...?'

api.add_resource(SpeechToText, "/video_crop")
api.add_resource(Upload, "/upload")

if __name__ == '__main__':
    # ip_address = utils.get_ip_address()
    app.run(host=ADDR,port=PORT_NUMBER,debug=True)
    print(ADDR, PORT_NUMBER, HTTP)
