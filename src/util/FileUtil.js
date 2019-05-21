const AWS = require("aws-sdk");
const DateUtil = require("../util/DateUtil");
const JSZip = require("jszip");

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const getFileName = providerId => {
  return `${providerId}_${DateUtil.getDateToFileName()}.txt`;  
};

const getFileNameZip = fileName => {
  return fileName.split(".")[0] + ".zip";
  };

const getContentFromFileZipped = file => {
  return new Promise(resolve => {
      new JSZip().loadAsync(file).then(
      zip => {
        zip
          .file(Object.keys(zip.files)[0])
          .async("string")
          .then(content => {
            resolve(content);
          });
      },
      error => {
        console.log(error);
        resolve(null);
      }
    );
  });
};

const getExtensionFromFile = fileName => {
  return fileName.split(".")[1];
};

const getContentFromFile = file => {
  return new Promise(resolve => {
    const fileRead = new FileReader();
    fileRead.onloadend = () => {
      resolve(fileRead.result);
    };
    fileRead.readAsText(file);
  });
};

const uploadFileToAWS = (fileName, data) => {
  return new Promise(resolve => {
    const zip = new JSZip();
    zip.file(fileName, data);
    zip
      .generateAsync({
        type: "nodebuffer",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9
        }
      })
      .then(base64 => {
        const params = {
          Bucket: process.env.REACT_APP_AWS_S3_NAME,
          Key: getFileNameZip(fileName),
          Body: base64
        };
        const s3 = new AWS.S3();
        s3.upload(params, function(error, base64) {
          if (error != null) {
            console.log(error);
            resolve(error);
          } else {
            resolve("Arquivo atualizado com sucesso");
          }
        });
      });
  });
};

module.exports = {
  uploadFileToAWS: uploadFileToAWS,
  getFileName: getFileName,
  getContentFromFile: getContentFromFile,
  getContentFromFileZipped: getContentFromFileZipped,
  getExtensionFromFile: getExtensionFromFile
};
