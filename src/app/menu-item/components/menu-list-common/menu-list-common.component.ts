import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { SharedModule } from 'src/app/shared/shared.module';
import { BasicMenuItem, MenuItem } from '../../models/menu-item.model';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';
import { MenuItemService } from '../../services/menu-item.service';
import { CreateMenuItemComponent } from '../create-menu-item/create-menu-item.component';

export interface Quantities {
  id: string; 
  quantity: number
}
@Component({
  selector: 'app-menu-list-common',
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedModule],
  providers: [
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './menu-list-common.component.html',
  styleUrl: './menu-list-common.component.scss',
})
export class MenuListCommonComponent extends SubscriptionBase implements OnChanges {
  public dataSource!: MatTableDataSource<BasicMenuItem | MenuItem>;

  @Input({ required: true }) public menuDetails?: BasicMenuItem[] | MenuItem[];

  @Input() public readonly?: boolean;

  @Input() public displayedColumns?: string[];

  @Output() selectedIdsChange = new EventEmitter<string[]>();

  @Output() addMenuItem = new EventEmitter<boolean>();

  @Output() scheduleSelectedItems = new EventEmitter<MenuItem[]>();

  @Output()  quantity = new EventEmitter<number>();

  @Input({ required:false }) public defaultSelection?:MenuItem[];

  @Input({ required:false }) public defaultSelectedQuantity?:Quantities[];

  @Input({required:false}) public dq?:Quantities[]

  public isAllSelected: boolean = false;

  public selectedItems: { [key: string]: boolean | undefined } = {};

  public selectedIds: string[] = [];

  public seletedSchedule: MenuItem[] = [];

  public addDisable?: boolean;

  value: number = 0; // Initial value

  minValue: number = 0; // Minimum value (optional)

  maxValue: number = 10000; // Maximum value (optional)

  @Output() updatedQuantities = new EventEmitter<{ id: string; quantity: number }[]>();

  private quantities:Quantities[] = []; // Store quantities

  constructor(
    private readonly dialog: MatDialog,
    private readonly route: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.menuDetails);
    if (!this.displayedColumns) {
      this.displayedColumns = [
        'skuId',
        'name',
        'primaryIngredient',
        'category',
        'subCategory',
        'status',
      ];
    } else {
      this.addDisable = true;
    }
  }

  private defaultMenu() {
    this.dataSource.data.forEach((element:any) => {
      const isSelected  = this.defaultSelection?.some((menu:any)=>menu.id === element.id);
      if (isSelected) {
        this.selectedItems[element.id] = isSelected;
        this.selectedIds.push(element.id);
        this.seletedSchedule.push(element);
      }
    });
    this.scheduleSelectedItems.emit(this.seletedSchedule);
    this.selectedIdsChange.emit(this.selectedIds);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.menuDetails) {
    
      if ( changes.menuDetails.previousValue !== changes.menuDetails.currentValue) {
        this.dataSource = new MatTableDataSource(changes.menuDetails.currentValue);
      }
    }
    if (changes.defaultSelection) {
      this.defaultMenu();
      this.defaultQuantity();
    }
    if (changes.defaultSelectedQuantity) {
      this.quantities = changes.defaultSelectedQuantity.currentValue;
    }
  if(changes.dq){
    this.quantities = this.dq ? this.dq : [];
  }
    
  }
  
  public toggleSelectAll() {
    this.isAllSelected = !this.isAllSelected;
    this.dataSource.data.forEach((element) => {
      if (element.name) this.selectedItems[element.id] = this.isAllSelected;
      if (this.isAllSelected && !this.seletedSchedule.includes(element as MenuItem)) {
        this.seletedSchedule.push(element as MenuItem);
      }
    
    });
    if (!this.isAllSelected) {
      this.seletedSchedule = [];
    }
    this.selectedIds = this.isAllSelected
      ? this.dataSource.data
        .map((element) => element.id)
        .filter((id): id is string => id !== undefined)
      : [];
    if (!this.isAllSelected) {
      this.selectedIds = [];
      this.seletedSchedule = [];
    }
    this.selectedIdsChange.emit(this.selectedIds);
    this.scheduleSelectedItems.emit(this.seletedSchedule);
  }

  public onCheckboxChange(element: MenuItem) {
    if (this.selectedIds.includes(element.id)) {
      this.selectedIds = this.selectedIds.filter(id => id !== element.id);
      this.quantities = this.quantities.filter(q => q.id !== element?.id);
    } else {
      this.selectedIds.push(element.id);
    }
    if (this.seletedSchedule.includes(element)) {
      this.seletedSchedule = this.seletedSchedule.filter(el => el !== element);
    } else {
      this.seletedSchedule.push(element);
    }
   
    const key = element.id;

    this.selectedItems[key] = !this.selectedItems[key];

    this.isAllSelected = this.dataSource.data.every(
      (el) => this.selectedItems[el.id],
    );
    this.scheduleSelectedItems.emit(this.seletedSchedule);
    this.selectedIdsChange.emit(this.selectedIds);
    this.emitQuantities();
  }

  createMenuItem() {
    const dialog = this.dialog.open(CreateMenuItemComponent, {
      disableClose: true,
      width: '500px',
      panelClass: ['custommodal', 'registerDevicePopup'],
    });

    this.dataSubs.push(
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.addMenuItem.emit(true);
        } else {
          this.addMenuItem.emit(false);
        }
      }),
    );
  }

  increment(id: string) {
    const item = this.quantities.find(q => q.id === id);
    if (item) {
      item.quantity += 1; 
    } else {
      this.quantities.push({ id, quantity: 1 }); 
    }
    this.emitQuantities(); 
  }

  private defaultQuantity() {
    this.defaultSelection?.forEach((element: MenuItem) => {
      if (element.id && element.quantity) {
      
        this.quantities.push({ id: element.id, quantity: element.quantity });
      }
    });
  
    this.defaultSelectedQuantity?.forEach((element: Quantities) => {
      if (element.id && element.quantity) {
        const existingItem = this.quantities.find(qty => qty.id === element.id);
        if (!existingItem) {
          this.quantities.push({ id: element.id, quantity: element.quantity });
        }
      }
    });
    this.updatedQuantities.emit(this.quantities);
  }
  

 
  decrement(id: string) {
    const item = this.quantities.find(q => q.id === id);
    if (item) {
      item.quantity -= 1; 
      if (item.quantity <= 0) {
        this.quantities = this.quantities.filter(q => q.id !== id);
      }
    }
    this.emitQuantities();
  }

  getQuantity(id: string): number {
    const item = this.quantities.find(q => q.id === id);
    return item ? item.quantity : 0; 
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const inputQuantity = Number(event.key);
    if (Number.isNaN(inputQuantity)) {
      event.preventDefault();
    }
    
  }

  public onQuantityChange(id:string, quantity: string) {
    const item = this.quantities.find(q => q.id === id);
    if (quantity !== '') {
      if (item) {
        item.quantity = Number(quantity);
        if (item.quantity <= 0) {
          this.quantities = this.quantities.filter(q => q.id !== id);
        }
      } else {
        this.quantities.push({ id:id, quantity: Number(quantity) }); 
      } 
    } else {
      this.quantities = this.quantities.filter(q => q.id !== id);
    }
    this.emitQuantities(); 
  }

  private emitQuantities() {
    this.updatedQuantities.emit(this.quantities);
  }

  public onRowClick(event: Event, id: string): void {
    if (this.addDisable) {
      event.stopPropagation();
      return;
    }
    this.navigateToDetailsView(id);
  }

  public navigateToDetailsView(id: string) {
    this.route.navigate(['menu-items', id]);
  }

}
