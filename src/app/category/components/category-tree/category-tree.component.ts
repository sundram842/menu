// Import necessary Angular modules and RxJS operators
import { CommonModule } from '@angular/common';
import { Component, Injectable } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  CollectionViewer,
  SelectionChange,
  DataSource,
} from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTreeModule } from '@angular/material/tree';
import { HttpClient } from '@angular/common/http';
import { CategoryService } from '../../services/category.service';
import { DevicesService } from 'src/app/devices/services/devices.service';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';
import { CategoryTree } from '../../models/category.model';

export const cn = [
  {
    id: 7,
    name: 'main2',
    level: 1,
  },
];
export const pn = [
  {
    id: '4f40b3d5-43d4-4d4b-bd88-5a9385a6052f',
    name: 'main8',
    level: 0,
    businessCenter: '392c8817-af7f-4e3e-aa18-639a63415051',
  },
  {
    id: '60fade30-8860-440c-9544-0fc2c58f7d9a',
    name: 'main',
    level: 0,
    businessCenter: '392c8817-af7f-4e3e-aa18-639a63415051',
  },
];

// Define a flat node with expandable and level information
export class DynamicFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public isLoading = false,
    public id?: string, // Add id to map the API data
  ) {}
}

// export class CategoryTree {
//   name!: string;
//   level = 1;
//   isLoading = false;
//   id?: string;
//   businessCenter?: string;
// }
// DataSource that connects the tree control with the data
export class DynamicDataSource implements DataSource<CategoryTree> {
  dataChange = new BehaviorSubject<CategoryTree[]>([]);

  get data(): CategoryTree[] {
    return this.dataChange.value;
  }

  set data(value: CategoryTree[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<CategoryTree>,
    private _database: CategoryService,
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<CategoryTree[]> {
    this._treeControl.expansionModel.changed.subscribe((change) => {
      if (
        (change as SelectionChange<CategoryTree>).added ||
        (change as SelectionChange<CategoryTree>).removed
      ) {
        this.handleTreeControl(change as SelectionChange<CategoryTree>);
      }
    });
    return merge(collectionViewer.viewChange, this.dataChange).pipe(
      map(() => this.data),
    );
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<CategoryTree>) {
    if (change.added) {
      change.added.forEach((node) => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed
        .slice()
        .reverse()
        .forEach((node) => this.toggleNode(node, false));
    }
  }

  /** Toggle the node to either expand or collapse */
  toggleNode(node: CategoryTree, expand: boolean) {
    const index = this.data.indexOf(node);
    if (index < 0) return;

    node.isLoading = true;

    if (expand) {
      // Fetch children when expanding a node
      this._database.getSubCategories(node.id!).subscribe((children) => {
        const nodes = children.data ? children.data : [];
        this.data.splice(index + 1, 0, ...nodes);
        this.dataChange.next(this.data);
        node.isLoading = false;
      });
    } else {
      // Remove children when collapsing a node
      let count = 0;
      for (
        let i = index + 1;
        i < this.data.length && this.data[i].level > node.level;
        i++, count++
      ) {}
      this.data.splice(index + 1, count);
      this.dataChange.next(this.data);
      node.isLoading = false;
    }
  }
}

// The component that renders the tree
@Component({
  selector: 'app-category-tree',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    MatProgressBarModule,
  ],
  templateUrl: './category-tree.component.html',
  styleUrls: ['./category-tree.component.scss'],
})
export class CategoryTreeComponent {
  treeControl: FlatTreeControl<CategoryTree>;
  dataSource: DynamicDataSource;

  constructor(private database: CategoryService) {
    this.treeControl = new FlatTreeControl<CategoryTree>(
      this.getLevel,
      this.isExpandable,
    );
    this.dataSource = new DynamicDataSource(this.treeControl, this.database);

    // Load initial data from the API
    this.database.getCategories().subscribe(data => {
      this.dataSource.data = data.data ? data.data : [];
    });
    // this.dataSource.data = [
    //   { name: 'sundram', level: 0, isLoading: false, id: 'hdf' },
    // ];

    // this.dataSource.data = pn.map((item:any)=> new CategoryTree(item.name, item.level, true, false, item.id))

    // this.dataSource.data = []
  }

  getLevel = (node: CategoryTree) => node.level;
  isExpandable = (node: CategoryTree) => node.level === 0;
  hasChild = (_: number, _nodeData: CategoryTree) => _nodeData.level === 0;
}
