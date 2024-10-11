import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-custom-quantity',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './custom-quantity.component.html',
  styleUrl: './custom-quantity.component.scss',
})
export class CustomQuantityComponent {
  public quantityForm: UntypedFormGroup = new UntypedFormGroup({});

  prePareForm() {
    this.quantityForm = new UntypedFormGroup({
      quantity : new UntypedFormControl('', [Validators.required]), 
    });
  }

  public getErrorMessage(control: AbstractControl, fieldLabel: string): string {
    if (control.errors?.required) {
      return `${fieldLabel} is required.`;
    }
    if (control.errors?.pattern) {
      return `Invalid format for ${fieldLabel}.`;
    }
    if (control.errors?.whitespace) {
      return `No leading or trailing whitespace allowed in ${fieldLabel}.`;
    }
    if (control.errors?.noNegativeNumbers) {
      return `${fieldLabel} cannot contain negative numbers.`;
    }
    if (control.errors?.maxlength) {
      return `${fieldLabel} cannot exceed ${control.errors.maxlength.requiredLength} characters.`;
    }
    return '';
  }
}
