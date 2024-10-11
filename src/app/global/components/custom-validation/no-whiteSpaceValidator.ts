
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function onlyWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  const isValid = control.value ? control.value.trim() === control.value : true;

  return isValid ? null : { whitespace: true }; // Return 'whitespace' error if the value contains leading/trailing whitespace
}

