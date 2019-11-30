import cv2
import video_utils
import pose_models

# function for video -> video with skeleton
def detectAllPoses(video_path, output_path):
    bt = pose_models.BodyDetect()
    video_utils.processVideo(video_path, output_path, bt.bodyDetectVideo)
    return

# video 1, video2 -> new video start with video 1 + sub video 2 so that it can be connected naturally
# with skelton, we need much more time to process
def TwoVideoProcess(video_path1, video_path2, output_path, with_skeleton=False):
    temp_file = "media/temp.mp4"
    bt = pose_models.BodyDetect()

    # get last frame of fisrt video.
    video_utils.processVideo(video_path1, temp_file,bt.get_last_frame)
    last_frame = bt.last_frame
    bt.reference = bt.frame_to_human(last_frame)

    # Merge two video. totally video 1 + (bt.time_checker ~ end) video 2
    video_utils.processVideo(video_path2, temp_file, bt.bodyDetectVideo_for_merge)
    # print(bt.time_checker, "is point for merge")

    # Just merge it
    video_utils.mergeVideos_with_time(video_path1, video_path2, bt.time_checker, output_path, with_skeleton, bt.bodyDetectVideo)
    return


# detectAllPoses("media/sample1.mp4", 'media/output1.mp4')
# detectAllPoses("media/beforejump.mp4", 'media/outputbefore.mp4')
# detectAllPoses("media/afterjump.mp4", 'media/outputafter.mp4')
TwoVideoProcess("media/beforejump.mp4", "media/afterjump.mp4", "media/jump.mp4", True)