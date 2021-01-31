import { RestService } from './RestService';

export interface StoreChangeListener<D> {
  (store: D): void;
}

export abstract class StoreService<D = any> extends RestService {
  public store: D;

  changeListeners: StoreChangeListener<D>[] = [];

  addChangeListener(fun: StoreChangeListener<D>) {
    this.changeListeners.push(fun);
  }

  removeChangeListener(fun: StoreChangeListener<D>) {
    const len = this.changeListeners.length;
    for (let i = 0; i < len; i++) {
      if (this.changeListeners[i] === fun) {
        this.changeListeners.splice(i, 1);
        return;
      }
    }
  }

  fireStoreChange() {
    //必须用一个新实例，否则用===判断无法获知更新，如react.setState hooks
    const newStore = { ...this.store };
    this.changeListeners.forEach((listener) => listener(newStore));
  }
}
