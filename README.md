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

| `js/firebase-config.js` | Firebase 연결 정보 (웹 공개용 값) |
| `js/auth.js` | Google 로그인, 별칭, 연습 기록 저장 |
| `ranking.html`, `js/ranking.js` | 연습 시간 랭킹 TOP 5 화면 |
| `firestore.rules` | Firestore 보안 규칙 (Firebase 콘솔 → Firestore → 규칙에 게시된 내용과 같음) |

## 로그인과 랭킹

- 로그인하지 않아도 연습과 TXT 저장은 그대로 됩니다.
- Google 로그인은 배포 주소(https://tonykks.github.io/hangul-key-start/)에서만 됩니다. `index.html` 더블클릭으로 열면 손님 모드입니다.
- 처음 로그인하면 별칭(1~12자)을 정합니다. TXT 파일 이름은 `별칭_YYYYMMDD_HHMMSS.txt`가 됩니다.
- `연습 종료`를 누를 때 한 번만 저장합니다: 연습 횟수 +1, 실제 연습 시간(30초 넘게 쉬면 30초까지만 인정), 점수(정확도 %).
- 랭킹은 총 연습 시간 순 상위 5명이며, 별칭을 누르면 연습 횟수·총 시간·평균 점수가 보입니다.

## 음악 추가 방법

1. 음악 파일(MP3 권장, WAV는 용량이 10배 큼)을 `music/` 폴더에 넣습니다.
2. `js/config.js`의 `MUSIC_TRACKS` 목록에 `'music/파일이름.mp3'` 한 줄을 추가합니다.

## 연습 종료

`연습 종료 (TXT 저장)`을 누르면 결과가 `YYYYMMDD_HHMMSS.txt`(종료 시각) 이름으로 브라우저의 다운로드 폴더에 저장되고, 기록이 비워져 다음 연습을 새로 시작합니다.
