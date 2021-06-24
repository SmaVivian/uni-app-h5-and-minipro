/**! __CODEPLACEHOLDER_START__ */ /*[PositionForHostEntryCodeBegin]*/ /**! __CODEPLACEHOLDER_END__ */
if(!self.__appxInited) {
self.__appxInited = 1;


require('./config$');
require('./importScripts$');

      function getUserAgentInPlatformWeb() {
        return typeof navigator !== 'undefined' ? navigator.swuserAgent || navigator.userAgent || '' : '';
      }
      if(getUserAgentInPlatformWeb() && (getUserAgentInPlatformWeb().indexOf('LyraVM') > 0 || getUserAgentInPlatformWeb().indexOf('AlipayIDE') > 0) ) {
        var AFAppX = self.AFAppX.getAppContext ? self.AFAppX.getAppContext().AFAppX : self.AFAppX;
      } else {
        importScripts('https://appx/af-appx.worker.min.js');
        var AFAppX = self.AFAppX;
      }
      self.getCurrentPages = AFAppX.getCurrentPages;
      self.getApp = AFAppX.getApp;
      self.Page = AFAppX.Page;
      self.App = AFAppX.App;
      self.my = AFAppX.bridge || AFAppX.abridge;
      self.abridge = self.my;
      self.Component = AFAppX.WorkerComponent || function(){};
      self.$global = AFAppX.$global;
      self.requirePlugin = AFAppX.requirePlugin;
    

if(AFAppX.registerApp) {
  AFAppX.registerApp({
    appJSON: appXAppJson,
  });
}



function success() {
require('../../app');
require('../../uview-ui/components/u-icon/u-icon?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../uview-ui/components/u-search/u-search?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../uview-ui/components/u-image/u-image?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../uview-ui/components/u-tag/u-tag?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../uview-ui/components/u-line/u-line?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../uview-ui/components/u-loading/u-loading?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../uview-ui/components/u-loadmore/u-loadmore?hash=f0bfa7b8e8c93907510ed00ffcb8fc101b8b8930');
require('../../uview-ui/components/u-parse/libs/trees?hash=e8f483ad5a871b6c5d4bc3e44952d9f4da69faaf');
require('../../uview-ui/components/u-parse/u-parse?hash=e8f483ad5a871b6c5d4bc3e44952d9f4da69faaf');
require('../../uview-ui/components/u-button/u-button?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../uview-ui/components/u-mask/u-mask?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../uview-ui/components/u-popup/u-popup?hash=93778e59e9c142492cad72fd41ad6441b3624d39');
require('../../uview-ui/components/u-checkbox-group/u-checkbox-group?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../uview-ui/components/u-checkbox/u-checkbox?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../uview-ui/components/u-navbar/u-navbar?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../uview-ui/components/u-avatar/u-avatar?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../uview-ui/components/u-form/u-form?hash=ec7c5687c7f2ffa836caf3a93e877914426baff6');
require('../../uview-ui/components/u-form-item/u-form-item?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../uview-ui/components/u-input/u-input?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../uview-ui/components/u-select/u-select?hash=3c9f7133bdf7d16fec3ef0aaab0556f4e1889c01');
require('../../uview-ui/components/u-empty/u-empty?hash=cf3366fbb6f8f5d580f2256f66f7bbc6e70278a2');
require('../../pages/index/index?hash=c566f7f073709d945300265a4f018233cdb7a44a');
require('../../pages/order/order-pre?hash=fe55c38a8944857d0bc245ab02ff98e66e680d1b');
require('../../pages/order/order?hash=13983d1422a0e4409fc9ae851569b8c3f56d9fd7');
require('../../pages/my/my?hash=fdc4e75546b3c89f714f151ea5b8fec40bbd9212');
require('../../pages/my/person-list?hash=3a918dd09303c27b6c55c97600cafb73df234270');
require('../../pages/my/person-add?hash=43a41f0804c6374ecf670f3abfca5bb66b9bd2da');
require('../../pages/my/my-order?hash=d4aa4e5f40ceb6f58855716282c27be291cf94f7');
require('../../pages/order/order-res?hash=efa71051caeb34cb9edc2c4f81b1d62f8e4b3d26');
require('../../moduleA/query/query?hash=9f1f5dce1569f62f3f35de8b2fe5cb1ee12f74b3');
require('../../moduleA/query/search?hash=cf481fe45a82bb1bc85d77fda6f4a74aa57e44e4');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
}