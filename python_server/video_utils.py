from moviepy.editor import VideoFileClip, concatenate_videoclips

def videoToAudio(video_path, audio_path):
    video = VideoFileClip(video_path)
    audio = video.audio
    audio.write_audiofile(audio_path)

# to cut video, use subclip(). e.g., clip2 = VideoFileClip(video2).subclip(4)
def mergeVideos(video1, video2, output_path):
    clip1 = VideoFileClip(video1)
    clip2 = VideoFileClip(video2)
    final_clip = concatenate_videoclips([clip1,clip2])
    final_clip.write_videofile(output_path, temp_audiofile='temp-audio.m4a', remove_temp=True, codec="libx264", audio_codec="aac")