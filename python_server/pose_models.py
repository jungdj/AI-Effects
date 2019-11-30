import argparse
import time

import cv2
import numpy as np

from tf_pose.estimator import TfPoseEstimator
from tf_pose.networks import get_graph_path, model_wh


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


class BodyDetect():
    def __init__(self, reference = None, video_path = None, model = 'mobilenet_thin', resolution='480x720', showBG=''):
        # model : 'cmu / mobilenet_thin / mobilenet_v2_large / mobilenet_v2_small'
        # resoultion : 'network input resolution. default=432x368'
        # showBG : 'Use it with any non-empty string to show skeleton only.'

        self.camera = VideoCamera(video_path)

        # Initialize some variables
        self.w, self.h = model_wh(resolution)
        self.estimator = TfPoseEstimator(get_graph_path(model), target_size=(self.w, self.h))
        self.showBG = showBG
        self.time_checker = 0.0
        self.best_score = float("inf") # lower is better, always positive
        self.reference = reference # human object.
        self.last_frame = None

    def __del__(self):
        del self.camera

    def process_frame(self, frame):
            frame = frame.copy()
            # humans = e.inference(frrame, resize_to_default=)
            humans = self.estimator.inference(frame, resize_to_default=True, upsample_size=4.0)
            if self.showBG:
                frame = np.zeros(frame.shape)
            # print("before",frame.shape[1], "x", frame.shape[0])
            frame = TfPoseEstimator.draw_humans(frame, humans, imgcopy=False)
            # print("after", frame.shape[1], "x", frame.shape[0])

            return frame

    def eval_frame_with_reference(self, target_frame, reference_frame, time):
        humans = self.estimator.inference(target_frame, resize_to_default=True, upsample_size=4.0)

        current_score = TfPoseEstimator.get_pose_fit_score(humans, reference_frame)
        # print("current_score", current_score, "best_score", self.best_score, "check time", time)
        if current_score < self.best_score:
            self.best_score = current_score
            self.time_checker = time
        return time

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

    # Web cam version (just pose estimate)
    def bodyDetectVideo(self, clip):
        def fl(get_frame, t):
            frame = get_frame(t)
            return self.process_frame(frame)
        return clip.fl(fl)

    # Server processing version (for cut and merge)
    # clip : second video, reference : reference image for cut
    # check first 10 seconds of second video
    def bodyDetectVideo_for_merge(self, clip):
        def fl(get_frame, t):
            frame = get_frame(t)
            if t < 10:
                self.eval_frame_with_reference(frame, self.reference, t)
            return frame
        return clip.fl(fl)

    # One frame to human. Only one human because we modify estimate_paf of estimator.py
    def frame_to_human(self, frame):
        humans = self.estimator.inference(frame, resize_to_default=True, upsample_size=4.0)
        if len(humans) != 1:
            # we can do it just one person case
            raise NotImplementedError
        return humans[0]

    # get last frame for clip helper funcion
    def get_last_frame(self, clip):
        def fl(get_frame, t):
            frame = get_frame(t)
            self.last_frame = frame
            return frame
        return clip.fl(fl)
