#!/usr/bin/python
# -*- coding:utf-8 -*-
from moviepy.editor import (
  VideoFileClip,
  concatenate_videoclips,
  AudioFileClip,
  TextClip,
  CompositeVideoClip,
)
from moviepy.video.tools.subtitles import SubtitlesClip
import os.path as op
from moviepy.editor import VideoFileClip, concatenate_videoclips
import cv2
import subprocess, re


def videoToAudio(video_path, audio_path):
    video = VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(audio_path, fps=16000)

def getAudioLength(audio_path):
    audio = AudioFileClip(audio_path)
    return audio.duration

def getVideoLength(video_path):
    video = VideoFileClip(video_path)
    return video.duration
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
    clip = VideoFileClip(video_path)
    clip = clip.fx(*process)
    clip.write_videofile(output_path, temp_audiofile='temp-audio.m4a', remove_temp=True, codec="libx264", audio_codec="aac")

def processVideo_get_clip(video_path, output_path, *process):
    clip = get_clip(video_path)
    clip = clip.fx(*process)
    clip.write_videofile(output_path, temp_audiofile='temp-audio.m4a', remove_temp=True, codec="libx264", audio_codec="aac")

def mergeVideos(video_path, output_path, cutting_list):
    video = VideoFileClip(video_path)
    duration = video.duration

    cut_start = 0
    cut_end = 0
    clip_videos = []
    for i in range(len(cutting_list)+1):
        if (i == 0):
          cut_start = 0
          cut_end = cutting_list[i]['cut_start']
        elif (i == len(cutting_list)):
          cut_start = cutting_list[i-1]['cut_end']
          cut_end = duration
        else:
          cut_start = cutting_list[i-1]['cut_end']
          cut_end = cutting_list[i]['cut_start']

        clip = video.subclip(cut_start, cut_end)
        clip_videos.append(clip)
    
    final_clip = concatenate_videoclips(clip_videos)
    final_clip.write_videofile(output_path, temp_audiofile='temp-audio.m4a', remove_temp=True, codec="libx264", audio_codec="aac")


def newWordList(words_list, cutting_list):
    time_interval = 0
    new_words_list = []
    j = 0

    for i in range(len(words_list)):
        word =words_list[i]
        start_secs = word['start_secs']
        end_secs = word['end_secs']
        cut_start = cutting_list[j]['cut_start']
        cut_end = cutting_list[j]['cut_end']

        if (start_secs < cut_start) or (end_secs > cut_end):
            # word not cutted!
            new_words_list.append({
                'value': word['value'],
                'start_secs': start_secs - time_interval,
                'end_secs': end_secs - time_interval,
                'speaker_tag': word['speaker_tag'],
            })
        else:
            # cutted words
            if (i != len(words_list)-1):
                next_word = words_list[i+1]
                next_word_end_secs = next_word['end_secs']
                if (next_word_end_secs > cut_end):
                    # word is last word cutted by j-th cutting_element
                    if (j < len(cutting_list)-1):
                        j += 1
                    time_interval += cut_end - cut_start
    return new_words_list


def annotate(clip, txt, speaker, txt_color='white', fontsize=30, font='Arial'):
    """ Writes a text at the bottom of the clip. """
    txt_colors = ['red', 'black', 'white', 'blue', 'green']
    txtclip = TextClip(txt, fontsize=fontsize, font=font, color=txt_colors[speaker])
    cvc = CompositeVideoClip([clip, txtclip.set_pos(('center', 'bottom'))])
    return cvc.set_duration(clip.duration)

def addSubtitles(video_path, output_path, words_list):
    # video = merged new video file
    video = VideoFileClip(video_path)
    duration = video.duration

    subs = []
    sub_strings = ''

    start_secs = 0
    prev_speaker = words_list[0]['speaker_tag']
    for i in range(len(words_list)):
        word = words_list[i]
        speaker = word['speaker_tag']

        if (i == len(words_list)-1):
            sub_strings += word['value'] + ' '
            subs.append(((start_secs, duration), sub_strings, speaker))
        elif (prev_speaker != speaker):
            subs.append(((start_secs, words_list[i-1]['end_secs']), sub_strings, prev_speaker))
            sub_strings = word['value'] + ' '
            next_word = word
            prev_speaker = next_word['speaker_tag']
            start_secs = next_word['start_secs']
        elif (len(sub_strings) > 15):
            sub_strings += word['value'] + ' '
            subs.append(((start_secs, word['end_secs']), sub_strings, speaker))
            sub_strings = ''
            if (i != len(words_list)-1):
                next_word = words_list[i+1]
                prev_speaker = next_word['speaker_tag']
                start_secs = next_word['start_secs']
        else:
            sub_strings += word['value'] + ' '
    
    annotated_clips = [annotate(video.subclip(from_t, to_t), txt, speaker) for (from_t, to_t), txt, speaker in subs]
    final_clip = concatenate_videoclips(annotated_clips)
    final_clip.write_videofile(output_path,  fps=video.fps, temp_audiofile="temp-audio.m4a", remove_temp=True, codec="libx264", audio_codec="aac")

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
