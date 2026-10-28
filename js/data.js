// ============================================================================
// 2. [10세트 연습 범위 및 담당 손가락 정의] (명세서 표와 100% 일치)
// ============================================================================
const PRACTICE_SETS = [
  { id: 1, reqShift: null, keys: [
    { char: 'ㄹ', code: 'KeyF', label: 'F', name: '리을', finger: 'L1' },
    { char: 'ㅇ', code: 'KeyD', label: 'D', name: '이응', finger: 'L2' },
    { char: 'ㄴ', code: 'KeyS', label: 'S', name: '니은', finger: 'L3' },
    { char: 'ㅁ', code: 'KeyA', label: 'A', name: '미음', finger: 'L4' }
  ]},
  { id: 2, reqShift: null, keys: [
    { char: 'ㅓ', code: 'KeyJ', label: 'J', name: '어', finger: 'R1' },
    { char: 'ㅏ', code: 'KeyK', label: 'K', name: '아', finger: 'R2' },
    { char: 'ㅣ', code: 'KeyL', label: 'L', name: '이', finger: 'R3' },
    { char: ';', code: 'Semicolon', label: ';', name: '세미콜론', finger: 'R4' }
  ]},
  { id: 3, reqShift: null, keys: [
    { char: 'ㄱ', code: 'KeyR', label: 'R', name: '기역', finger: 'L1' },
    { char: 'ㄷ', code: 'KeyE', label: 'E', name: '디귿', finger: 'L2' },
    { char: 'ㅈ', code: 'KeyW', label: 'W', name: '지읒', finger: 'L3' },
    { char: 'ㅂ', code: 'KeyQ', label: 'Q', name: '비읍', finger: 'L4' }
  ]},
  { id: 4, reqShift: null, keys: [
    { char: 'ㅕ', code: 'KeyU', label: 'U', name: '여', finger: 'R1' },
    { char: 'ㅑ', code: 'KeyI', label: 'I', name: '야', finger: 'R2' },
    { char: 'ㅐ', code: 'KeyO', label: 'O', name: '애', finger: 'R3' },
    { char: 'ㅔ', code: 'KeyP', label: 'P', name: '에', finger: 'R4' }
  ]},
  { id: 5, reqShift: null, keys: [
    { char: 'ㅍ', code: 'KeyV', label: 'V', name: '피읖', finger: 'L1' },
    { char: 'ㅊ', code: 'KeyC', label: 'C', name: '치읓', finger: 'L2' },
    { char: 'ㅌ', code: 'KeyX', label: 'X', name: '티읕', finger: 'L3' },
    { char: 'ㅋ', code: 'KeyZ', label: 'Z', name: '키읔', finger: 'L4' }
  ]},
  { id: 6, reqShift: null, keys: [
    { char: 'ㅡ', code: 'KeyM', label: 'M', name: '으', finger: 'R1' },
    { char: ',', code: 'Comma', label: ',', name: '쉼표', finger: 'R2' },
    { char: '.', code: 'Period', label: '.', name: '마침표', finger: 'R3' },
    { char: '/', code: 'Slash', label: '/', name: '슬래시', finger: 'R4' }
  ]},
  { id: 7, reqShift: null, keys: [
    { char: 'ㅎ', code: 'KeyG', label: 'G', name: '히읗', finger: 'L1' },
    { char: 'ㅅ', code: 'KeyT', label: 'T', name: '시옷', finger: 'L1' },
    { char: 'ㅠ', code: 'KeyB', label: 'B', name: '유', finger: 'L1', isExceptionB: true }
  ]},
  { id: 8, reqShift: null, keys: [
    { char: 'ㅗ', code: 'KeyH', label: 'H', name: '오', finger: 'R1' },
    { char: 'ㅛ', code: 'KeyY', label: 'Y', name: '요', finger: 'R1' },
    { char: 'ㅜ', code: 'KeyN', label: 'N', name: '우', finger: 'R1' }
  ]},
  { id: 9, reqShift: 'ShiftRight', keys: [
    { char: 'ㅃ', code: 'KeyQ', label: 'Q', name: '쌍비읍', finger: 'L4', reqShift: 'ShiftRight' },
    { char: 'ㅉ', code: 'KeyW', label: 'W', name: '쌍지읒', finger: 'L3', reqShift: 'ShiftRight' },
    { char: 'ㄸ', code: 'KeyE', label: 'E', name: '쌍디귿', finger: 'L2', reqShift: 'ShiftRight' },
    { char: 'ㄲ', code: 'KeyR', label: 'R', name: '쌍기역', finger: 'L1', reqShift: 'ShiftRight' },
    { char: 'ㅆ', code: 'KeyT', label: 'T', name: '쌍시옷', finger: 'L1', reqShift: 'ShiftRight' }
  ]},
  { id: 10, reqShift: 'ShiftLeft', keys: [
    { char: 'ㅛ', code: 'KeyY', label: 'Y', name: '요', finger: 'R1', reqShift: 'ShiftLeft' },
    { char: 'ㅕ', code: 'KeyU', label: 'U', name: '여', finger: 'R1', reqShift: 'ShiftLeft' },
    { char: 'ㅑ', code: 'KeyI', label: 'I', name: '야', finger: 'R2', reqShift: 'ShiftLeft' },
    { char: 'ㅒ', code: 'KeyO', label: 'O', name: '얘', finger: 'R3', reqShift: 'ShiftLeft' },
    { char: 'ㅖ', code: 'KeyP', label: 'P', name: '예', finger: 'R4', reqShift: 'ShiftLeft' }
  ]}
];

