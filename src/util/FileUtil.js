const AWS = require("aws-sdk");
const DateUtil = require("../util/DateUtil");
const JSZip = require("jszip");

AWS.config.update({
  accessKeyId: "AKIAQAFUBEM2K6HFKQHM", //process.env.AWS_ACCESS_KEY,
  secretAccessKey: "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" //process.env.AWS_SECRET_ACCESS_KEY
});

const getFileName = providerId => {
  let fileName = `${providerId}_${DateUtil.getDateToFileName()}.txt`;
  return fileName;
};

const getFileNameZip = fileName => {
  let fileNameZip = fileName.split(".")[0] + ".zip";
  return fileNameZip;
};

const getContentFromFileZipped = file => {
  return new Promise(resolve => {
    var zipFile = new JSZip();
    zipFile.loadAsync(file).then(
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
    let fileRead;
    fileRead = new FileReader();
    fileRead.onloadend = () => {
      const content = fileRead.result;
      resolve(content);
    };
    fileRead.readAsText(file);
  });
};

const uploadFileToAWS = (fileName, data) => {
  return new Promise(resolve => {
    let zip = new JSZip();
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
          Bucket: "providerbackup", //process.env.AWS_S3_NAME,
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
