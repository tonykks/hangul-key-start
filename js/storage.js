// ============================================================================
// 4. [상태 관리 및 LocalStorage 연동]
// ============================================================================
const STORAGE_KEY = 'hangul_key_start_mvp_v1';
let currentLang = 'ko';
let currentSetIdx = 0;
let currentKeyIdx = 0;
let isModalOpen = true;
let lastFeedback = '';

// 키 눌림 및 Shift 상태 추적 (길게 누름 자동 반복 방지 및 좌/우 Shift 상태 관리)
const pressedCodes = new Set();
let isLeftShiftDown = false;
let isRightShiftDown = false;

let session = loadSession();

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && parsed.records) return parsed;
    }
  } catch (e) {}
  return { startTime: null, records: {} };
}

function saveSession() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {}
}

// 이번 연습의 전체 입력 수·정답 수·실제 연습 시간(초)
function getSessionStats() {
  let total = 0;
  let correct = 0;
  Object.keys(session.records).forEach(k => {
    session.records[k].forEach(item => {
      total++;
      if (item.ok) correct++;
    });
  });
  return { total, correct, activeSec: Math.round((session.activeMs || 0) / 1000) };
}

function getRecordKey(setId, keyIdx) {
  return `S${setId}_K${keyIdx}`;
}

function getKeyInputs(setId, keyIdx) {
  const k = getRecordKey(setId, keyIdx);
  if (!session.records[k]) session.records[k] = [];
  return session.records[k];
}

function getSetTotalErrors(setId) {
  const setObj = PRACTICE_SETS.find(s => s.id === setId);
  if (!setObj) return 0;
  let errs = 0;
  setObj.keys.forEach((_, idx) => {
    const arr = session.records[getRecordKey(setId, idx)] || [];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i].ok) errs++;
    }
  });
  return errs;
}
