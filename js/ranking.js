// ============================================================================
// [랭킹 화면] 누적 연습 시간(totalSec) 상위 5명 · 별칭을 누르면 횟수·시간·평균 점수 표시
// - 문서 5개만 읽으므로 40명이 동시에 열어도 부담이 없다
// ============================================================================
const RANK_LIMIT = 5;
// 랭킹에 보이지 않게 할 계정(강사 시험용). 기록은 Firestore에 그대로 남는다
const HIDDEN_UIDS = new Set(['4415TvZiloOVSiJryLHTjTr4Jfp1']);
const params = new URLSearchParams(location.search);
const lang = I18N[params.get('lang')] ? params.get('lang') : 'ko';
const t = I18N[lang];
let rankDb = null;

function applyTexts() {
  document.documentElement.lang = lang;
  document.title = t.rankTitle;
  document.getElementById('uiRankTitle').textContent = t.rankTitle;
  document.getElementById('uiRankSub').textContent = t.rankSub;
  document.getElementById('btnRefresh').textContent = t.rankRefresh;
  document.getElementById('lnkBack').textContent = t.rankBack;
}

function setMsg(text) {
  document.getElementById('uiRankMsg').textContent = text;
}

function detailBox(d) {
  const sessions = d.sessions || 0;
  const avg = sessions ? Math.round((d.scoreSum || 0) / sessions) : 0;
  const box = document.createElement('div');
  box.className = 'rank-detail';
  [[t.rankSessions, t.times(sessions)], [t.rankTime, t.dur(d.totalSec || 0)], [t.rankAvg, t.points(avg)]]
    .forEach(([label, value]) => {
      const cell = document.createElement('div');
      const s = document.createElement('span');
      s.textContent = label;
      const b = document.createElement('b');
      b.textContent = value;
      cell.append(s, b);
      box.appendChild(cell);
    });
  return box;
}

async function loadRanking() {
  const list = document.getElementById('rankList');
  list.innerHTML = '';
  if (!rankDb) {
    setMsg(t.rankError);
    return;
  }
  setMsg(t.rankLoading);
  try {
    const snap = await rankDb.collection('users').orderBy('totalSec', 'desc').limit(RANK_LIMIT + HIDDEN_UIDS.size).get();
    const docs = snap.docs.filter(doc => !HIDDEN_UIDS.has(doc.id)).map(doc => doc.data())
      .filter(d => (d.sessions || 0) > 0).slice(0, RANK_LIMIT);
    setMsg(docs.length ? '' : t.rankEmpty);
    docs.forEach((d, idx) => {
      const li = document.createElement('li');
      li.className = 'rank-row';

      const no = document.createElement('span');
      no.className = 'rank-no';
      no.textContent = String(idx + 1);

      // 별칭은 사용자가 입력한 값이므로 textContent로만 넣는다
      const nick = document.createElement('button');
      nick.type = 'button';
      nick.className = 'rank-nick';
      nick.textContent = d.nickname;

      const time = document.createElement('span');
      time.className = 'rank-time';
      time.textContent = t.dur(d.totalSec || 0);

      nick.addEventListener('click', () => {
        const open = li.querySelector('.rank-detail');
        if (open) open.remove();
        else li.appendChild(detailBox(d));
      });

      li.append(no, nick, time);
      list.appendChild(li);
    });
  } catch (e) {
    console.error(e);
    setMsg(t.rankError);
  }
}

applyTexts();
if (typeof firebase !== 'undefined' && location.protocol !== 'file:') {
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    rankDb = firebase.firestore();
  } catch (e) {
    rankDb = null;
  }
}
document.getElementById('btnRefresh').addEventListener('click', loadRanking);
loadRanking();
