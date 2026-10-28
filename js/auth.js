// ============================================================================
// 10. [Google 로그인(Firebase Authentication) 및 연습 기록 저장(Firestore)]
// - 로그인하지 않아도 연습·TXT 저장은 그대로 동작한다 (Firebase를 못 불러오면 손님 모드)
// - DB에는 연습을 끝낼 때 한 번만 저장한다 (키 입력마다 저장하지 않으므로 40명 동시 사용에도 부담 없음)
// - users/{uid} = { nickname, totalSec, sessions, scoreSum, updatedAt }
// ============================================================================
let fbAuth = null;
let fbDb = null;
let currentUser = null;
let currentNickname = '';

const NICK_MAX = 12;
const CLOUD_SAVE_TIMEOUT_MS = 5000;

function initFirebase() {
  // index.html을 더블클릭(file://)해서 열면 Google 로그인이 불가능하므로 손님 모드로 둔다
  if (typeof firebase === 'undefined' || location.protocol === 'file:') return;
  try {
    firebase.initializeApp(FIREBASE_CONFIG);
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();
  } catch (e) {
    fbAuth = null;
    fbDb = null;
    return;
  }

  fbAuth.onAuthStateChanged(async (user) => {
    currentUser = user;
    currentNickname = '';
    if (user) await loadOrCreateProfile(user);
    renderLoginButton();
  });
}

// 처음 로그인한 학생은 별칭을 정해 문서를 만들고, 이후에는 저장된 별칭을 불러온다
async function loadOrCreateProfile(user) {
  const t = I18N[currentLang];
  const ref = fbDb.collection('users').doc(user.uid);
  try {
    const snap = await ref.get();
    if (snap.exists) {
      currentNickname = snap.data().nickname || '';
      return;
    }
    const nick = askNickname();
    if (!nick) {
      await fbAuth.signOut();
      return;
    }
    await ref.set({
      nickname: nick, totalSec: 0, sessions: 0, scoreSum: 0,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    currentNickname = nick;
  } catch (e) {
    console.error(e);
    alert(t.loginFail);
  }
}

// 파일 이름에 쓸 수 없는 문자를 빼고 1~12자로 받는다 (취소하면 빈 문자열)
function askNickname() {
  const t = I18N[currentLang];
  for (;;) {
    const raw = prompt(t.nickAsk(NICK_MAX));
    if (raw === null) return '';
    const nick = raw.replace(/[\\/:*?"<>|]/g, '').trim();
    if (nick.length >= 1 && nick.length <= NICK_MAX) return nick;
    alert(t.nickInvalid(NICK_MAX));
  }
}

function renderLoginButton() {
  const t = I18N[currentLang];
  const btn = document.getElementById('btnLogin');
  const chip = document.getElementById('uiNickname');
  const isIn = Boolean(currentUser && currentNickname);
  // 로그인 중: [👤 별칭] 표시 + [로그아웃] 버튼 / 로그아웃 상태: [로그인] 버튼만
  chip.hidden = !isIn;
  chip.textContent = isIn ? `👤 ${currentNickname}` : '';
  chip.title = isIn ? currentNickname : '';
  btn.textContent = isIn ? t.logout : t.login;
  btn.classList.toggle('logged-in', isIn);
}

async function onLoginButtonClick() {
  const t = I18N[currentLang];
  if (!fbAuth) {
    alert(t.loginUnavailable);
    return;
  }
  if (currentUser) {
    await fbAuth.signOut();
    return;
  }
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    await fbAuth.signInWithPopup(provider);
  } catch (e) {
    if (e && e.code === 'auth/popup-blocked') {
      fbAuth.signInWithRedirect(provider);
    } else if (!(e && (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request'))) {
      console.error(e);
      alert(t.loginFail);
    }
  }
}

// TXT 파일 이름 앞에 붙일 별칭 (로그인하지 않았으면 없음)
function getFilePrefix() {
  return currentUser && currentNickname ? `${currentNickname}_` : '';
}

// 연습 1회 결과를 누적 저장한다. 결과: 'skip' | 'ok' | 'pending' | 'error'
function saveSessionToCloud(stats) {
  if (!fbDb || !currentUser || !currentNickname || stats.total === 0) return Promise.resolve('skip');
  const inc = firebase.firestore.FieldValue.increment;
  const score = Math.round((stats.correct / stats.total) * 100);
  const sec = Math.min(stats.activeSec, 14400);
  const write = fbDb.collection('users').doc(currentUser.uid).update({
    totalSec: inc(sec),
    sessions: inc(1),
    scoreSum: inc(score),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => 'ok').catch((e) => {
    console.error(e);
    return 'error';
  });
  // 인터넷이 끊겨 있으면 Firestore가 연결될 때 자동으로 보내므로 '대기'로 안내한다
  const timeout = new Promise(resolve => setTimeout(() => resolve('pending'), CLOUD_SAVE_TIMEOUT_MS));
  return Promise.race([write, timeout]);
}
