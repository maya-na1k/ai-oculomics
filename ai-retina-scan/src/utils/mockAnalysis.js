export async function mockAnalyze(imageFile) {
  await new Promise((r) => setTimeout(r, 2500));
  return {
    qualityScore: (Math.random() * 20 + 80).toFixed(1),
    drRisk: (Math.random() * 100).toFixed(1),
    cvdRisk: (Math.random() * 100).toFixed(1),
  };
}
