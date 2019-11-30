#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import sys
# <<<<<<< HEAD
import json
import face_models
import blur_utils
from werkzeug.utils import secure_filename
from datetime import date, datetime, timedelta
from flask import (
    Flask,
    request,
    redirect,
    url_for,
    jsonify,
    abort,
    Response,
    render_template,
    send_from_directory,
    flash,
)
from flask_cors import CORS
# =======
# import face_models
import pose_models
import pose_utils
# from flask import Flask, render_template, Response
# >>>>>>> pose_detect
from flask_restful import Resource, Api, reqparse
from config import (
    basedir,
    PORT_NUMBER,
    HTTP,
    ADDR,
    UPLOAD_FOLDER,
    UPLOAD_SPEECH_FOLDER,
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

if not os.path.isdir(UPLOAD_FOLDER):
		os.mkdir(UPLOAD_FOLDER)
if not os.path.isdir(UPLOAD_SPEECH_FOLDER):
		os.mkdir(UPLOAD_SPEECH_FOLDER)

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


def gen(bt):
    jpg_bytes = bt.get_jpg_bytes()
    while jpg_bytes:
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpg_bytes + b'\r\n\r\n')
        jpg_bytes = bt.get_jpg_bytes()

# <<<<<<< HEAD

@app.route('/video_feed/<path:filename>')
def video_feed(filename):
    tolerance = 0.5
    # fr = face_models.faceDetectBlur()
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    fr = face_models.FaceRecog(filepath, tolerance)
    return Response(gen(fr),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/upload/<path:filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],filename, as_attachment=True)

@app.route('/blur/<path:filename>')
def blur_faces(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    blur_utils.blurOtherFaces(filepath, os.path.join(app.config['UPLOAD_FOLDER'], 'blur_' + filename))
    return send_from_directory(app.config['UPLOAD_FOLDER'],'blur_'+filename, as_attachment=True)

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
            return filename
        return redirect(request.url)

    def get(self):
        return 'get /upload'

class Knowns(Resource):
    def post(self):
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        for f in request.files.getlist('file'):
            if f.filename == '':
                flash('No selected file')
                return redirect(request.url)
            f.save(os.path.join(app.config['UPLOAD_FOLDER'], 'knowns', f.filename))
        
        return 'upload complete'
    def get(self):
        return 'get /upload/knowns'


class SpeechToText(Resource):
    def post(self):
        return 'get request'
    
    def post(self):
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        
        if file:
            fname = file.filename
            only_fname = os.path.splitext(fname)
            extension = only_fname[1]
            only_fname = only_fname[0]

            filename = secure_filename(only_fname + '-' + str(datetime.now()) + extension)
            filepath = os.path.join(UPLOAD_SPEECH_FOLDER, filename)
            file.save(filepath)
        
        # get only filename without extension
        filename = os.path.splitext(filename)[0]
        audio_name = filename + '.wav'
        subtitle_video_name = filename + '_subtitle.mp4'

        video_path = filepath
        audio_path = os.path.join(UPLOAD_SPEECH_FOLDER, audio_name)
        subtitle_video_path = os.path.join(UPLOAD_SPEECH_FOLDER, subtitle_video_name)

        videoToAudio(video_path, audio_path)

        words_list = speech_to_text(audio_path)
        cutting_list = find_words(words_list)

        if (len(cutting_list) == 0):
            print("Nothing to cut!")
            return 'Nothing to cut'
        
        merge_video = mergeVideos(video_path, cutting_list)
        # need mergeVideo's each text word (start, end) time
        new_words_list = newWordList(words_list, cutting_list)
        addSubtitles(merge_video, subtitle_video_path, new_words_list)

        return 'hello...?'

api.add_resource(SpeechToText, "/video_crop")
api.add_resource(Upload, "/upload")
api.add_resource(Knowns, "/upload/knowns")


if __name__ == '__main__':
    # ip_address = utils.get_ip_address()
    app.run(host=ADDR,port=PORT_NUMBER,debug=True)
    print(ADDR, PORT_NUMBER, HTTP)
