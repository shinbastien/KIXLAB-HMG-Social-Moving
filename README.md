# KIXLAB-HMG-Social-Moving
---------
## 환경 설정
### 패키지 설치
> 배포 이전 로컬 환경에서 실행하기 위한 환경 설정이 필요하다.
> client 폴더, server 폴더를 각각 최상위 폴더로 두고,
> ```
> npm i 실행하여 package 설치
> ```

### API key 발급
> 새로운 API key를 발급받아서 client/.env 파일에 추가
> 1. TMap API key 발급
>> https://tmapapi.sktelecom.com/main.html#webv2/guide/apiGuide.guide2 에서 프로젝트 등록 후 발급
>> REACT_APP_TMAP_API_KEY 에 추가
> 2. Youtube API key 발급
>> https://developers.google.com/youtube/v3/getting-started?hl=ko 에서 애플리케이션 등록 후 Youtube Data API 발급
>> REACT_APP_YOUTUBE_API_KEY 에 추가
> 3. Firebase key 발급
>> Firebase Database 생성 후 프로젝트 링크 추가
>> Firebase API key 추가

### 로컬 환경에서 실행을 위한 코드 수정
> client/src/index.js 28번째 줄을 localhost로 변경
> ```
> <SocketProvider url="http://localhost:4000">
> ```

> server/src/server.js 14번째 줄을 4000으로 변경
  
  
## 실행 방법
> 두개의 터미널을 실행하여, 하나의 터미널을 client를 최상위 폴더로, 하나의 터미널을 server를 최상위 폴더로 실행
> client 터미널에서
> ```
> npm start 실행
> ```
> server 터미널에서
> ```
> npm run start:dev 실행



