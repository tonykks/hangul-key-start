# 한글 글쇠·손가락 기초 연습

`index.html`을 열면 바로 연습할 수 있습니다 (더블클릭 또는 웹 주소 접속, 설치·로그인 불필요).

## 파일 구성

| 파일 | 역할 |
|---|---|
| `index.html` | 화면 구조 |
| `css/style.css` | 화면 디자인 |
| `js/config.js` | 배경 음악 목록 |
| `js/data.js` | 10세트 글쇠·손가락 정의, 두벌식 키 매핑 |
| `js/i18n.js` | 한국어·미얀마어·베트남어 문구 |
| `js/storage.js` | 연습 기록 (브라우저 Local Storage) |
| `js/audio.js` | 배경 음악 재생(무한 반복)·오답 경고음 |
| `js/render.js` | 화면 그리기 |
| `js/input.js` | 키보드 입력·Shift 판정 |
| `js/export.js` | TXT 결과 파일 만들기 |
| `js/main.js` | 버튼 연결과 시작 |

## 음악 추가 방법

1. 음악 파일(WAV)을 `music/` 폴더에 넣습니다.
2. `js/config.js`의 `MUSIC_TRACKS` 목록에 `'music/파일이름.wav'` 한 줄을 추가합니다.

## 연습 종료

`연습 종료 (TXT 저장)`을 누르면 결과가 `YYYYMMDD_HHMMSS.txt`(종료 시각) 이름으로 브라우저의 다운로드 폴더에 저장되고, 기록이 비워져 다음 연습을 새로 시작합니다.
