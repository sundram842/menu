import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { DevicesService } from '../../services/devices.service';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { onlyWhitespaceValidator } from 'src/app/global/components/custom-validation/no-whiteSpaceValidator';
import { Devices } from '../../models/devices-models';
import { ErrorConstants } from 'src/app/shared/models/error-constant';

@Component({
  selector: 'app-register-device',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  templateUrl: './register-device.component.html',
  styleUrl: './register-device.component.scss',
})
export class RegisterDeviceComponent
  extends SubscriptionBase
  implements OnInit {
  public registerDeviceForm: UntypedFormGroup = new UntypedFormGroup({});

  public deviceDetails?: Devices;

  public loader?: boolean;

  public registerDevice?: boolean;

  public types = [
    { key: 'mobile', value: 'Mobile' },
    { key: 'tablet', value: 'Tablet' },
  ];

  public posClients = [
    {
      id: '0bf978e5-ebf7-4915-9cad-260a4cabbb4e',
      displayName: 'Kitchen display',
      title: 'kds',
    },
  ];

  constructor(
    private readonly deviceService: DevicesService,
    private readonly translate: TranslateService,
    private dialogRef: MatDialogRef<RegisterDeviceComponent>,
    private readonly snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data) {
      this.registerDevice = false;
      this.getDetailsById(this.data);
    } else {
      this.registerDevice = true;
      this.prepareForm();
    }
  }

  public getDetailsById(id: string) {
    this.loader = true;
    this.dataSubs.push(
      this.deviceService.getDevicesListById(id).subscribe((response) => {
        if (response.success && response.deviceList) {
          this.deviceDetails = response?.deviceList;
          if (this.deviceDetails) this.prepareForm();
        } else {
          if (response?.message)
            this.showSnackbarMessage(response?.message);
        }
        this.loader = false;
      }),
    );
  }

  public prepareForm() {
    if (this.deviceDetails) {
      // If deviceDetails exists, make fields optional
      this.registerDeviceForm = new UntypedFormGroup({
        deviceName: new UntypedFormControl(this.deviceDetails?.name ?? '', [
          Validators.maxLength(50),
          onlyWhitespaceValidator,
        ]),
        ipAddress: new UntypedFormControl(this.deviceDetails?.ipAddress ?? '', [
          Validators.pattern(
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
          ),
        ]),
        macAddress: new UntypedFormControl(this.deviceDetails?.macAddress ?? '', [
          Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
        ]),
        // Optional fields can be added here if needed
      });
    } else {
      // If deviceDetails is not provided, make fields mandatory
      this.registerDeviceForm = new UntypedFormGroup({
        deviceName: new UntypedFormControl('', [
          Validators.required,
          Validators.maxLength(50),
          onlyWhitespaceValidator,
        ]),
        type: new UntypedFormControl('', [Validators.required]),
        make: new UntypedFormControl('', [
          Validators.required,
          onlyWhitespaceValidator,
        ]),
        model: new UntypedFormControl('', [
          Validators.required,
          onlyWhitespaceValidator,
        ]),
        deviceId: new UntypedFormControl(''),
        posClientId: new UntypedFormControl('', [Validators.required]),
        deviceSerialNumber: new UntypedFormControl('', [
          Validators.required,
          onlyWhitespaceValidator,
        ]),
        firmwareVersion: new UntypedFormControl('', [
          Validators.required,
          onlyWhitespaceValidator,
        ]),
        connectionType: new UntypedFormControl('', [
          Validators.required,
          onlyWhitespaceValidator,
        ]),
        ipAddress: new UntypedFormControl('', [
          Validators.required,
          Validators.pattern(
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
          ),
        ]),
        macAddress: new UntypedFormControl('', [
          Validators.required,
          Validators.pattern(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/),
        ]),
        osCompatibility: new UntypedFormControl(''), // Optional field
      });
    }
    
  }

  // public getErrorMessage(control: AbstractControl, fieldLabel: string): void {
  //   if (control.errors && control.errors.required) {
  //     return this.translate.instant('FORM_VALIDATIONS.REQUIRED', {
  //       name: fieldLabel,
  //     });
  //   }
  //   if (control?.errors && control?.errors?.pattern) {
  //     return this.translate.instant('FORM_VALIDATIONS.PATTERN', {
  //       name: fieldLabel,
  //     });
  //   } else if (control.errors && control.errors.whitespace) {
  //     return this.translate.instant('FORM_VALIDATIONS.LEADING_WHITE_SPACES');
  //   } else if (control.errors && control.errors.noNegativeNumbers) {
  //     return this.translate.instant('FORM_VALIDATIONS.NO_NEGATIVE_NUMBERS');
  //   } else if (control.errors && control.errors.maxlength) {
  //     return this.translate.instant('VALIDATIONS.MAX_LENGTH_TITLE', {
  //       title: fieldLabel,
  //       maxLength: control?.errors?.maxlength?.requiredLength,
  //     });
  //   }
  //   return;
  // }

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
  

  public creatDevice() {
    this.loader = true;
    if (this.deviceDetails) {
      this.updateDevice();
    } else {
      this.dataSubs.push(
        this.deviceService
          .createDevice(this.registerDeviceForm?.value)
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.dialogRef.close(true);
                this.snackBar.open(
                  // this.translate.instant('DEVICE.DEVICE_CREATED'),
                  // this.translate.instant('GLOBAL.ok'),
                  'Device created successfully', 'ok',
                  { duration: 5000 },
                );
              } else {
                this.dialogRef.close(false);
                let errorMessage = '';

                switch (response.message) {
                  case ErrorConstants.CONST_ERROR_INVALID_DEVICE_ID:
                    errorMessage = 'Invalid Device ID';
                    break;
                  case ErrorConstants.CONST_ERROR_BUSINESS_CENTER_ID_INVALID:
                    errorMessage = 'Invalid Business Center ID';
                    break;
                  case ErrorConstants.CONST_ERROR_PARTNER_ID_IS_NOT_ASSOCIATED_WITH_BUSINESS_CENTER:
                    errorMessage = 'Partner is not associated with the Business Center';
                    break;
                  case ErrorConstants.CONST_ERROR_BUSINESS_CENTER_HAS_NO_LOCATION:
                    errorMessage = 'Business Center has no location';
                    break;
                  case ErrorConstants.CONST_ERROR_INVALID_POS_CLIENT_ID:
                    errorMessage = 'Invalid POS Client ID';
                    break;
                  default:
                    errorMessage = 'Oops someting went wrong...!';
                    break;
                }
                this.showSnackbarMessage(errorMessage);
              }
              this.loader = false;
            }, error(e) {
              console.log(e);
              
            },
          }),
      );
    }
  }

  public updateDevice() {
    this.loader = true;
    this.dataSubs.push(
      this.deviceService
        .updateDevice(this.registerDeviceForm?.value, this.data)
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.dialogRef.close(true);
              this.snackBar.open(
                // this.translate.instant('BATCHES.DEVICE_UPDATED'),
                // this.translate.instant('GLOBAL.ok'),
                'Device updated successfully', 'ok',
                { duration: 5000 },
              );
            } else {
              //Need do error handling
              this.dialogRef.close(false);
              let errorMessage = '';

              switch (response.message) {
                case ErrorConstants.CONST_ERROR_INVALID_DEVICE_ID:
                  errorMessage = 'Invalid Device ID';
                  break;
                case ErrorConstants.CONST_ERROR_BUSINESS_CENTER_ID_INVALID:
                  errorMessage = 'Invalid Business Center ID';
                  break;
                case ErrorConstants.CONST_ERROR_PARTNER_ID_IS_NOT_ASSOCIATED_WITH_BUSINESS_CENTER:
                  errorMessage = 'Partner is not associated with the Business Center';
                  break;
                case ErrorConstants.CONST_ERROR_BUSINESS_CENTER_HAS_NO_LOCATION:
                  errorMessage = 'Business Center has no location';
                  break;
                case ErrorConstants.CONST_ERROR_INVALID_POS_CLIENT_ID:
                  errorMessage = 'Invalid POS Client ID';
                  break;
                default:
                  errorMessage = 'Oops someting went wrong...!';
                  break;
              }
              this.showSnackbarMessage(errorMessage);
            }
            this.loader = false;
          },
        }),
    );
  }

  public showSnackbarMessage(message: string) {
    this.snackBar.open(
      message,
      'ok',
      {
        duration: 1000,
      },
    );
  }

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
