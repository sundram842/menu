import { FormControl } from '@angular/forms';
import { Adapter } from 'src/app/global/utils/adapter';

export class UserFormDetails {
  username?: FormControl<string>;

  password?: FormControl<string>;

  pin!: FormControl<string>;
}

export class Login {
  userId!: string;

  businessCenterId!: string;

  role!: string;

  roleId!: string;

  partnerId!: string;

  rtk!: string;

  atk!: string;

  lastName!: string;

  firstName!: string;
}

export class LoginAdapter implements Adapter<Login> {
  adapt(data: any): Login {
    const loginObj = new Login();
    try {
      loginObj.atk = data?.tokens?.access?.token;
      loginObj.rtk = data?.tokens?.refresh?.token;
      loginObj.userId = data?.id;
      loginObj.firstName = data?.firstName;
      loginObj.lastName = data?.lastName;
      loginObj.role = data?.role?.name;
      loginObj.roleId = data?.role?.id;
      loginObj.businessCenterId = data?.bcId;
      loginObj.partnerId = data?.partnerId;
    } catch (error) {
      console.log(error);
    }
    return loginObj;
  }
}
