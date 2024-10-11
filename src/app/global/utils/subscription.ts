import { Subscription } from 'rxjs';

export class SubscriptionBase {
  protected dataSubs: Subscription[];

  constructor() {
    this.dataSubs = [];
  }

  protected clearDataSubs() {
    this.dataSubs.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.dataSubs.splice(0);
  }
}
