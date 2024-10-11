export class BusinessCenterPostBody {
  bcId!: string;

  static BindForm(body: any): BusinessCenterPostBody {
    const postBody = new BusinessCenterPostBody();
    postBody.bcId = body?.location;
    return postBody;
  }
}
