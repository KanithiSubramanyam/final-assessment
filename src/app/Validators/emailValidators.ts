import { AbstractControl, ValidationErrors } from '@angular/forms';

export function emailDomainValidator(allowedDomains: string[]): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.value;
    const domain = email?.split('@')[1];
    if (domain && !allowedDomains.includes(domain)) {
      return { invalidDomain: true };
    }
    return null;
  };
}
