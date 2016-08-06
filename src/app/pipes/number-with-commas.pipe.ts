import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'numberWithCommas' })
export class NumberWithCommasPipe implements PipeTransform {
    transform(value: number): string {
        if (value) {
            return value.toLocaleString();
        }
        return null;
    }
}