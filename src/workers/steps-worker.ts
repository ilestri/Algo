self.onmessage = (e: MessageEvent) => {
  const { algo, payload } = e.data as { algo: string; payload:any };
  // TODO: algo에 따라 스텝 생성기 호출(동일 파일 복사 or importScripts)
  // 예: if (algo === 'sorting/quick') { const steps = quickSortSteps(payload.array); postMessage({ steps }); }
  postMessage({ steps: [] });
};
