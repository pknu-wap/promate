// 서버가 없을 때 사용하는 테스트용 함수
export const getUserInfo = async () => {
  return new Promise((resolve) => {
    // 서버 응답 시간을 시뮬레이션 (0.5초)
    setTimeout(() => {
      resolve({
        data: {
          id: 1,
          name: "Sumin", // 유저 별명 적용
          email: "sumin@example.com",
          profileImageUrl: null
        }
      });
    }, 500);
  });
};