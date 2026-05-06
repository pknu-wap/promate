const baseUrl = import.meta.env.VITE_API_BASE_URL;

export async function getKakaoLoginUrl() {
  const response = await fetch(`${baseUrl}/api/auth/kakao/login`, {
    credentials: "include",
  });

  const result = await response.json();

  if (!response.ok || !result.isSuccess) {
    throw new Error(result.message || "카카오 로그인 URL 생성에 실패했습니다.");
  }

  return result.data.url;
}