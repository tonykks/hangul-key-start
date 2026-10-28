// ============================================================================
// 6. [화면 렌더링: 다국어, 10세트, 목표 글쇠, 20칸 줄, 두벌식 가상 키보드]
// ============================================================================
function renderLanguageButtons() {
  const containers = [document.getElementById('langGroup'), document.getElementById('modalLangGroup')];
  containers.forEach(box => {
    box.innerHTML = '';
    Object.keys(I18N).forEach(code => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-btn' + (code === currentLang ? ' active' : '');
      btn.lang = code;
      btn.textContent = I18N[code].label;
      btn.addEventListener('click', () => {
        btn.blur();
        currentLang = code;
        renderAll();
      });
      box.appendChild(btn);
    });
  });
}

function renderSelectors() {
  const t = I18N[currentLang];
  const setGrid = document.getElementById('setGrid');
  setGrid.innerHTML = '';

  PRACTICE_SETS.forEach((s, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'set-btn' + (idx === currentSetIdx ? ' active' : '');
    btn.textContent = t.sets[s.id][0];
    btn.addEventListener('click', () => {
      btn.blur();
      if (currentSetIdx !== idx) {
        currentSetIdx = idx;
        currentKeyIdx = 0;
        lastFeedback = '';
        openGuideModal();
      }
      renderAll();
    });
    setGrid.appendChild(btn);
  });

  const keyList = document.getElementById('keyList');
  keyList.innerHTML = '';
  const curSet = PRACTICE_SETS[currentSetIdx];

  curSet.keys.forEach((kObj, kIdx) => {
    if (kIdx > 0) {
      const sep = document.createElement('span');
      sep.className = 'arrow-sep';
      sep.textContent = '→';
      keyList.appendChild(sep);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'key-select-btn' + (kIdx === currentKeyIdx ? ' active' : '');
    const cnt = getKeyInputs(curSet.id, kIdx).length;
    btn.innerHTML = `<span>${kObj.char}(${kObj.label})</span><span class="key-cnt">${t.cntN(cnt)}</span>`;
    btn.addEventListener('click', () => {
      btn.blur();
      currentKeyIdx = kIdx;
      lastFeedback = '';
      renderAll();
    });
    keyList.appendChild(btn);
  });
}

function renderTargetAndGuide() {
  const t = I18N[currentLang];
  const curSet = PRACTICE_SETS[currentSetIdx];
  const curKey = curSet.keys[currentKeyIdx];
  const inputs = getKeyInputs(curSet.id, currentKeyIdx);

  const mod = inputs.length % 20;
  const lineProg = inputs.length === 0 ? 0 : (mod === 0 ? 20 : mod);

  document.getElementById('uiTargetChar').textContent = curKey.char;
  document.getElementById('uiTargetPhys').textContent = `${t.phys}: ${curKey.label}`;
  document.getElementById('uiCurrentSet').textContent = t.sets[curSet.id][0];
  document.getElementById('uiTargetVoice').textContent = t.voice(curKey.char, curKey.name);
  document.getElementById('uiTargetFinger').textContent = `${t.finger}: ${t.fingers[curKey.finger]}`;
  document.getElementById('uiLineProgVal').textContent = `${lineProg} / 20`;
  document.getElementById('uiSetErrVal').textContent = `-${getSetTotalErrors(curSet.id)}`;

  document.getElementById('uiGuideBody').textContent = t.sets[curSet.id][1];

  const noteEl = document.getElementById('uiSpecialNote');
  if (curKey.isExceptionB || curSet.id === 7) {
    noteEl.style.display = 'block';
    noteEl.textContent = t.noteB;
  } else if (curSet.id === 9) {
    noteEl.style.display = 'block';
    noteEl.textContent = t.noteS9;
  } else if (curSet.id === 10) {
    noteEl.style.display = 'block';
    noteEl.textContent = t.noteS10;
  } else {
    noteEl.style.display = 'none';
  }
}

function renderResultLines() {
  const t = I18N[currentLang];
  const curSet = PRACTICE_SETS[currentSetIdx];
  const inputs = getKeyInputs(curSet.id, currentKeyIdx);
  const box = document.getElementById('linesBox');
  box.innerHTML = '';

  const totalLines = Math.floor(inputs.length / 20) + 1;

  for (let lineIdx = 0; lineIdx < totalLines; lineIdx++) {
    const start = lineIdx * 20;
    const slice = inputs.slice(start, start + 20);
    const isCurrentLine = (lineIdx === totalLines - 1);

    const row = document.createElement('div');
    row.className = 'line-row' + (isCurrentLine ? ' active' : '');

    const num = document.createElement('div');
    num.className = 'line-num';
    num.textContent = t.lineN(lineIdx + 1);
    row.appendChild(num);

    const grid = document.createElement('div');
    grid.className = 'cells-grid';

    let lineErrs = 0;
    for (let c = 0; c < 20; c++) {
      const cell = document.createElement('div');
      cell.className = 'char-cell';
      if (c < slice.length) {
        cell.textContent = slice[c].char;
        if (!slice[c].ok) {
          cell.classList.add('is-error');
          lineErrs++;
        }
      } else if (isCurrentLine && c === slice.length) {
        cell.classList.add('is-cursor');
      }
      grid.appendChild(cell);
    }
    row.appendChild(grid);

    const errBadge = document.createElement('div');
    errBadge.className = 'line-err' + (lineErrs > 0 ? ' has-err' : '');
    errBadge.textContent = `-${lineErrs}`;
    row.appendChild(errBadge);

    box.appendChild(row);
  }

  box.scrollTop = box.scrollHeight;
  document.getElementById('uiFeedback').textContent = lastFeedback;
}

function renderKeyboard() {
  const curSet = PRACTICE_SETS[currentSetIdx];
  const curKey = curSet.keys[currentKeyIdx];
  const kbBox = document.getElementById('kbContainer');
  kbBox.innerHTML = '';

  KB_ROWS.forEach(rowCodes => {
    const rDiv = document.createElement('div');
    rDiv.className = 'kb-row';

    rowCodes.forEach(code => {
      const kDiv = document.createElement('div');
      kDiv.className = 'kb-key';
      kDiv.dataset.code = code;

      if (code === 'ShiftLeft' || code === 'ShiftRight') {
        kDiv.classList.add('kb-shift');
        kDiv.textContent = code === 'ShiftLeft' ? 'Left Shift' : 'Right Shift';
        if (curKey.reqShift === code) kDiv.classList.add('shift-req');
      } else {
        const def = KEY_MAP[code];
        const topShift = (def.s !== def.n) ? def.s : '';
        kDiv.innerHTML = `
          <div class="kb-top"><span>${def.en}</span><span>${topShift}</span></div>
          <div class="kb-main">${def.n}</div>
        `;
        if (code === 'KeyF' || code === 'KeyJ') {
          kDiv.classList.add('fj-fixed');
          const bump = document.createElement('div');
          bump.className = 'fj-bump';
          kDiv.appendChild(bump);
        }
        if (code === curKey.code) {
          kDiv.classList.add('target-key');
        }
      }
      rDiv.appendChild(kDiv);
    });
    kbBox.appendChild(rDiv);
  });
}

function renderModalContent() {
  const t = I18N[currentLang];
  const curSet = PRACTICE_SETS[currentSetIdx];
  document.getElementById('uiModalTitle').textContent = t.modalTitle;
  document.getElementById('uiModalStageName').textContent = t.sets[curSet.id][0];
  document.getElementById('uiModalStageDesc').textContent = t.sets[curSet.id][1];
  document.getElementById('btnConfirmStart').textContent = t.startBtn;

  const ul = document.getElementById('uiModalPrinciples');
  ul.innerHTML = '';
  t.principles.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    ul.appendChild(li);
  });
}

