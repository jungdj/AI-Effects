from moviepy.editor import VideoFileClip, concatenate_videoclips, AudioFileClip

def videoToAudio(video_path, audio_path):
    video = VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(audio_path)

def getAudioLength(audio_path):
    audio = AudioFileClip(audio_path)
    return audio.duration

def getVideoLength(video_path):
    video = VideoFileClip(video_path)
    return video.duration

# to cut video, use subclip(). e.g., clip2 = VideoFileClip(video2).subclip(4)
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
