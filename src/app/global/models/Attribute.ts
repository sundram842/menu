import { Adapter } from '../utils/adapter';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
// import { MutateUpdatedPermissionAttribute } from "src/app/roles/module-level-permissions/module-level-permissions.component";

export enum AttributeType {
  'Fields' = 1,
  'Actions' = 2,
}

export enum RolePermissionActions {
  Create = 'create',
  Edit = 'edit',
  Read = 'read',
}

const regularExpressions: { [key: number]: string } = {
  '1': '^[a-zA-Z]*$',
  '2': '^[0-9]*$',
  '3': '^[a-zA-Z0-9_]*$',
  '4': '',
  '6': '^[-a-zA-Z0-9@.+_]+$',
  '7': '^\\d+(\\.\\d{1,2})?$',
};
export class Rule {
  required!: number;

  partialRequired!: number;

  attributeType!: number;

  min!: number;

  max!: number;

  default!: number;

  data_type!: number;

  regex!: string;

  /**
   * @param rule Rule Obj
   * Data Types
    ================================
    1. Alphabets
    2. Numeric
    3. Alphanumeric
    4. Alphanumeric with Special Charecters
    5. Email
    6. Alphanumeric with Special Charecters Starting With Alphabets
    7. Price - Decimal with 4 precision
   * 
   */
  prepareValidator(rule: Rule) {
    let ruleArr = [];
    if (rule.required) {
      ruleArr.push(Validators.required);
    }
    if (rule.min > 0) {
      if (rule.data_type != 2) {
        ruleArr.push(Validators.minLength(rule.min));
      } else {
        ruleArr.push(Validators.min(rule.min));
      }
    }
    if (rule.max > 0) {
      if (rule.data_type != 2) {
        ruleArr.push(Validators.maxLength(rule.max));
      } else {
        ruleArr.push(Validators.max(rule.max));
      }
    }
    if (rule.regex != '') {
      ruleArr.push(Validators.pattern(rule.regex));
    }
    if (rule.data_type == 5) {
      ruleArr.push(Validators.email);
    }
    return ruleArr;
  }
}

@Injectable({
  providedIn: 'root',
})
export class RuleAdapter implements Adapter<Rule> {
  adapt(item: any): Rule {
    let obj = new Rule();
    if (item) {
      obj.required = item.is_required;
      obj.partialRequired = item.partial_required
        ? item.partial_required
        : null;
      obj.min = item.min;
      obj.max = item.max;
      obj.default = item.is_default;
      obj.data_type = item.data_type;
      obj.regex = regularExpressions[obj.data_type];
    }
    return obj;
  }
}

export const AttributeGroupName = {
  1: 'Fields',
  2: 'Actions',
};

export enum Action {
  CREATE = 'create',
  EDIT = 'edit',
  READ = 'read',
}

export enum AttributePermissionConstants {
  hasCreatePermission = 'hasCreatePermission',
  hasEditPermission = 'hasEditPermission',
  hasReadPermission = 'hasReadPermission',
}

export class Attribute {
  attribute!: string;

  attributeType!: number;

  Rules!: Rule;

  hasCreatePermission: boolean = false;

  hasEditPermission: boolean = false;

  hasReadPermission: boolean = false;

  hasDefaultCreatePermission: boolean = false;

  hasDefaultEditPermission: boolean = false;

  hasDefaultReadPermission: boolean = false;

  setAttributeDefaultPermissions(permissions: any): void {
    if (!permissions) return;
    if (permissions.create && Array.isArray(permissions.create)) {
      this.hasCreatePermission =
        permissions.create.indexOf(this.attribute) > -1;
      this.hasDefaultCreatePermission = this.hasCreatePermission;
    }
    if (permissions.edit && Array.isArray(permissions.edit)) {
      this.hasEditPermission = permissions.edit.indexOf(this.attribute) > -1;
      this.hasDefaultEditPermission = this.hasEditPermission;
    }
    if (permissions.read && Array.isArray(permissions.read)) {
      this.hasReadPermission = permissions.read.indexOf(this.attribute) > -1;
      this.hasDefaultReadPermission = this.hasReadPermission;
    }
  }

  updateAttributePermissions(checked: boolean, attributeAction: string) {
    if (attributeAction == RolePermissionActions.Create) {
      this.hasCreatePermission = checked;
    }
    if (this.attributeType !== AttributeType.Actions) {
      if (attributeAction == RolePermissionActions.Edit) {
        this.hasEditPermission = checked;
      }
      if (
        checked &&
        (attributeAction == RolePermissionActions.Read ||
          this.hasEditPermission ||
          this.hasCreatePermission)
      ) {
        this.hasReadPermission = checked;
      } else if (!checked && attributeAction == RolePermissionActions.Read) {
        this.hasReadPermission = checked;
      }
    }
  }

  isUpdatedAttribute(attributeAction: any) {
    if (attributeAction.action == Action.CREATE) {
      return this.hasDefaultCreatePermission !== this.hasCreatePermission;
    }
    if (this.attributeType !== AttributeType.Actions) {
      if (attributeAction.action == Action.EDIT) {
        return this.hasDefaultEditPermission !== this.hasEditPermission;
      }
      if (attributeAction.action == Action.READ) {
        return this.hasDefaultReadPermission !== this.hasReadPermission;
      }
    }
  }

  attributeDefaultPermission(actionObject: any): boolean {
    if (actionObject.action == RolePermissionActions.Create) {
      return this.hasDefaultCreatePermission;
    }
    if (actionObject.action == RolePermissionActions.Edit) {
      return this.hasDefaultEditPermission;
    }
    if (actionObject.action == RolePermissionActions.Read) {
      return this.hasDefaultReadPermission;
    }
    return true;
  }

  resetAttributePermissions(value: boolean) {
    this.hasCreatePermission = value;
    this.hasEditPermission = value;
    this.hasReadPermission = value;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AttributeAdapter implements Adapter<Attribute> {
  adapt(item: any): Attribute {
    let obj = new Attribute();
    let RuleAdptr = new RuleAdapter();
    obj.attribute = item.attribute;
    obj.attributeType = item.attribute_type ? item.attribute_type : null;
    obj.Rules = RuleAdptr.adapt(item.Rules);
    return obj;
  }
}
