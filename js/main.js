// ============================================================================
// 9. [초기화 및 버튼 이벤트 바인딩]
// ============================================================================
document.getElementById('btnConfirmStart').addEventListener('click', (e) => {
  e.currentTarget.blur();
  closeGuideModal();
});

document.getElementById('btnOpenModal').addEventListener('click', (e) => {
  e.currentTarget.blur();
  openGuideModal();
});

document.getElementById('btnFinish').addEventListener('click', (e) => {
  e.currentTarget.blur();
  // 연습 종료: TXT 저장 → 이번 연습 기록을 비우고 다음 연습을 새로 시작할 수 있게 한다
  const fileName = exportTxtFile();
  session = { startTime: null, records: {} };
  saveSession();
  lastFeedback = '';
  renderAll();
  alert(I18N[currentLang].saved(fileName));
});

document.getElementById('btnReset').addEventListener('click', (e) => {
  e.currentTarget.blur();
  if (confirm(I18N[currentLang].resetAsk)) {
    session = { startTime: null, records: {} };
    saveSession();
    lastFeedback = '';
    renderAll();
  }
});

initMusicPlayer();
renderAll();
