import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";

export class FormControlTyped<T> extends FormControl {
  readonly value: T;
  readonly valueChanges: Observable<T>;
  constructor(value: string) {
    super(value);
  }
}
