#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import sys
import json
import face_models
import blur_utils
import pose_models
import pose_utils
import face_clustering
import time
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
    after_this_request
)
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from config import (
    basedir,
    PORT_NUMBER,
    HTTP,
    ADDR,
    UPLOAD_FOLDER,
    UPLOAD_SPEECH_FOLDER,
    SPEECHTOTEXT_SPEAKER_COUNT,
)
from moviepy.editor import VideoFileClip
from speechToText import (
    speech_to_text,
    find_youknow,
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
UPLOAD_FOLDER = UPLOAD_FOLDER

CORS(app)

api = Api(app)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
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

@app.route('/video_feed/<path:filename>')
def video_feed(filename):
    tolerance = 0.5
    # fr = face_models.faceDetectBlur()
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    fr = face_models.FaceRecog(filepath, tolerance)
    return Response(gen(fr),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Pose detect Webcam function
@app.route('/video_feed/pose/<path:filename>')
def video_feed_pose(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    pd = pose_models.BodyDetect(video_path=filepath)
    return Response(gen(pd),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/upload/<path:filename>')
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER,filename, as_attachment=True)

@app.route('/blur/<path:filename>')
def blur_faces(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    blur_utils.blurOtherFaces(filepath, os.path.join(UPLOAD_FOLDER, 'blur_' + filename))
    return send_from_directory(UPLOAD_FOLDER,'blur_'+filename, as_attachment=True)

@app.route('/extract_faces/<path:filename>')
def extract_faces(filename):
    epf = ExtractPeopleFaces()
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    epf.encode(filepath, 1)
    epf.cluster()
    return 'extract done'

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
            name, ext = os.path.splitext(filename)
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            file.save(filepath)
            filedir = os.path.join(basedir, name)
            if not os.path.isdir(filedir):
                os.mkdir(filedir)
                os.mkdir(filedir + '/people')
                os.mkdir(filedir +'/knowns')

        return redirect(request.url)

    def get(self):
        return 'get /upload'

class Knowns(Resource):
    def post(self):
        videoname = request.form['videoname']
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        for f in request.files.getlist('file'):
            if f.filename == '':
                flash('No selected file')
                return redirect(request.url)
            f.save(os.path.join(UPLOAD_FOLDER, 'knowns', f.filename))
        
        return 'upload complete'
    def get(self):
        return 'get /upload/knowns'


class SpeechToText(Resource):
    def post(self):
        return 'get request'
    
    def get(self, filename):
        file_path = os.path.join(UPLOAD_SPEECH_FOLDER, filename)
        # get only filename without extension
        filename = os.path.splitext(filename)[0]
        audio_name = filename + '.wav'
        merge_video_name = filename + '_merge.mp4'
        subtitle_video_name = filename + '_subtitle.mp4'

        video_path = file_path
        audio_path = os.path.join(UPLOAD_SPEECH_FOLDER, audio_name)
        merge_video_path = os.path.join(UPLOAD_SPEECH_FOLDER, merge_video_name)
        subtitle_video_path = os.path.join(UPLOAD_SPEECH_FOLDER, subtitle_video_name)

        videoToAudio(video_path, audio_path)

        words_list = speech_to_text(audio_path, SPEECHTOTEXT_SPEAKER_COUNT)
        cutting_list = find_words(words_list)
        # cutting_list = find_youknow(words_list)

        final_video_path = None
        new_words_list = None

        if (len(cutting_list) == 0):
            final_video_path = video_path
            print("Nothing to cut!")
            new_words_list = words_list
        else:
            final_video_path = merge_video_path
            mergeVideos(video_path, merge_video_path, cutting_list)
            # need mergeVideo's each text word (start, end) time
            new_words_list = newWordList(words_list, cutting_list)

        addSubtitles(final_video_path, subtitle_video_path, new_words_list)

        return 'get /video_crop'

# input : One video
# output : video with skeleton
# form format {'filename' : video name want to get skeleton}
@app.route('/add_pose_skeleton', methods = ['POST'])
def add_pose_skeleton():
    filename = request.form['filename']
    if filename == '':
        flash('No selected file')
        return redirect(request.url)

    if filename:
        ts=time.time()
        ts=str(int(ts))

        filepath = os.path.join(UPLOAD_FOLDER, filename)

        # get only filename without extension
        file_without_ext = os.path.splitext(filename)[0]
        ext = os.path.splitext(filename)[1]
        output_name = file_without_ext + "_with_pose" + ext
        file_dir = os.path.join(UPLOAD_FOLDER, file_without_ext)
        output_path = os.path.join(file_dir, output_name)

        pose_utils.detectAllPoses(filepath, output_path)

        return "success"

    return 'PANIC cannot reach here'


# input : two video, optional one text
# output : Merged One video (skeleton or not)
# form format {'first_filename' : first video name to merge(text file)
#              'second_filename' : second video name to merge(text file)
#              (Optional)'with_skeleton' : if merge video need skeleton true of True. default False}
@app.route('/merge', methods = ['POST'])
def merge():
    if request.method == 'POST':
        if 'first_filename' not in request.form or 'second_filename' not in request.form:
            flash('No file part')
            return redirect(request.url)

        filename1 = request.form['first_filename']
        filename2 = request.form['second_filename']

        with_skeleton = False
        if request.form['with_skeleton'] == "true" or request.form['with_skeleton'] == "True":
            with_skeleton = True
        if filename1 and filename2:
            ts=time.time()
            ts=str(int(ts))

            filepath1 = os.path.join(UPLOAD_FOLDER, filename1)
            filepath2 = os.path.join(UPLOAD_FOLDER, filename2)

            # get only filename without extension
            file1_without_ext = os.path.splitext(filename1)[0]
            file2_without_ext = os.path.splitext(filename2)[0]
            ext = os.path.splitext(filename1)[1]
            output_name = file1_without_ext + "_" + file2_without_ext + "_merge" + ext
            file1_dir = os.path.join(UPLOAD_FOLDER, file1_without_ext)
            output_path = os.path.join(file1_dir, output_name)

            pose_utils.TwoVideoProcess(filepath1, filepath2, output_path, with_skeleton)

            # return send_from_directory(directory=temp_dir, filename=output_name)

            return "success"

        return 'PANIC cannot reach here'

api.add_resource(SpeechToText, "/video_crop/<path:filename>")
api.add_resource(Upload, "/upload")
api.add_resource(Knowns, "/upload/knowns")

if __name__ == '__main__':
    # ip_address = utils.get_ip_address()
    app.run(host=ADDR,port=PORT_NUMBER,debug=True)
    print(ADDR, PORT_NUMBER, HTTP)
