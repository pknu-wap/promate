const baseUrl = import.meta.env.VITE_API_BASE_URL;

export async function getKakaoLoginUrl() {
  const response = await fetch(`${baseUrl}/api/auth/kakao/login`);

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
    `${baseUrl}/api/auth/kakao/callback?${queryString}`,
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    let message = `카카오 로그인에 실패했습니다. (Status: ${response.status})`;
    try {
      const errorResult = await response.json();
      message = errorResult.message || message;
    } catch (e) {}
    throw new Error(message);
  }
  const result = await response.json();
  if (!result.isSuccess) {
    throw new Error(result.message || "카카오 로그인에 실패했습니다.");
  }

  return result.data;
}