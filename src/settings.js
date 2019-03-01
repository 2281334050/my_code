let config = {
    upload:{
      allowType:["image/png", "image/jpeg", "image/gif","image/jpg"],//允许上传的图片类型
      maxImageSize:4194304,//图片上传最大4M,
    },
    qiniu:{
      domain:'http://pno1k5vfj.bkt.clouddn.com/',
    }
};
export default config;