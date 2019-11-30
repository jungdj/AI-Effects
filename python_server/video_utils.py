from moviepy.editor import VideoFileClip, concatenate_videoclips
import cv2
import subprocess, re


def videoToAudio(video_path, audio_path):
    video = VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(audio_path)

# to cut video, use subclip(). e.g., clip2 = VideoFileClip(video2).subclip(4)
def mergeVideos(video1, video2, output_path):
    clip1 = get_clip(video1)
    clip2 = get_clip(video2)
    final_clip = concatenate_videoclips([clip1,clip2])
    final_clip.write_videofile(output_path, temp_audiofile='temp-audio.m4a', remove_temp=True, codec="libx264", audio_codec="aac")


def mergeVideos_with_time(video1, video2, t2, output_path, with_skeleton, *process):
    clip1 = get_clip(video1)
    clip2 = get_clip(video2)
    sub_clip2 = clip2.subclip(t2)

    if with_skeleton:
        clip1 = clip1.fx(*process)
        sub_clip2 = sub_clip2.fx(*process)
    final_clip = concatenate_videoclips([clip1,sub_clip2])
    final_clip.write_videofile(output_path, temp_audiofile='temp-audio.m4a', remove_temp=True, codec="libx264", audio_codec="aac")


def processVideo(video_path, output_path, *process):
    clip = get_clip(video_path)
    clip = clip.fx(*process)
    clip.write_videofile(output_path, temp_audiofile='temp-audio.m4a', remove_temp=True, codec="libx264", audio_codec="aac")


# In phone video, we need to check how rotated
def check_is_rotated(video_path):
    cmd = 'ffmpeg -i %s' % video_path

    p = subprocess.Popen(
        cmd.split(" "),
        stderr=subprocess.PIPE,
        close_fds=True
    )
    stdout, stderr = p.communicate()

    reo_rotation = re.compile(b'rotate\s+:\s(?P<rotation>.*)')
    match_rotation = reo_rotation.search(stderr)
    rotation = 0
    if match_rotation is not None:
        rotation = match_rotation.groups()[0].decode()

    if rotation == "90" or rotation == "270" or rotation == "-90":
        return True
    return False


def get_clip(video_path):
    vid = cv2.VideoCapture(video_path)
    height = vid.get(cv2.CAP_PROP_FRAME_HEIGHT)
    width = vid.get(cv2.CAP_PROP_FRAME_WIDTH)

    if check_is_rotated(video_path):
        width, height = height, width

    # print("width, height", width, height)
    return VideoFileClip(video_path, target_resolution=(int(height), int(width)))

