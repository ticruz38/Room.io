import {observable, computed, autorun} from 'mobx';

class uiStore {

  @observable windowSize = [window.innerHeight, window.innerWidth];
  
  constructor() {
    window.onresize = () => {
      this.windowSize = [window.innerHeight, window.innerWidth];
    }
  }
}

export default new uiStore();