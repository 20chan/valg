# valg

발하임 서버 관리툴
작고 귀여운 내 홈서버에 리소스 많이먹는 발하임 서버를 무작정 24시간 켜두는건 무리가 있다 싶어서 친구들이 서버 키고끄고 맵 다운로드/업로드 등을 할 수 있게

![preview](/imgs/preview.png)

## Progress

- [x] backend
  - [x] fetch service status/resource
  - [x] trigger service active/inactive
  - [ ] backup/download/upload world data
  - [x] api route
- [x] frontend
  - [x] fetch status
  - [x] monitor resources
  - [x] trigger start/stop

## run

baseurl때문에 react-scripts build + serve 로 돌리기가 까다롭다

일단 수동으로 react-scripts build 이후 build 디렉터리의 index.html을 제외한 모든 파일을 build/valg/ 디렉터리로 옮겨서 serve -s build -l 8081 로 돌린다
