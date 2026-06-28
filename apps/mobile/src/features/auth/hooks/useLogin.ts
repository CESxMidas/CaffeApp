import { useMutation } from '@tanstack/react-query';
import type { LoginRequestDto } from '@caffeapp/shared';
import { authService, setApiAccessToken } from '@shared/lib/api';
import { saveStaffRole, saveTokens } from '@shared/lib/storage';
import { useSessionStore } from '@shared/stores/session';

export function useLogin() {
  const setLoginResult = useSessionStore((s) => s.setLoginResult);

  return useMutation({
    mutationFn: (payload: LoginRequestDto) => authService.login(payload),
    onSuccess: async (data) => {
      await saveTokens(data.accessToken, data.refreshToken);
      await saveStaffRole(data.staff.role);
      setApiAccessToken(data.accessToken);
      setLoginResult(data);
    },
  });
}
