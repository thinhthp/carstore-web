import BaseRequest, { BaseRequestV2 } from '@/config/axios.config';
import { useMutation, useQuery } from '@tanstack/react-query';
import __helpers from '@/helpers/index';

export const useLogin = () => {
  return useMutation({
    mutationKey: ['login'],
    mutationFn: async (model: any) => {
      return BaseRequest.Post(`/api/accounts/login`, model);
    }
  });
};

export const useLoginGoogle = () => {
  return useMutation({
    mutationKey: ['login-google'],
    mutationFn: async () => {
      return BaseRequest.Get(`/api/accounts/google-signin`);
    }
  });
};
export const useInitForgotPassword = () => {
  return useMutation({
    mutationKey: ['init-forgot-password'],
    mutationFn: async (model: any) => {
      return BaseRequestV2.Post(`/api/accounts/forgot-password`, model);
    }
  });
};

// 1) GET api/accounts/reset-password?userId=...&token=... => validate link
export const useValidateResetPassword = (
  userId: string | undefined,
  token: string | undefined,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['validate-reset-password', userId, token],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('userId', userId as string);
      params.set('token', token as string);
      return await BaseRequest.Get(
        `/api/accounts/reset-password?${params.toString()}`
      );
    },
    enabled: enabled && !!userId && !!token
  });
};

// 2) POST api/accounts/reset-password { userId, token, newPassword }
export const useResetPassword = () => {
  return useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (model: {
      userId: string;
      token: string;
      newPassword: string;
    }) => {
      return BaseRequestV2.Post(`/api/accounts/reset-password`, model);
    }
  });
};
