import { Storage } from "aws-amplify";

class PhotoService {
  constructor() {}

  static async put(file, uploadPath) {
    Storage.configure({ level: "private" });
    console.log("Put image called");

    // file-name, file, config options:
    return Storage.vault.put(uploadPath, file);
  }

  static async get(pathToAttachments) {
    return Storage.vault.get(pathToAttachments);
  }

  static async getImages(clientId, paths) {
    Storage.list(`${clientId}-${paths[0]}`)
      .then((result) => {
        console.log(
          `--- ATTEMPTING TO LIST IMAGES FROM ${clientId}-${paths[0]}`
        );
        console.log(result);
      })
      .catch((err) => console.log(err));

    Storage.list(`${clientId}-${paths[1]}`)
      .then((result) => {
        console.log(
          `--- ATTEMPTING TO LIST IMAGES FROM ${clientId}-${paths[0]}`
        );
        console.log(result);
      })
      .catch((err) => console.log(err));
  }
}

export default PhotoService;
