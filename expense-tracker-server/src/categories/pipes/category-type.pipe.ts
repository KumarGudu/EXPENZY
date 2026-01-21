import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

const VALID_TYPES = ['EXPENSE', 'INCOME', 'GROUP'] as const;
type CategoryTypeString = typeof VALID_TYPES[number];

@Injectable()
export class CategoryTypePipe implements PipeTransform {
  transform(value: unknown): string | undefined {
    if (!value) {
      return undefined;
    }

    // Convert lowercase to uppercase enum value
    if (typeof value !== 'string') {
      throw new BadRequestException(
        `Invalid category type. Expected string, got ${typeof value}`,
      );
    }

    const upperValue = value.toUpperCase();

    // Validate against enum values
    if (VALID_TYPES.includes(upperValue as any)) {
      return upperValue;
    }

    throw new BadRequestException(
      `Invalid category type. Must be one of: ${VALID_TYPES.join(', ')}`,
    );
  }
}
