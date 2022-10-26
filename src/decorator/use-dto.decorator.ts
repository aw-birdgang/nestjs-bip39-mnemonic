import type { AbstractEntity } from './abstract.entity';
import type { AbstractDto } from './dto/abstract.dto';
import type { Constructor } from './types';

export function UseDto(
  dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>,
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