function renderAll() {
  const t = I18N[currentLang];
  document.getElementById('uiAppTitle').textContent = t.title;
  document.getElementById('uiMusicLabel').textContent = t.music;
  document.getElementById('btnPlay').textContent = t.play;
  document.getElementById('btnStop').textContent = t.stop;
  document.getElementById('btnFinish').textContent = t.finish;
  document.getElementById('btnReset').textContent = t.reset;
  document.getElementById('btnLogin').textContent = t.login;
  document.getElementById('uiSetSelectTitle').textContent = t.step1;
  document.getElementById('uiKeySelectTitle').textContent = t.step2;
  document.getElementById('uiLineProgLabel').textContent = t.prog;
  document.getElementById('uiSetErrLabel').textContent = t.setErr;
  document.getElementById('uiGuideTitle').textContent = t.guideTitle;
  document.getElementById('btnOpenModal').textContent = t.reopen;
  document.getElementById('uiLinesTitle').textContent = t.linesTitle;
  document.getElementById('uiLegFJ').textContent = t.legFJ;
  document.getElementById('uiLegTarget').textContent = t.legT;
  document.getElementById('uiLegBoth').textContent = t.legBoth;
  document.getElementById('uiLegShift').textContent = t.legS;

  setMusicStatus(musicStatusKey, musicStatusWarn);
  renderLanguageButtons();
  renderSelectors();
  renderTargetAndGuide();
  renderResultLines();
  renderKeyboard();
  renderModalContent();
}
