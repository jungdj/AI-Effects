import cv2
import video_utils
import face_models

def blurAllFaces(video_path, output_path):
    model = "input/res10_300x300_ssd_iter_140000[1].caffemodel"
    prototxt = "input/deploy.prototxt[1].txt"
    confidence = 0.5
    net = cv2.dnn.readNetFromCaffe(prototxt, model)
    video_utils.processVideo(video_path, output_path, face_models.faceDetectBlur, net, confidence)

def blurOtherFaces(video_path, output_path):
    tolerance = 0.4
    fr = face_models.FaceRecog(video_path, tolerance)
    video_utils.processVideo(video_path, output_path, fr.faceRecogBlur)

# blurAllFaces('media/sample1.mov', 'media/output1.mp4')
# blurOtherFaces('media/sample1.mov', 'media/output1.mp4')