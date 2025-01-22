import { ArgumentMetadata, Injectable, PipeTransform, Type, ValidationPipe } from '@nestjs/common';
import { ValidationPipeOptions } from '@nestjs/common/pipes/validation.pipe';
import { Reflector } from '@nestjs/core';

import { DynamicValidationOptions } from './validator-options.decorator';

/**
 * DynamicValidationPipe.
 *
 * @author dafengzhen
 */
@Injectable()
export class DynamicValidationPipe extends ValidationPipe implements PipeTransform<any, Promise<any>> {
  constructor(
    private readonly reflector: Reflector,
    options?: ValidationPipeOptions,
  ) {
    super(options);
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const validatorOptions = this.reflector.get<null | undefined | ValidationPipeOptions>(
      DynamicValidationOptions,
      metadata.metatype as Type,
    );

    if (validatorOptions) {
      Object.assign(this.validatorOptions, validatorOptions);
    }

    return super.transform(value, metadata);
  }
}
