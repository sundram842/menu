import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from 'src/app/shared/shared.module';
import { onlyWhitespaceValidator } from 'src/app/global/components/custom-validation/no-whiteSpaceValidator';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';
import {
  MenuItemService,
  PrimaryIngredientResponse,
} from '../../services/menu-item.service';
import { MenuItem, PrimaryIngredient } from '../../models/menu-item.model';
import {
  CategoryResponse,
  CategoryService,
} from 'src/app/category/services/category.service';
import { BasicCategoryDetail } from 'src/app/category/models/category.model';
import { MatSelectChange } from '@angular/material/select';
import { ErrorConstants } from '../../menu-item.contsant';

export interface CreateMenuItemInput {
  code: FormControl<string>;
  sku: FormControl<string>;
  name: FormControl<string>;
  displayName: FormControl<string>;
  description: FormControl<string | null>;
  unitOfMeasurement: FormControl<string | null>;
  category: FormControl<string | null>;
  subCategory: FormControl<string | null>;
  basePrice: FormControl<number>;
  sellingPrice: FormControl<number>;
  primaryIngredient: FormControl<string | null>;
  canBeModifier: FormControl<boolean>;
}

@Component({
  selector: 'app-create-menu-item',
  standalone: true,
  imports: [CommonModule, SharedModule, TranslateModule],
  providers: [
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
    MenuItemService,
    CategoryService,
  ],
  templateUrl: './create-menu-item.component.html',
  styleUrl: './create-menu-item.component.scss',
})
export class CreateMenuItemComponent
  extends SubscriptionBase
  implements OnInit {
  public primaryIngredients!: PrimaryIngredient[];

  public categories!: BasicCategoryDetail[];

  public subCategories!: BasicCategoryDetail[];

  public displaySubCategory = false;

  public menuDetails?: MenuItem;

  public createMenuItemForm!: FormGroup<CreateMenuItemInput>;

  public loader!: boolean;

  constructor(
    private readonly translate: TranslateService,
    private dialogRef: MatDialogRef<CreateMenuItemComponent>,
    private readonly snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private readonly menuitemService: MenuItemService,
    private readonly categoryService: CategoryService,
    private readonly translateService: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data) {
      this.getMenuItems(this.data);
    } else {
      this.getPrimaryIngredients();
      this.prepareForm();
    }
  }

  public prepareForm() {
    this.createMenuItemForm =  new FormGroup<CreateMenuItemInput>({
      code: new FormControl<string>(this.menuDetails?.code ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(50),
          onlyWhitespaceValidator,
        ],
      }),
      sku: new FormControl<string>(this.menuDetails?.sku ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(50),
          onlyWhitespaceValidator,
        ],
      }),
      name: new FormControl<string>(this.menuDetails?.name ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(50),
          onlyWhitespaceValidator,
        ],
      }),
      displayName: new FormControl<string>(this.menuDetails?.displayName ?? '', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.maxLength(50),
          onlyWhitespaceValidator,
        ],
      }),
      description: new FormControl<string>(this.menuDetails?.description ?? '', {
        nonNullable: false,
        validators: [
          Validators.required,
          Validators.maxLength(255),
          onlyWhitespaceValidator,
        ],
      }),
      basePrice: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      sellingPrice: new FormControl<number>(0, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      category: new FormControl<string>(String(this.menuDetails?.primaryCategoryInfo?.id) ?? '', {
        nonNullable: true,
        validators: [],
      }),
      subCategory: new FormControl<string>(String(this.menuDetails?.secondaryCategoryInfo?.id) ?? '', {
        nonNullable: false,
      }),
      primaryIngredient: new FormControl<string>(this.menuDetails?.primaryIngredientInfo?.id ?? '', {
        nonNullable: true,
        validators: [],
      }),
      canBeModifier: new FormControl<boolean>(false, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      unitOfMeasurement: new FormControl<string>(this.menuDetails?.unitOfMeasurement ?? '', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }

  public getErrorMessage(control: AbstractControl, fieldLabel: string): string {
    if (control.errors?.required) {
      return this.translateService.instant('FORM_VALIDATIONS.REQUIRED', {
        name: fieldLabel,
      });
    }
    if (control.errors?.pattern) {
      return this.translateService.instant('FORM_VALIDATIONS.PATTERN', {
        name: fieldLabel,
      });
    }
    if (control.errors?.whitespace) {
      return this.translateService.instant(
        'FORM_VALIDATIONS.LEADING_WHITE_SPACES',
      );
    }
    if (control.errors?.noNegativeNumbers) {
      return this.translateService.instant(
        'FORM_VALIDATIONS.NO_NEGATIVE_NUMBERS',
      );
    }
    if (control.errors?.maxlength) {
      return this.translateService.instant('FORM_VALIDATIONS.MAX_LENGTH_TITLE', {
        name: fieldLabel,
        maxLength: control.errors.maxlength.requiredLength,
      });
    }
    return '';
  }

  public getMenuItems(id: string) {
    this.loader = true;
    this.dataSubs.push(this.menuitemService.getMenuItemsById(id).subscribe({
      next:(res:any)=>{
        if (res.success && res.data) {
          this.menuDetails = res.data;
          this.getPrimaryIngredients();
          this.prepareForm();
        } else {
          this.showSnackbarMessage(this.translate.instant('GLOBAL.OK'));
        }
      }, error(e) {
        console.log(e);
        
      },
    }));
  }

  createMenuItem(): void {
    const requestBody = MenuItem.BindForm(this.createMenuItemForm?.value);
    if (this.data) {
      this.updateMenuDetails(requestBody, this.data);
    } else {
      this.dataSubs.push(
        this.menuitemService.createMenuItem(requestBody).subscribe({
          next: (response) => {
            if (response.success) {
              this.dialogRef.close(true);
              this.snackBar.open('Menu Item Created', 'OK', { duration: 5000 });
            } else {
              if (
                response?.message ===
                ErrorConstants.CONST_ERROR_MENUITEM_ALREADY_EXIST_WITH_SAME_SKU
              ) {
                this.showSnackbarMessage('SKU must be unique');
              } else {
                this.showSnackbarMessage(this.translate.instant('GLOBAL.OK'));
              }
            }
            this.loader = false;
          },
        }),
      );
    }
  }
  
  public updateMenuDetails(data : any, id: string) {
    this.dataSubs.push(
      this.menuitemService.updateMenuItem(data, id).subscribe({
        next: (response) => {
          if (response.success) {
            this.dialogRef.close(true);
            this.snackBar.open(this.translate.instant('MENU.UPDATE_ITEMS'), 'OK', { duration: 5000 });
          } else {
            this.dialogRef.close(false);
            if (
              response?.message ===
            ErrorConstants.CONST_ERROR_MENUITEM_ALREADY_EXIST_WITH_SAME_SKU
            ) {
              this.showSnackbarMessage('SKU must be unique');
            } else if (response?.message === ErrorConstants.CONST_ERROR_CODE_ALREADY_EXISTS) {
              this.showSnackbarMessage('Code must be unique');

            } else {
              this.showSnackbarMessage(this.translate.instant('GLOBAL.OK'));
            }
          }
          this.loader = false;
        },
      }),
    );
  }

  getPrimaryIngredients() {
    this.loader = true;
    this.dataSubs.push(
      this.menuitemService
        .getPrimaryIngredients()
        .subscribe((primaryIngredient: PrimaryIngredientResponse) => {
          if (primaryIngredient?.success && primaryIngredient?.data) {
            this.primaryIngredients = primaryIngredient?.data;
          } else {
            this.primaryIngredients = [];
            // this.showSnackbarMessage('No primary ingredients found');
          }
          this.getCategories();
        }),
    );
    //this.loader = true;
  }

  getCategories() {
    this.dataSubs.push(
      this.categoryService
        .getCategories()
        .subscribe((category: CategoryResponse) => {
          if (category?.success && category?.data) {
            this.categories = category?.data;
          } else {
            this.categories = [];
            //TODO ERROR heading
            this.categories = [];
            //this.showSnackbarMessage();
          }
          this.loader = false;
        }),
    );
  }

  getSubCategories(id: number) {
    this.loader = true;
    this.dataSubs.push(
      this.categoryService
        .getSubCategories(id)
        .subscribe((subCategory: CategoryResponse) => {
          if (subCategory?.success && subCategory?.data) {
            this.subCategories = subCategory?.data;
            this.displaySubCategory = true;
          } else {
            this.subCategories = [];
            this.displaySubCategory = false;
            this.createMenuItemForm.controls.subCategory.setValue('');
          }
          this.loader = false;
        }),
    );
  }

  onCategorySelect(event: MatSelectChange) {
    // Fetch or filter subcategories based on the selected category
    this.getSubCategories(event?.value);
  }

  validatePositiveNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Check if the value is not a number or is negative
    if (isNaN(Number(value)) || Number(value) < 0) {
      input.value = ''; // Clear the input or handle the error
    }
  }

  public showSnackbarMessage(message : string) {
    this.snackBar.open(message, this.translate.instant('GLOBAL.OK'), {
      duration: 5000,
    });
  }

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