// 두벌식 물리 글쇠 매핑 (IME 조합 방지 및 독립 문자 판정용)
const KEY_MAP = {
  KeyQ: { en: 'Q', n: 'ㅂ', s: 'ㅃ' }, KeyW: { en: 'W', n: 'ㅈ', s: 'ㅉ' },
  KeyE: { en: 'E', n: 'ㄷ', s: 'ㄸ' }, KeyR: { en: 'R', n: 'ㄱ', s: 'ㄲ' },
  KeyT: { en: 'T', n: 'ㅅ', s: 'ㅆ' }, KeyY: { en: 'Y', n: 'ㅛ', s: 'ㅛ' },
  KeyU: { en: 'U', n: 'ㅕ', s: 'ㅕ' }, KeyI: { en: 'I', n: 'ㅑ', s: 'ㅑ' },
  KeyO: { en: 'O', n: 'ㅐ', s: 'ㅒ' }, KeyP: { en: 'P', n: 'ㅔ', s: 'ㅖ' },
  KeyA: { en: 'A', n: 'ㅁ', s: 'ㅁ' }, KeyS: { en: 'S', n: 'ㄴ', s: 'ㄴ' },
  KeyD: { en: 'D', n: 'ㅇ', s: 'ㅇ' }, KeyF: { en: 'F', n: 'ㄹ', s: 'ㄹ' },
  KeyG: { en: 'G', n: 'ㅎ', s: 'ㅎ' }, KeyH: { en: 'H', n: 'ㅗ', s: 'ㅗ' },
  KeyJ: { en: 'J', n: 'ㅓ', s: 'ㅓ' }, KeyK: { en: 'K', n: 'ㅏ', s: 'ㅏ' },
  KeyL: { en: 'L', n: 'ㅣ', s: 'ㅣ' }, Semicolon: { en: ';', n: ';', s: ':' },
  KeyZ: { en: 'Z', n: 'ㅋ', s: 'ㅋ' }, KeyX: { en: 'X', n: 'ㅌ', s: 'ㅌ' },
  KeyC: { en: 'C', n: 'ㅊ', s: 'ㅊ' }, KeyV: { en: 'V', n: 'ㅍ', s: 'ㅍ' },
  KeyB: { en: 'B', n: 'ㅠ', s: 'ㅠ' }, KeyN: { en: 'N', n: 'ㅜ', s: 'ㅜ' },
  KeyM: { en: 'M', n: 'ㅡ', s: 'ㅡ' }, Comma: { en: ',', n: ',', s: '<' },
  Period: { en: '.', n: '.', s: '>' }, Slash: { en: '/', n: '/', s: '?' },
  Quote: { en: "'", n: "'", s: '"' }, BracketLeft: { en: '[', n: '[', s: '{' },
  BracketRight: { en: ']', n: ']', s: '}' }, Minus: { en: '-', n: '-', s: '_' },
  Equal: { en: '=', n: '=', s: '+' }, Backquote: { en: '`', n: '`', s: '~' },
  Digit1: { en: '1', n: '1', s: '!' }, Digit2: { en: '2', n: '2', s: '@' },
  Digit3: { en: '3', n: '3', s: '#' }, Digit4: { en: '4', n: '4', s: '$' },
  Digit5: { en: '5', n: '5', s: '%' }, Digit6: { en: '6', n: '6', s: '^' },
  Digit7: { en: '7', n: '7', s: '&' }, Digit8: { en: '8', n: '8', s: '*' },
  Digit9: { en: '9', n: '9', s: '(' }, Digit0: { en: '0', n: '0', s: ')' }
};

// 브라우저에서 이미 조합된 쌍자음/이중모음 문자 집합
const SHIFTED_HANGUL_CHARS = new Set(['ㅃ', 'ㅉ', 'ㄸ', 'ㄲ', 'ㅆ', 'ㅒ', 'ㅖ']);

// e.code가 누락된 환경을 대비한 문자 역매핑
const CHAR_TO_CODE = {};
Object.keys(KEY_MAP).forEach(code => {
  const item = KEY_MAP[code];
  CHAR_TO_CODE[item.n] = code;
  CHAR_TO_CODE[item.s] = code;
  CHAR_TO_CODE[item.en.toLowerCase()] = code;
  CHAR_TO_CODE[item.en.toUpperCase()] = code;
});

const KB_ROWS = [
  ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'],
  ['KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon'],
  ['ShiftLeft', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash', 'ShiftRight']
];
