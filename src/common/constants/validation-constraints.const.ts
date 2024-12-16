export class ValidationConstraints {
  static readonly maxIntegerValue = 2147483646;
  static readonly pageLimit = 50;
  static readonly minSortFieldLength = 2;
  static readonly maxSortFieldLength = 15;
  static readonly couponCodeLength = 4;
  static readonly otpCodeLength = 6;
  static readonly phonePattern = /^(?![1-9]).{11}$/;
  static readonly faxPattern = /^\+?[0-9]{6,}$/;
  static readonly trackingCodeLength = 8;
}
