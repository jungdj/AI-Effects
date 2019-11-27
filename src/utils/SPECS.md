# List of Features

### Pose
### Speech to Text
### Face Blur


## Pose

클라이언트
1. 영상 업로드
2. 라이브러리에서 영상처리, boundary 정보를 얻음
3. boundary를 canvas에 그림
4. 2,3을 하는 동안 서버에 영상 전송

서버
1. 두 영상의 포즈 정보 얻음
2. 제일 좋은 결합 포인트 찾음
3. 영상 합치고 저장

## Speech to Text

1. 영상 업로드
2. 영상에서 음성 분리, 파일로 저장
3. 음성 파일을 Google Cloud Speech to Text에 전송
4. 전송받은 정보를 바탕으로 영상을 자르고 붙임.
5. 가능하다면, 영상에 자막 달기
6. 인터렉션 추가하기

## Face Blurㅍ

1. 영상 업로드
2. 라이브러리로 영상처리, boundary 정보를 얻음
3. boundary를 캔버스에 그림

## 공통 기능
1. 
