const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getKakaoLoginUrl() {
  const response = await fetch(`${BASE_URL}/auth/kakao/login`);

  const result = await response.json();

  if (!response.ok || !result.isSuccess) {
    throw new Error(result.message || "카카오 로그인 URL 생성에 실패했습니다.");
  }

  return result.data.url;
}

export async function requestKakaoLogin(code, state) {
  const queryString = new URLSearchParams({
    code,
    state,
  }).toString();

  const response = await fetch(
    `${BASE_URL}/auth/kakao/callback?${queryString}`
  );

  if (!response.ok) {
    let message = `카카오 로그인에 실패했습니다. (Status: ${response.status})`;
    try {
      const errorResult = await response.json();
      message = errorResult.message || message;
    } catch (e) {
      // 서버 응답이 JSON 형식이 아닐 수 있습니다. 백엔드 로그를 확인해주세요.
    }
    throw new Error(message);
  }
  const result = await response.json();
  if (!result.isSuccess) {
    throw new Error(result.message || "카카오 로그인에 실패했습니다.");
  }

  return result.data;
}