import Janus from './janus';

class JanusHelper {
  constructor(config) {
    this.config = config;
    this.plugins = {}; // would be added later ...
    this.initPromise = null;
  }

  init = () => {
    if (this.initPromise) {
      return this.initPromise;
    }
    return this.initPromise = new Promise((resolve, reject) => { // eslint-disable-line no-return-assign
      Janus.init({
        debug: this.config.debug || false,
        callback: () => {
          console.log('==== init success ====');
          this.janus = new Janus(
            {
              server: this.config.server || 'ws://localhost:8188/',
              success: () => {
                const PgIns = Promise.all(
                  Object.keys(this.plugins).map(
                    pluginName => Promise.resolve(this.plugins[pluginName].start())
                  )
                );
                PgIns.then(resolve).catch(reject);
              },
              error: (error) => {
                reject(error);
                this.janus = null;
                this.initPromise = null;
              },
            }
          );
        },
      });
    });
  }

  addPlugin = (PlugIn, config, callbacks) => {
    this.plugins[PlugIn.$name] = new PlugIn(this, config, callbacks);
  }

  destroy = () => {
    Object.keys(this.plugins).map(
      pluginName => Promise.resolve(this.plugins[pluginName].destroy())
    );
    this.janus.destroy();
  }
}

export default JanusHelper;
