import { ValidationConstraints } from '../constants/validation-constraints.const';

const characters = {
  numeric: '0123456789',
  alphabetLowercase: 'abcdefghijklmnopqrstuvwxyz',
  alphabetUppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
};

const codeGenerator = (chars, len) => {
  let result = '';
  while (len--) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const generateVerificationCode = (codeLength: number) =>
  codeGenerator(characters.numeric, codeLength);

export const generateReferralCode = () =>
  codeGenerator(
    `${characters.numeric}${characters.alphabetLowercase}${characters.alphabetUppercase}`,
    8,
  );

export const generateTrackingCode = () =>
  codeGenerator(characters.numeric, ValidationConstraints.trackingCodeLength);

export const generatePaymentSectionTrackingCode = () =>
  codeGenerator(characters.numeric, 21);

export const generateOrderTrackingCode = () =>
  codeGenerator(characters.numeric, 6);
