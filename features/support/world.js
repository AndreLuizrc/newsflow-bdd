const { setWorldConstructor } = require('@cucumber/cucumber');
const { NewsFlow } = require('../../src/newsflow');
class NewsFlowWorld {
  constructor() {
    this.service = new NewsFlow();
    this.edition = null;
    this.result = null;
    this.selected = ['Premium'];
  }
}
setWorldConstructor(NewsFlowWorld);
