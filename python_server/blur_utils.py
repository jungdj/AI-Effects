import cv2
import video_utils
import face_models

def blurAllFaces(video_path, output_path):
    model = "input/res10_300x300_ssd_iter_140000.caffemodel"
    prototxt = "input/deploy.prototxt"
    confidence = 0.5
    net = cv2.dnn.readNetFromCaffe(prototxt, model)
    video_utils.processVideo(video_path, output_path, face_models.faceDetectBlur, net, confidence)

def blurOtherFaces(video_path, output_path):
    fr = face_models.FaceRecog(video_path, 0.38)
    video_utils.processVideo(video_path, output_path, fr.faceRecogBlur)

# blurAllFaces('media/sample1.mov', 'media/output1.mp4')
# blurOtherFaces('uploads/yunayoona.mov', 'blur_yunayoona.mp4')