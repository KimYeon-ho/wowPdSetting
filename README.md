# WOW PD 작업 가이드

> 설명하기에 앞서 잘 모르는 용어나 설치 관련 자세한 방법은 [구글링](http://www.google.com/)으로:)

## Gulp 설치하기
1. proxy 설정이 안되어있는 경우 터미널(windows : 시작 - 실행 - cmd 입력)을 통해 [설정](http://13.124.129.30:8060/Team3/javascript/wikis/Tips/npm-proxy-%EC%84%A4%EC%A0%95)한다.
2. 터미널에 명령어로 ```node -v``` 를 입력하여 현재 버전을 확인한다.
3. v8.10.0 버전보다 낮거나 존재하지 않는 경우에 node.js를 [설치](https://nodejs.org/ko/)한다.
4. 기존에 낮은 버전의 node가 존재하나 삭제하면 안될 경우에는 node를 여러 버전으로 사용할 수 있는 nvm을 [설치](https://sharryhong.github.io/2016/12/20/nodejs-nvm/)하여 관리하면 된다.
5. 설치가 완료되면 터미널에 ```sudo npm i -g gulp``` (windows : ```npm i -g gulp```)를 입력하여 전역에 gulp를 설치한다.

## 작업 환경 세팅하기
1. 프로젝트를 생성해야 하는 경우 작업할 프로젝트 위치에 소스를 [다운로드](http://13.124.129.30:8060/Team3/wow-project-setting/repository/master/archive.zip)한 이후 svn에 아래 항목을 Import 한다.
    - public/css
    - public/html
    - public/is
    - public/js
    - gulpfile.js
    - package.json
    - package-lock.json
2. 생성된 프로젝트를 작업해야 하는 경우 svn에서 Checkout 한다.
3. 터미널에 ```cd 해당 디렉토리 경로```를 입력하여 해당 프로젝트 경로를 바라보게 한다.
4. 해당 디렉토리 경로에서 ```npm i```를 입력하면 node_modules 폴더가 생성되면서 라이브러리들을 설치한다.
5. 이제 작업 환경 세팅은 완료되었으며, 작업 중에 svn에 commit 할 시에는 아래 항목만 올려주면 된다.
    - public/css
    - public/html
    - public/is
    - public/js

## 작업시 유의사항
- **public/html/index.html**
    - kv가 없는 프로젝트인 경우 ```<!-- split _kv.html --> ~ <!-- split end -->``` 영역 전체를 지워준다.
- **public/css/new_sec_pdp.css**
    - 벤더 프리픽스는 빌드시 자동으로 적용되니 따로 설정하지 않는다.
    - 부분적으로 수동 설정을 하기 원할 경우 해당 셀렉터 내에 ```/*! autoprefixer: OFF */``` 를 삽입한다.

## 번들링 내용
* css, js 난독화
* css vender prefix
* es6 -> es5 transpiling
* 웹서버 실행
* 로컬용, AEM용 페이지 자동 추출
* 최종전달용 txt 파일 자동 추출

## 명령어
* ```gulp local``` : 로컬용 페이지 browserSync 실행
* ```gulp``` : 번들러 적용 및 AEM용 페이지 browserSync 실행 후 txt 파일 추출