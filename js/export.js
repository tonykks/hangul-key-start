// ============================================================================
// 8. [TXT 파일 내보내기 (종료 시각 기준 YYYYMMDD_HHMMSS.txt → 브라우저 다운로드 폴더)]
// ============================================================================
function pad2(n) {
  return String(n).padStart(2, '0');
}

function formatDateTime(isoStr) {
  const d = isoStr ? new Date(isoStr) : new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function formatFileName(isoStr) {
  const d = isoStr ? new Date(isoStr) : new Date();
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}_${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}.txt`;
}

function exportTxtFile() {
  const endIso = new Date().toISOString();
  const startIso = session.startTime || endIso;

  let lines = [];
  lines.push('==================================================');
  lines.push('한글 글쇠·손가락 기초 연습 결과 기록');
  lines.push('==================================================');
  lines.push(`시작 시간: ${formatDateTime(startIso)}`);
  lines.push('');

  let hasAnyRecord = false;
  PRACTICE_SETS.forEach(s => {
    s.keys.forEach((kObj, kIdx) => {
      const arr = session.records[getRecordKey(s.id, kIdx)] || [];
      if (arr.length === 0) return;
      hasAnyRecord = true;

      const setTitle = I18N.ko.sets[s.id][0];
      lines.push(`[${setTitle}] 목표 글쇠: ${kObj.char}(${kObj.label})`);

      // 20자씩 한 줄, 각 줄 끝에 -오답 수 (20자 미만 마지막 줄도 그대로 보존)
      for (let i = 0; i < arr.length; i += 20) {
        const chunk = arr.slice(i, i + 20);
        const str = chunk.map(item => item.char).join('');
        const errCnt = chunk.filter(item => !item.ok).length;
        lines.push(`${str} -${errCnt}`);
      }
      lines.push('');
    });
  });

  if (!hasAnyRecord) {
    lines.push('(입력된 연습 기록이 없습니다)');
    lines.push('');
  }

  lines.push(`종료 시간: ${formatDateTime(endIso)}`);
  lines.push('==================================================');

  // 메모장에서도 한글이 깨지지 않도록 UTF-8 BOM을 붙인다
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
  const fileName = formatFileName(endIso);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return fileName;
}
