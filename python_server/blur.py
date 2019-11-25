import json
import cv2
import blur_utils as blur
from moviepy.editor import *
#from moviepy.video.tools.tracking import manual_tracking

inputVideo = "media/sample1.mov"
outputVideo = "media/output1.mp4"
# Caffe 'deploy' prototxt file
prototxt = "input/deploy.prototxt[1].txt"
model = "input/res10_300x300_ssd_iter_140000[1].caffemodel"
# Minimum probability to filter weak detections
confidence = 0.5

net = cv2.dnn.readNetFromCaffe(prototxt, model)

# LOAD THE ORIGINAL CLIP 
clip = VideoFileClip(inputVideo)
clip = clip.fx(blur.blurFaces, net, confidence)
clip.write_videofile(outputVideo)

