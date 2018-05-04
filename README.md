# WOW PD 작업 가이드

## 작업하기 전에
1. 프로젝트명 폴더에 소스를 다운받는다.
2. 터미널을 실행하여 ```cd 해당 디렉토리```를 입력한다. (웹스톰 등 IDE에서 실행시 자동으로 위치한다.)
3. ```npm i```를 입력하여 설정된 라이브러리를 받는다.

## 작업시 주의사항
- public/html/_layout.html
    - 기본 템플릿이므로 수정, 삭제하지 않는다.
- public/html/index.html
    - kv가 없는 경우 ```<!-- split _kv.html --> ~ <!-- split end -->``` 를 지워준다.
- public/css/new_sec_pdp.css
    - 벤더 프리픽스는 빌드시 자동으로 적용되니 따로 적지 않는다.
    - 부분적으로 수동 설정을 하기 원할 경우 해당 셀렉터 내에 ```/*! autoprefixer: OFF */``` 를 삽입한다.
- public/js/inlineCode.js
    - AEM 빌드시 ```isAEM = false``` 해당 값을 ```isAEM = true``` 로 치환하므로 이를 통해 분기처리를 한다.

## 번들링 내용
* css, js 난독화
* css vender prefix
* es6 -> es5 transpiling
* 웹서버 실행
* 로컬용, AEM용 페이지 자동 추출
* 최종전달용 txt 파일 자동 추출

## 명령어
* ```gulp local``` : 로컬 페이지 browserSync 실행
* ```gulp aem``` : AEM용 번들러 적용 및 전달용 페이지 browserSync 실행
* ```gulp txt``` : 최종으로 txt 파일 추출시
* ```gulp``` : 위 세가지 전체 적용 (browserSync는 aem 기준으로 오픈)