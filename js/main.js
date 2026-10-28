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
  // 연습 종료: TXT 저장 → (로그인 시) 랭킹 기록 저장 → 이번 연습 기록을 비우고 새로 시작
  const t = I18N[currentLang];
  const stats = getSessionStats();
  const fileName = exportTxtFile();
  session = { startTime: null, records: {} };
  saveSession();
  lastFeedback = '';
  renderAll();
  saveSessionToCloud(stats).then((result) => {
    const cloudMsg = { ok: t.cloudOk, pending: t.cloudPending, error: t.cloudError }[result];
    alert(t.saved(fileName) + (cloudMsg ? '\n' + cloudMsg : ''));
  });
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

document.getElementById('btnLogin').addEventListener('click', (e) => {
  e.currentTarget.blur();
  onLoginButtonClick();
});

// 랭킹은 새 탭으로 열어 연습 화면과 음악이 끊기지 않게 한다
document.getElementById('btnRanking').addEventListener('click', (e) => {
  e.currentTarget.blur();
  window.open(`ranking.html?lang=${currentLang}`, '_blank');
});

initFirebase();
initMusicPlayer();
renderAll();
