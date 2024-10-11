import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  UntypedFormControl,
  AbstractControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserFormDetails } from '../../models/logindetails';
import { CommonModule } from '@angular/common';
import { NgOtpInputComponent, NgOtpInputModule } from 'ng-otp-input';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import {
  AuthenticationResponse,
  AuthenticationService,
} from '../../data-providers/authentication.service';
import { Router } from '@angular/router';
import { SubscriptionBase } from 'src/app/global/utils/subscription-base';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginError, LoginPostBody } from '../../constant/login-constant';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgOtpInputModule, SharedModule],
  providers: [
    AuthenticationService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends SubscriptionBase implements OnInit {
  public userForm!: FormGroup<UserFormDetails>;

  public passworduserform!: FormGroup<UserFormDetails>;

  public PuserForm!: FormGroup;

  public loading: boolean = false;

  frgotPassword: boolean = false;

  isUsernameIncorrect: boolean = false;

  isPasswordIncorrect: boolean = false;

  @ViewChild(NgOtpInputComponent, { static: false })
    ngOtpInput?: NgOtpInputComponent;

  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
  ) {
    super();
  }

  hide = true;

  ngOnInit(): void {
    localStorage.clear();
    this.prepareForm();
    this.forgotusername(this.PuserForm);
  }

  private forgotusername(userData: any) {
    this.PuserForm = new FormGroup({
      Pusername: new FormControl(
        userData && userData.Pusername ? userData.Pusername : '',
        {
          validators: [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(250),
            // Validators.pattern('^(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+')
          ],
        },
      ),
    });
  }

  private prepareForm(): void {
    this.userForm = new FormGroup<UserFormDetails>({
      pin: new UntypedFormControl('', {
        validators: [Validators.required, this.checkOtpLength],
      }),
    });
  }

  get f() {
    return this.userForm.controls;
  }

  get g() {
    return this.PuserForm.controls;
  }

  public onSubmit() {
    if (this.userForm.invalid) return;
    this.loading = true;
    const formData = LoginPostBody.BindForm(this.userForm?.value);
    this.dataSubs.push(
      this.authenticationService.authentication(formData).subscribe({
        next: (res: AuthenticationResponse) => {
          if (res.success) {
            this.router.navigate(['/devices']);
          } else {
            //TODO ERROR heading
            if (res.message === LoginError.ERROR_INVALID_PIN) {
              this.f?.pin?.setErrors({ invalidPin: true });
              this.snackBar.open(
                this.translate.instant('Incorrect PIN. Please try again.'),
                this.translate.instant('OK'),
                {
                  duration: 5000,
                },
              );
            } else {
              this.snackBar.open(
                this.translate.instant('GLOBAL.ERROR'),
                this.translate.instant('GLOBAL.OK'),
                {
                  duration: 5000,
                },
              );
            }

          }
          this.loading = false;
        },
        error(err) {
          console.log(err);
        },
      }),
    );
  }

  forgotPassword() {
    this.frgotPassword = true;
  }

  backtomain() {
    this.frgotPassword = false;
  }

  onOtpChange(event: any): void {
    console.log('OTP change event: ', event);
    return;
  }

  addDigit(digit: number) {
    if (this.ngOtpInput?.currentVal?.length === 4) {
      return;
    }

    this.ngOtpInput?.setValue(
      this.ngOtpInput?.currentVal
        ? `${this.ngOtpInput?.currentVal}${digit}`
        : `${digit}`,
    );
  }

  clearPin() {
    if (!this.ngOtpInput?.currentVal) {
      return;
    }

    this.ngOtpInput.setValue(this.ngOtpInput.currentVal.slice(0, -1));
  }

  get pinControl(): FormControl | null {
    return this.userForm.get('pin') as FormControl;
  }

  private checkOtpLength(
    control: AbstractControl,
  ): { [key: string]: boolean } | null {
    const pin = control.value;
    if (pin && pin.length === 4) {
      return null;
    } else {
      return { otpLength: true };
    }
  }

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
