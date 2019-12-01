#!/usr/bin/python
# -*- coding:utf-8 -*-
import os
import sys
import json
import face_models
import blur_utils
import pose_models
import pose_utils
import faces_clustering
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
    UPLOAD_POSE_FOLDER,
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
if not os.path.isdir(UPLOAD_POSE_FOLDER):
		os.mkdir(UPLOAD_POSE_FOLDER)

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    fr = face_models.FaceRecog(filepath, tolerance)
    return Response(gen(fr),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# Pose detect Webcam function
@app.route('/video_feed/pose/<path:filename>')
def video_feed_pose(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    pd = pose_models.BodyDetect(video_path=filepath)
    return Response(gen(pd),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/upload/<path:filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],filename, as_attachment=True)

@app.route('/blur/<path:filename>')
def blur_faces(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    blur_utils.blurOtherFaces(filepath, os.path.join(app.config['UPLOAD_FOLDER'], 'blur_' + filename))
    return send_from_directory(app.config['UPLOAD_FOLDER'],'blur_'+filename, as_attachment=True)

@app.route('/extract_faces/<path:filename>')
def extract_faces(filename):
    epf = ExtractPeopleFaces()
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
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

        words_list = speech_to_text(audio_path, SPEECHTOTEXT_SPEAKER_COUNT)
        cutting_list = find_words(words_list)
        # cutting_list = find_youknow(words_list)

        merge_video = None
        new_words_list = None

        if (len(cutting_list) == 0):
            merge_video = VideoFileClip(video_path)
            print("Nothing to cut!")
            new_words_list = words_list
        else:
            merge_video = mergeVideos(video_path, cutting_list)
            # need mergeVideo's each text word (start, end) time
            new_words_list = newWordList(words_list, cutting_list)

        addSubtitles(merge_video, subtitle_video_path, new_words_list)

        return 'hello...?'

# input : One video
# output : video with skeleton
# form format {'file' : video want to get skeleton}
@app.route('/add_pose_skeleton', methods = ['POST'])
def add_pose_skeleton():
    if 'file' not in request.files:
        flash('No file part')
        return redirect(request.url)

    file = request.files['file']
    if file.filename == '':
        flash('No selected file')
        return redirect(request.url)

    if file:
        ts=time.time()
        ts=str(int(ts))
        temp_dir = os.path.join(UPLOAD_POSE_FOLDER, ts)
        if os.path.isdir(temp_dir):
            flash("There are too many requests. Please run it again in a moment.")
            return "Multiple request at same time error"
        os.mkdir(temp_dir)

        filename = secure_filename(file.filename)
        filepath = os.path.join(temp_dir, filename)
        file.save(filepath)

        # get only filename without extension
        file_without_ext = os.path.splitext(filename)[0]
        ext = os.path.splitext(filename)[1]
        output_name = file_without_ext + "_with_pose" + ext
        output_path = os.path.join(temp_dir, output_name)

        pose_utils.detectAllPoses(filepath, output_path)

        @after_this_request
        def delete_temp_files(response):
            os.remove(filepath)
            os.remove(output_path)
            os.rmdir(temp_dir)
            return response

        return send_from_directory(directory=temp_dir, filename=output_name)

    return 'PANIC cannot reach here'

# input : two video, optional one text
# output : Merged One video (skeleton or not)
# form format {'first' : first video to merge(type file)
#              'second' : second video to merge(type file)
#              (Optional)'with_skeleton' : if merge video need skeleton true of True. default False}
def merge():
    if request.method == 'POST':
        if 'first' not in request.files or 'second' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file1 = request.files['first']
        file2 = request.files['second']

        if file1.filename == '' or file2.filename =='':
            flash('No selected file')
            return redirect(request.url)

        with_skeleton = False
        if request.form['with_skeleton'] == "true" or request.form['with_skeleton'] == "True":
            with_skeleton = True
        if file1 and file2:
            ts=time.time()
            ts=str(int(ts))
            temp_dir = os.path.join(UPLOAD_POSE_FOLDER, ts)
            if os.path.isdir(temp_dir):
                flash("There are too many requests. Please run it again in a moment.")
                return "Multiple request at same time error"
            os.mkdir(temp_dir)

            filename1 = secure_filename(file1.filename)
            filepath1 = os.path.join(temp_dir, filename1)
            file1.save(filepath1)

            filename2 = secure_filename(file2.filename)
            filepath2 = os.path.join(temp_dir, filename2)
            file2.save(filepath2)

            # get only filename without extension
            file_without_ext = os.path.splitext(filename1)[0]
            ext = os.path.splitext(filename1)[1]
            output_name = file_without_ext + "_with_pose" + ext
            output_path = os.path.join(temp_dir, output_name)

            pose_utils.TwoVideoProcess(filepath1, filepath2, output_path, with_skeleton)

            @after_this_request
            def delete_temp_files(response):
                os.remove(filepath1)
                os.remove(filepath2)
                os.remove(output_path)
                os.rmdir(temp_dir)
                return response

            return send_from_directory(directory=temp_dir, filename=output_name)

        return 'PANIC cannot reach here'

api.add_resource(SpeechToText, "/video_crop")
api.add_resource(Upload, "/upload")
api.add_resource(Knowns, "/upload/knowns")

if __name__ == '__main__':
    # ip_address = utils.get_ip_address()
    app.run(host=ADDR,port=PORT_NUMBER,debug=True)
    print(ADDR, PORT_NUMBER, HTTP)
