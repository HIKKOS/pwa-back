import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import MulterHandler from "../services/multer";
import { dirname } from "path";
import prisma from "../services/prisma_client";

export const createPhoto = async (
  req: Request,
  res: Response
): Promise<void> => {
  const baseUrlSplitted = req.path.split("/");

  const destinationPath = baseUrlSplitted[baseUrlSplitted.length - 2];
  const productUpload = MulterHandler.single(
    "product-image",
    destinationPath,
    Number(req.params.id)
  );
  productUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "invalid file" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "no file" });
    }
    return res.json({ message: "Photo created" });
  });
};
export const getPhoto = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  // return res.json({ id: Number(req.params.id), name: req.params.itemName });
  try {
    const id = req.params.id;
    const itemName = req.params.itemName;
    const photoName = req.params.photoName;
    const appDir: string | undefined = dirname(require?.main!.filename);
    const imagePath = path.join(appDir, "uploads", itemName, id, photoName);
    res.sendFile(imagePath, (err) => {
      if (res.headersSent) return;
      if (err) {
        return res.status(404).json({ error: "not found" });
      } else {
        return res.status(200).json({ message: "ok" });
      }
    });
  } catch (error) {
    return res.status(404).json({ error: "not found" });
  }
};
export const deletePhoto = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  const { photoName, productId, itemName } = req.params;
  const appDir: string | undefined = dirname(require?.main!.filename);
  const imagePath = path.join(
    appDir,
    "uploads",
    itemName,
    productId,
    photoName
  );
  console.log(`${imagePath}`);
  if (fs.existsSync(`${imagePath}`)) {
    fs.unlinkSync(`${imagePath}`);
  } else {
    return res.json({ message: "no existe" });
  }
  await prisma.imagesPaths.updateMany({
    where: {
      path: photoName,
    },
    data: {
      status: false,
    },
  });

  return res.json({ message: "Photo deleted" });
};
