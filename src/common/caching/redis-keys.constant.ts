import { recaptchaConfig, redisConfig } from '../../config';

interface RedisKeyResult {
  name: string;
  ttl: number | null;
}

export const RedisKeys = {
  phoneNumberVerificationCode: (key: string | number): RedisKeyResult => {
    return {
      name: `phone-number-verification-code:${String(key)}`,
      ttl: redisConfig().otpCodeTtl,
    };
  },
  emailVerificationCode: (key: string | number): RedisKeyResult => {
    return {
      name: `email-verification-code:${String(key)}`,
      ttl: redisConfig().otpCodeTtl,
    };
  },
  forgetPasswordCode: (userId: number): RedisKeyResult => {
    return {
      name: `forget-password-code:${String(userId)}`,
      ttl: redisConfig().otpCodeTtl,
    };
  },
  forgetPasswordTempToken: (key: number): RedisKeyResult => {
    return {
      name: `forget-password-temp-token:${String(key)}`,
      ttl: 5 * 60,
    };
  },
  twoFATempToken: (key: number): RedisKeyResult => {
    return {
      name: `two-f-a-temp-token:${String(key)}`,
      ttl: 5 * 60,
    };
  },
  tempToken: (key: number): RedisKeyResult => {
    return {
      name: `temp-token:${String(key)}`,
      ttl: 5 * 60,
    };
  },
  captchaExecutionCount: (ip: string): RedisKeyResult => {
    return {
      name: `captcha-execution-count:${ip}`,
      ttl: recaptchaConfig().executionAfterTtl,
    };
  },
  twoFASecret: (key: number): RedisKeyResult => {
    return {
      name: `two-f-a-secret:${String(key)}`,
      ttl: 5 * 60,
    };
  },
};
