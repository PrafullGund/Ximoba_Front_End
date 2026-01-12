import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function offerPriceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const price = control.get('price')?.value;
    const offerPrice = control.get('offer_prize')?.value;

    if (price && offerPrice && +offerPrice > +price) {
      return { offerPriceExceeds: true };
    }

    return null;
  };
}
