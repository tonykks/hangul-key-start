// ============================================================================
// 5. [오디오: 배경 음악 (music/*.wav) 및 Web Audio API 오답 비프음]
// ============================================================================
// WAV 파일은 용량이 크므로 미리 받지 않고(preload 'none') 재생을 누른 곡만 내려받는다.
// 40명이 동시에 접속해도 페이지 첫 화면은 음악 다운로드 없이 바로 열린다.
let bgAudio = new Audio();
bgAudio.preload = 'none';
bgAudio.loop = true;
let audioCtx = null;
let musicStatusKey = 'mReady';
let musicStatusWarn = false;

function initMusicPlayer() {
  const sel = document.getElementById('musicSelect');
  sel.innerHTML = '';
  MUSIC_TRACKS.forEach((path, idx) => {
    const opt = document.createElement('option');
    opt.value = path;
    const fileName = path.split('/').pop() || path;
    opt.textContent = `${idx + 1}. ${fileName}`;
    sel.appendChild(opt);
  });

  // 곡을 선택하면 바로 재생하고, 끝나면 무한 반복한다 (기존 곡은 멈추고 교체 → 겹침 없음)
  sel.addEventListener('change', () => {
    sel.blur();
    playSelectedMusic();
  });

  document.getElementById('btnPlay').addEventListener('click', (e) => {
    e.currentTarget.blur();
    playSelectedMusic();
  });

  document.getElementById('btnStop').addEventListener('click', (e) => {
    e.currentTarget.blur();
    stopMusic();
  });

  bgAudio.addEventListener('error', () => {
    setMusicStatus('mErr', true);
  });
}

function setMusicStatus(key, isWarn) {
  musicStatusKey = key;
  musicStatusWarn = !!isWarn;
  const el = document.getElementById('musicStatus');
  el.textContent = I18N[currentLang][key] || '';
  el.className = 'music-status' + (isWarn ? ' warn' : '');
}

function playSelectedMusic() {
  const sel = document.getElementById('musicSelect');
  const src = sel.value;
  if (!src) {
    setMusicStatus('mErr', true);
    return;
  }
  bgAudio.pause();
  bgAudio.src = src;
  bgAudio.loop = true;
  bgAudio.currentTime = 0;
  setMusicStatus('mLoad', false);
  const p = bgAudio.play();
  if (p && typeof p.then === 'function') {
    p.then(() => setMusicStatus('mPlay', false))
     .catch((err) => {
       // 곡을 빠르게 바꿔 이전 재생 요청이 취소된 경우(AbortError)는 오류가 아니다
       if (err && err.name === 'AbortError') return;
       setMusicStatus('mErr', true);
     });
  } else {
    setMusicStatus('mPlay', false);
  }
}

function stopMusic() {
  bgAudio.pause();
  bgAudio.currentTime = 0;
  setMusicStatus('mStop', false);
}

// 오답 시 약 0.12초 길이의 식별 가능한 비프음 발생 (Web Audio API 오실레이터)
function playErrorBeep() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.setValueAtTime(220, now + 0.06);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch (e) {}
}
