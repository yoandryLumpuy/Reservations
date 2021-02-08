import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringsLimited'
})
export class StringsLimitedPipe implements PipeTransform {

  transform(value: any, limit: number): any {
    if (limit)
      return (value as string).length > limit ? (value as string).substring(0, limit) : value;

    return  (value as string).length > 10 ? (value as string).substring(0, limit) : value;
  }

}
