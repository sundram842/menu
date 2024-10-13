import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SharedModule } from 'src/app/shared/shared.module';
import { FlatTreeControl } from '@angular/cdk/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [], // Initially set as an empty array
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-tree-s',
  standalone: true,
  imports: [CommonModule, SharedModule, MatTreeModule, MatButtonModule, MatIconModule],
  templateUrl: './tree-s.component.html',
  styleUrls: ['./tree-s.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSComponent implements OnInit {
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private cdr: ChangeDetectorRef) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    // Add children after 5 seconds
    setTimeout(() => {
      this.addChildrenToFirstNode();
    }, 5000);
  }

  // Method to add children to the first node
  addChildrenToFirstNode() {
    const firstNode = this.dataSource.data[0]; // Get the first node (Fruit)
    
    if (!firstNode.children?.length) {
      // Create new data structure
      const newData = [
        {
          ...firstNode,
          children: [
            { name: 'Apple' },
            { name: 'Banana' },
            { name: 'Grapes' },
          ],
        },
        ...this.dataSource.data.slice(1),
      ];

      // Assign the new data to the dataSource
      this.dataSource.data = newData;
      const flatNode = this.treeControl.dataNodes.find(node => node.name === firstNode.name);
    
      // Check if the flat node is expandable and expand it
      if (flatNode && this.treeControl.isExpandable(flatNode)) {
        this.treeControl.expand(flatNode); // Expand the first node
      }
    }
  }

  hasChild = (_: number, node: ExampleFlatNode) => true;
}
