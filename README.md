# WOW PD 작업 가이드

## 작업하기 전에
1. 프로젝트명 폴더에 소스를 다운받는다.
2. 터미널을 실행하여 ```cd 해당 디렉토리```로 해당 디렉토리로 이동시킨다. (웹스톰 등 IDE에서 실행시 건너뛴다.)
3. ```npm i```를 입력하여 설정된 라이브러리를 받는다.

## 작업시 주의사항
- public/html/_layout.html
    public/html 에서 _layout.html 은 기본 템플릿이니 수정하지 않는다.
- public/html/index.html
    1. split, build 주석은 수정하거나 지우지 않는다.
    2. feature 주석 내에 마크업을 진행한다.
    3. kv가 없는 경우 ```<!-- split _kv.html --> ~ <!-- split end -->``` 를 지워주면 된다.
- public/css/new_sec_pdp.css
    벤더 프리픽스는 빌드시 자동으로 적용되니 따로 적지 않는다.
    부분적으로 수동 설정을 하기 원할 경우 해당 셀렉터 내에 ```/*! autoprefixer: OFF */``` 를 삽입한다.
- public/js/inlineCode.js
    ```var isAEM = false``` 해당 소스는 빌드를 통해 AEM 여부를 나타내는 변수로, AEM 환경에서 바뀌는 소스가 있는 경우에 활용한다.

## 번들링 내용
* css, js 난독화
* css vender prefix
* es6 -> es5 transpiling
* 웹서버 실행
* 로컬용, AEM용 페이지 자동 추출
* 최종전달용 txt 파일 자동 추출

## 명령어
```gulp local``` : 로컬 페이지 browserSync 실행
```gulp aem``` : AEM용 번들러 적용 및 전달용 페이지 browserSync 실행
```gulp txt``` : 최종으로 txt 파일 추출시
```gulp``` : 위 세가지 전체 적용 (browserSync는 aem 기준으로 오픈)