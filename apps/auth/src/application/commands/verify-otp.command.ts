export class VerifyOtpCommand {
  constructor(
    public readonly email: string,
    public readonly otp: string,
    public readonly otpType: string,
  ) {}
}
