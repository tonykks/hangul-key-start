// ============================================================================
// 7. [모달 열기/닫기 및 키보드 입력·Shift 판정 로직]
// ============================================================================
function openGuideModal() {
  isModalOpen = true;
  pressedCodes.clear();
  document.getElementById('guideModal').classList.remove('hidden');
  renderModalContent();
}

function closeGuideModal() {
  isModalOpen = false;
  pressedCodes.clear();
  document.getElementById('guideModal').classList.add('hidden');
}

function resetAllKeyStates() {
  pressedCodes.clear();
  isLeftShiftDown = false;
  isRightShiftDown = false;
  document.querySelectorAll('.kb-key.pressed').forEach(el => el.classList.remove('pressed'));
}

function setKeyVisualPressed(code, isDown) {
  const el = document.querySelector(`.kb-key[data-code="${code}"]`);
  if (!el) return;
  if (isDown) {
    el.classList.add('pressed');
  } else {
    setTimeout(() => el.classList.remove('pressed'), 80);
  }
}

// window blur 및 탭 전환 시 Shift 및 눌림 상태 해제
window.addEventListener('blur', resetAllKeyStates);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) resetAllKeyStates();
});

// 왼쪽/오른쪽 Shift 판별: e.code가 비거나 다르게 오는 환경(한글 입력기·일부 키보드)을 대비해
// 키 위치(e.location: 1=왼쪽, 2=오른쪽)로 한 번 더 확인한다
function getShiftSide(e) {
  if (e.code === 'ShiftRight' || e.code === 'ShiftLeft') return e.code;
  if (e.key === 'Shift' || e.keyCode === 16) return e.location === 2 ? 'ShiftRight' : 'ShiftLeft';
  return '';
}

window.addEventListener('keyup', (e) => {
  const shiftSide = getShiftSide(e);
  const code = shiftSide || e.code || CHAR_TO_CODE[e.key] || '';
  if (code) pressedCodes.delete(code);

  if (shiftSide === 'ShiftRight') isRightShiftDown = false;
  if (shiftSide === 'ShiftLeft') isLeftShiftDown = false;
  if (shiftSide && !e.shiftKey) {
    isLeftShiftDown = false;
    isRightShiftDown = false;
    setKeyVisualPressed('ShiftLeft', false);
    setKeyVisualPressed('ShiftRight', false);
  }
  if (code) setKeyVisualPressed(code, false);
});

window.addEventListener('keydown', (e) => {
  // 1. Shift 상태 추적 (왼쪽/오른쪽 구분)
  const shiftSide = getShiftSide(e);
  if (shiftSide === 'ShiftRight') {
    isRightShiftDown = true;
    setKeyVisualPressed('ShiftRight', true);
    return;
  }
  if (shiftSide === 'ShiftLeft') {
    isLeftShiftDown = true;
    setKeyVisualPressed('ShiftLeft', true);
    return;
  }

  // Ctrl, Alt, OS 단축키는 연습 입력으로 처리하지 않고 통과
  if (e.ctrlKey || e.altKey || e.metaKey) return;

  // 안내 모달이 열려 있거나 음악 선택창 조작 중에는 입력 무시
  if (isModalOpen) return;
  const activeTag = document.activeElement ? document.activeElement.tagName : '';
  if (activeTag === 'SELECT' || activeTag === 'BUTTON') return;

  // 보조 키 무시
  if (e.code === 'Backspace' || e.code === 'Space' || e.code === 'Enter' || e.code === 'Tab') {
    e.preventDefault();
    return;
  }

  // 물리 키 코드 확인 (e.code 우선, 없을 경우 e.key 역매핑)
  const code = KEY_MAP[e.code] ? e.code : (CHAR_TO_CODE[e.key] || '');
  const keyDef = KEY_MAP[code];
  if (!keyDef) return;

  e.preventDefault();

  // 길게 누를 때의 자동 반복(repeat) 중복 집계 방지
  if (e.repeat || pressedCodes.has(code)) return;
  pressedCodes.add(code);
  setKeyVisualPressed(code, true);

  const curSet = PRACTICE_SETS[currentSetIdx];
  const curKey = curSet.keys[currentKeyIdx];
  const t = I18N[currentLang];

  // Shift 활성 여부 및 실제 입력 문자 결정
  const isAlreadyShiftedChar = SHIFTED_HANGUL_CHARS.has(e.key);
  const isShiftActive = isLeftShiftDown || isRightShiftDown || Boolean(e.shiftKey) || isAlreadyShiftedChar;
  const actualChar = isAlreadyShiftedChar ? e.key : (isShiftActive ? keyDef.s : keyDef.n);

  let isCorrect = false;
  let errMsg = '';

  if (curSet.id === 9) {
    // 9세트(Shift+왼손 윗자리): 목표 쌍자음(ㅃ, ㅉ, ㄸ, ㄲ, ㅆ)과 일치하고 (isRightShiftDown || e.shiftKey || 이미 쌍자음 조합)이 참이면 정답
    const shiftOk = isRightShiftDown || Boolean(e.shiftKey) || isLeftShiftDown || isAlreadyShiftedChar;
    const charOk = (actualChar === curKey.char) || (e.key === curKey.char) || (code === curKey.code && shiftOk);

    if (charOk && shiftOk) {
      isCorrect = true;
    } else if (code === curKey.code && !shiftOk) {
      errMsg = t.errNoSR;
    } else {
      errMsg = t.errKey(actualChar, curKey.char);
    }
  } else if (curSet.id === 10) {
    // 10세트(Shift+오른손 윗자리): 목표 글자(ㅒ, ㅖ 또는 Shift 상태의 ㅛ, ㅕ, ㅑ)와 일치하고 (isLeftShiftDown || e.shiftKey || 이미 이중모음 조합)이 참이면 정답
    const shiftOk = isLeftShiftDown || Boolean(e.shiftKey) || isRightShiftDown || isAlreadyShiftedChar;
    const charOk = (actualChar === curKey.char) || (e.key === curKey.char) || (code === curKey.code);

    if (charOk && shiftOk) {
      isCorrect = true;
    } else if (charOk && !shiftOk) {
      errMsg = t.errNoSL;
    } else {
      errMsg = t.errKey(actualChar, curKey.char);
    }
  } else {
    // 1~8세트: Shift 없이 목표 글쇠와 일치해야 정답
    if ((code === curKey.code || actualChar === curKey.char) && !isShiftActive) {
      isCorrect = true;
    } else if (code === curKey.code && isShiftActive) {
      errMsg = t.errUnwantedS;
    } else {
      errMsg = t.errKey(actualChar, curKey.char);
    }
  }

  // 첫 글쇠 입력 시각을 전체 연습 시작 시간으로 자동 기록
  if (!session.startTime) {
    session.startTime = new Date().toISOString();
  }

  const recordedChar = isCorrect ? curKey.char : actualChar;

  if (!isCorrect) {
    playErrorBeep();
    lastFeedback = errMsg;
  } else {
    lastFeedback = '';
  }

  const inputs = getKeyInputs(curSet.id, currentKeyIdx);
  inputs.push({ char: recordedChar, ok: isCorrect });

  // 실제 연습 시간 누적 (쉬는 시간은 IDLE_CAP_MS까지만 인정)
  const now = Date.now();
  if (session.lastKeyAt) {
    session.activeMs = (session.activeMs || 0) + Math.min(now - session.lastKeyAt, IDLE_CAP_MS);
  }
  session.lastKeyAt = now;
  saveSession();

  renderSelectors();
  renderTargetAndGuide();
  renderResultLines();
});
