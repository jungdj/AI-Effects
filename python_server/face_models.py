import numpy as np
import cv2
import face_recognition
import os

class VideoCamera(object):
    def __init__(self, video_path = None):
        if video_path == None:  # webcam
            self.video = cv2.VideoCapture(0)
        else:
            self.video = cv2.VideoCapture(video_path)

    def __del__(self):
        self.video.release()

    def get_frame(self):
        ret, frame = self.video.read()
        return frame

# tolerance: How much distance between faces to consider it a match. Lower is more strict.
class FaceRecog():
    def __init__(self, video_path = None, tolerance = 0.4):
        self.camera = VideoCamera(video_path)

        self.known_face_encodings = []
        self.known_face_names = []

        # Load pictures of known people and learn how to recognize it.
        videoname, _ = os.path.splitext(os.path.basename(video_path))
        dirname = os.path.join(videoname, 'knowns')
        files = os.listdir(dirname)
        for filename in files:
            name, ext = os.path.splitext(filename)
            if ext == '.jpg':
                self.known_face_names.append(name)
                print(name)
                pathname = os.path.join(dirname, filename)
                img = face_recognition.load_image_file(pathname)
                face_encoding = face_recognition.face_encodings(img)[0]
                self.known_face_encodings.append(face_encoding)

        # Initialize some variables
        self.face_locations = []
        self.face_encodings = []
        self.face_names = []
        self.process_this_frame = True
        self.tolerance = tolerance

    def __del__(self):
        del self.camera

    def process_frame(self, frame):
        frame = frame.copy()
        # Resize frame of video to 1/4 size for faster face recognition processing
        small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)

        # Convert the image from BGR color (which OpenCV uses) to RGB color (which face_recognition uses)
        rgb_small_frame = small_frame[:, :, ::-1]

        # Only process every other frame of video to save time
        if self.process_this_frame:
            # Find all the faces and face encodings in the current frame of video
            self.face_locations = face_recognition.face_locations(rgb_small_frame)
            self.face_encodings = face_recognition.face_encodings(rgb_small_frame, self.face_locations)

            self.face_names = []
            for face_encoding in self.face_encodings:
                # See if the face is a match for the known face(s)
                distances = face_recognition.face_distance(self.known_face_encodings, face_encoding)
                name = "Unknown"
                if distances != None:
                    min_value = min(distances)

                    if min_value < self.tolerance:
                        index = np.argmin(distances)
                        name = self.known_face_names[index]

                self.face_names.append(name)

        self.process_this_frame = not self.process_this_frame

        # Display the results
        for (top, right, bottom, left), name in zip(self.face_locations, self.face_names):
            # Scale back up face locations since the frame we detected in was scaled to 1/4 size
            top *= 4
            right *= 4
            bottom *= 4
            left *= 4

            # Draw a box and label with a name around the face
            # cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)
            # cv2.rectangle(frame, (left, bottom - 35), (right, bottom), (0, 0, 255), cv2.FILLED)
            # font = cv2.FONT_HERSHEY_DUPLEX
            # cv2.putText(frame, name, (left + 6, bottom - 6), font, 1.0, (255, 255, 255), 1)

            if name == "Unknown":
                orig = frame[top:bottom, left:right]
                blurred = cv2.GaussianBlur(orig,(39, 39), 30)
                frame[top:bottom, left:right] = blurred

        return frame

    def get_jpg_bytes(self):
        # Grab a single frame of video
        frame = self.camera.get_frame()
        if frame is None:
            return
        frame = self.process_frame(frame)
        # We are using Motion JPEG, but OpenCV defaults to capture raw images,
        # so we must encode it into JPEG in order to correctly display the
        # video stream.
        _, jpg = cv2.imencode('.jpg', frame)
        return jpg.tobytes()
    
    def faceRecogBlur(self, clip):
        def fl(get_frame,t):
            frame = get_frame(t)
            return self.process_frame(frame)
        return clip.fl(fl)


def faceDetectBlur(clip, net, confidence_threshold):    
    def fl(gf,t):
        im = gf(t)
        im_copy = im.copy()
        h,w,d = im.shape
        
        blob = cv2.dnn.blobFromImage(cv2.resize(im, (300, 300), interpolation = cv2.INTER_AREA), 1.0,
            (300, 300), (104.0, 177.0, 123.0))
        net.setInput(blob)
        detections = net.forward()
    	
        # loop over the detections
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence < confidence_threshold:
                continue
        
            # compute bounding box
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (startX, startY, endX, endY) = box.astype("int")
        
            # draw the bounding box
            # text = "{:.2f}%".format(confidence * 100)
            # y = startY - 10 if startY - 10 > 10 else startY + 10
            # cv2.rectangle(im, (startX, startY), (endX, endY), (0, 0, 255), 2)
            # cv2.putText(im, text, (startX, y), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 0, 255), 2)
            
            orig = im[startY:endY, startX:endX]
            blurred = cv2.GaussianBlur(orig,(35, 35), 30)
            im_copy[startY:endY, startX:endX] = blurred
        return im_copy
    
    return clip.fl(fl)

def videoExtractFaces(path): 
    video = cv2.VideoCapture(path) 
    count = 0

    model = "input/res10_300x300_ssd_iter_140000.caffemodel"
    prototxt = "input/deploy.prototxt"
    net = cv2.dnn.readNetFromCaffe(prototxt, model)
    confidence_threshold = 0.5

    success, image = video.read()
    while success:
        imageExtractFaces(image, net, confidence_threshold, count)
        # cv2.imwrite(ouput_dir + "/frame%d.jpg" % count, image) 
        count += 1
        success, image = video.read()   


def imageExtractFaces(im, net, confidence_threshold, frame_number):
    ouput_dir = "faces"      
    if not os.path.exists(ouput_dir):
        os.makedirs(ouput_dir)

    h,w,d = im.shape
    blob = cv2.dnn.blobFromImage(cv2.resize(im, (300, 300), interpolation = cv2.INTER_AREA), 1.0,
        (300, 300), (104.0, 177.0, 123.0))
    
    net.setInput(blob)
    detections = net.forward()
    count = 0

    # Create frame around face
    for i in range(0, detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence < confidence_threshold:   # filter out weak detections
            continue
    
        # compute bounding box
        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
        (startX, startY, endX, endY) = box.astype("int")

        count += 1
        frame = im[startY:endY, startX:endX]
        if frame.size:
            cv2.imwrite(ouput_dir + '/' + str(frame_number) + '_' + str(i) + '.jpg', frame)
