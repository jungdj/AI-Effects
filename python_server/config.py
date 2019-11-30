import os
# import utils

basedir = os.path.dirname(os.path.abspath(__file__))

PORT_NUMBER	= 5000

DEFAULT_HTTP = "https://"
HTTP = os.getenv('ENV_HTTP', DEFAULT_HTTP)
DEFAULT_ADDR = "127.0.0.1"
ADDR = os.getenv('ENV_ADDR_API', DEFAULT_ADDR)
UPLOAD_FOLDER = os.path.join(basedir, 'uploads')
UPLOAD_SPEECH_FOLDER = os.path.join(UPLOAD_FOLDER, 'speech')
SPEECHTOTEXT_SPEAKER_COUNT = 3
