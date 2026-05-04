export const getMyProjectList = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          { id: 101, projectName: "현직자 커피챗 멘토링", deadLine: "2026.04.15", colorTag: "red" },
          { id: 102, projectName: "부산 병원 접근성 분석", deadLine: "2026.05.01", colorTag: "yellow" },
          { id: 103, projectName: "AI 스터디 웹캠 프로젝트", deadLine: "2026.04.20", colorTag: "green" },
        ]
      });
    }, 500)
  });
};