export interface Adapter<T> {
  adapt(data: any): T;
}
