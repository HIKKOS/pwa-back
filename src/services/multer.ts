import { Request } from "express";
import multer from "multer";
import prisma from "../services/prisma_client";
import path from "path";

export default class MulterHandler {
  static #destination = path.join("src/uploads");
  static #fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ): void => {
    const validateFields = ["png", "jpg", "jpeg", "gif"];
    if (
      !validateFields.includes(path.extname(file.originalname).split(".")[1])
    ) {
      return cb(Error("Only images are allowed"));
    }
    cb(null, true);
  };
  private constructor() {}

  private static buildFileName(file: Express.Multer.File): string {
    const datetimestamp = Date.now();
    const name =
      file.fieldname +
      "-" +
      datetimestamp +
      "." +
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    return name;
  }
  private static upload(itemId: number, folderName: string): multer.Multer {
    let fileName = "";
    const multerObj = multer({
      storage: multer.diskStorage({
        destination: path.join(
          this.#destination,
          folderName,
          itemId.toString()
        ),
        filename: async (_req, file, cb)  =>  {
          fileName = this.buildFileName(file);
          await prisma.imagesPaths.create({
            data: {
              path: fileName,
              productoId: itemId,
            },
          });
          cb(null, fileName);
        },
      }),
      fileFilter: this.#fileFilter,
    });
     
   
    return multerObj;
  }
  public static single(field: string, folderName: string, itemId: number) {
    return this.upload(itemId, folderName).single(field);
  }
}
