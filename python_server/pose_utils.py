import cv2
import video_utils
import pose_models
import config
import time
import os

# function for video -> video with skeleton
def detectAllPoses(video_path, output_path):
    bt = pose_models.BodyDetect()
    video_utils.processVideo_get_clip(video_path, output_path, bt.bodyDetectVideo)
    return

# video 1, video2 -> new video start with video 1 + sub video 2 so that it can be connected naturally
# with skelton, we need much more time to process
def TwoVideoProcess(video_path1, video_path2, output_path, with_skeleton=False):
    video_name1, ext = os.path.splitext(os.path.basename(video_path1))
    temp_name = str(int(time.time())) + ext
    temp_path = os.path.join(config.UPLOAD_FOLDER, temp_name)
    bt = pose_models.BodyDetect()

    # get last frame of fisrt video.
    video_utils.processVideo_get_clip(video_path1, temp_path,bt.get_last_frame)
    last_frame = bt.last_frame
    bt.reference = bt.frame_to_human(last_frame)

    # Merge two video. totally video 1 + (bt.time_checker ~ end) video 2
    video_utils.processVideo_get_clip(video_path2, temp_path, bt.bodyDetectVideo_for_merge)
    # print(bt.time_checker, "is point for merge")

    # Just merge it
    video_utils.mergeVideos_with_time(video_path1, video_path2, bt.time_checker, output_path, with_skeleton, bt.bodyDetectVideo)
    if os.path.isfile(temp_path):
        os.remove(temp_path)
    return


# detectAllPoses("media/sample1.mp4", 'media/output1.mp4')
# detectAllPoses("media/beforejump.mp4", 'media/outputbefore.mp4')
# detectAllPoses("media/afterjump.mp4", 'media/outputafter.mp4')
# TwoVideoProcess("media/beforejump.mp4", "media/afterjump.mp4", "media/jump.mp4", False)
