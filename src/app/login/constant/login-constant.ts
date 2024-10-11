export enum LoginError {
  ERROR_INVALID_PIN = 'error_invalid_pin',
}

export class LoginPostBody {
  pin!: string;

  static BindForm(body: any): LoginPostBody {
    const postBody = new LoginPostBody();
    postBody.pin = body?.pin;
    return postBody;
  }
}
