import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { URL_CONSTANTS_TOKEN, urlConstants } from 'src/app/constants/urlConstants';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuItemService } from '../../services/menu-item.service';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { MenuItem } from '../../models/menu-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CreateMenuItemComponent } from '../create-menu-item/create-menu-item.component';

@Component({
  selector: 'app-menu-view',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers:[
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './menu-view.component.html',
  styleUrl: './menu-view.component.scss',
})
export class MenuViewComponent extends SubscriptionBase {
  public menuDetails?: MenuItem;

  public loader?: boolean;

  @Input({ required : true }) public menuId?: string;

  @Output() detailsById = new EventEmitter<MenuItem>();

  constructor(private readonly menuService: MenuItemService,
    private readonly snackbar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.menuId) {
      this.getMenuItems(this.menuId);
    }
  }

  public getMenuItems(id: string) {
    this.loader = true;
    this.dataSubs.push(this.menuService.getMenuItemsById(id).subscribe({
      next:(res:any)=>{
        if (res.success && res.data) {
          this.menuDetails = res.data;
          this.detailsById.emit(this.menuDetails);
        } else {
          this.snackBarFunction(
            'Oops somthing went wrong....!',
            'ok',
          );
        }
        this.loader = false;
      }, error(e) {
        console.log(e);
        
      },
    }));
  }

  updateMenuItem() {
    const dialog = this.dialog.open(CreateMenuItemComponent, {
      disableClose: true,
      width: '500px',
      panelClass: ['custommodal', 'registerDevicePopup'],
      data: this.menuId,
    });

    this.dataSubs.push(
      dialog.afterClosed().subscribe((result) => {
        if (result && this.menuId) {
          this.getMenuItems(this.menuId);
        }
      }),
    );
  }

  private snackBarFunction(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 5000,
    });
  }

}
