import numpy as np
import cv2
import video_utils
from scipy.interpolate import interp1d
from moviepy.editor import VideoFileClip

def faceDetectBlur(clip, net, confidence_threshold):
    #if r_blur is None: r_blur = 2*r_zone/3
    
    def fl(gf,t):
        im = gf(t)
        im_copy = im.copy()
        h,w,d = im.shape
        
        blob = cv2.dnn.blobFromImage(cv2.resize(im, (300, 300), interpolation = cv2.INTER_AREA), 1.0,
            (300, 300), (104.0, 177.0, 123.0))
     
    	# pass the blob through the network and obtain the detections and
    	# predictions
        net.setInput(blob)
        detections = net.forward()
    	
        # loop over the detections
        for i in range(0, detections.shape[2]):
            # extract the confidence (i.e., probability) associated with the
            # prediction
            confidence = detections[0, 0, i, 2]
        
            # filter out weak detections by ensuring the `confidence` is
            # greater than the minimum confidence
            if confidence < confidence_threshold:
                continue
        
            # compute the (x, y)-coordinates of the bounding box for the
            # object
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
        
            # draw the bounding box of the face along with the associated
            # probability
            # text = "{:.2f}%".format(confidence * 100)
            # y = startY - 10 if startY - 10 > 10 else startY + 10
            # cv2.rectangle(im, (startX, startY), (endX, endY), (0, 0, 255), 2)
            # cv2.putText(im, text, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
            
            orig = im[startY:endY, startX:endX]
            blurred = cv2.GaussianBlur(orig,(35, 35), 30)
            im_copy[startY:endY, startX:endX] = blurred
        return im_copy
    
    return clip.fl(fl)
    
def blurAllFaces(video_path, output_path):
    model = "input/res10_300x300_ssd_iter_140000[1].caffemodel"
    prototxt = "input/deploy.prototxt[1].txt"
    confidence = 0.5
    net = cv2.dnn.readNetFromCaffe(prototxt, model)
    video_utils.processVideo(video_path, output_path, faceDetectBlur, net, confidence)

# blurAllFaces('media/sample1.mov', 'media/output1.mp4')