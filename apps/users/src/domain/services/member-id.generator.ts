import { Injectable } from '@nestjs/common';

@Injectable()
export class MemberIdGenerator {
  generate(): string {
    // Generate a 10-digit number
    const min = 1000000000; // 10 digits (minimum)
    const max = 9999999999; // 10 digits (maximum)

    // Generate random number between min and max
    const memberId = Math.floor(Math.random() * (max - min + 1)) + min;

    return memberId.toString();
  }
}
