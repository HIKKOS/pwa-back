import { Ticket } from "../@types/ticket";
import prisma from "../services/prisma_client";
import { Entities } from "./enums";

export const existEntity = async (
  id: number,
  type: Entities
): Promise<boolean> => {
  switch (type) {
    case Entities.categories:
      return await existCategory(id);
    case Entities.users:
      return await existUserId(id);
    case Entities.products:
      return await existProduct(id);
    default:
      throw new Error(`el tipo ${type} no es valido`);
  }
};
/**checks if the email exist */
export const existEmail = async (email: string): Promise<boolean> => {
  const user = await prisma.users.findFirst({
    where: {
      email: email,
      AND: {
        status: true,
      },
    },
  });
  if (user) {
    throw new Error(`el correo ${email} ya esta registrado`);
  }
  return true;
};

/**checks if the phone number exist */
export const existPhone = async (phone: string): Promise<boolean> => {
  console.log(phone);
  const user = await prisma.users.findFirst({
    where: {
      phone: phone,
      AND: {
        status: true,
      },
    },
  });
  if (user) {
    console.log("si existe");
    throw new Error(`el número telefónico ${phone} ya esta registrado`);
  }
  console.log("noexiste");
  return true;
};
/**checks if the user exist by finding its id  */
export const existUserId = async (id: number): Promise<boolean> => {
  if (isNaN(id)) {
    throw new Error(`el id debe ser numericossss`);
  }
  const user = await prisma.users.findFirst({
    where: {
      id: Number(id),
      AND: {
        status: true,
      },
    },
  });
  if (!user) {
    throw new Error(`no existe el usuario con id: ${id}`);
  }
  return true;
};
export const existRoleId = async (id: number): Promise<boolean> => {
  if (isNaN(id)) {
    throw new Error(`el id debe ser numericossss`);
  }
  const role = await prisma.roles.findFirst({
    where: {
      id: Number(id),
      AND: {
        status: true,
      },
    },
  });
  if (!role) {
    throw new Error(`no existe el role con id: ${id}`);
  }
  return true;
};
export const existUserEmail = async (email: string): Promise<boolean> => {
  const user = await prisma.users.findFirst({
    where: {
      email,
      AND: {
        status: true,
      },
    },
  });
  if (user) {
    return true;
  }
  throw new Error(`no existe el correo: ${email}`);
};
export const existCategory = async (id: number): Promise<boolean> => {
  if (isNaN(id)) {
    throw new Error(`el id debe ser numerico`);
  }
  const category = await prisma.categories.findFirst({
    where: {
      id: Number(id),
      AND: {
        status: true,
      },
    },
  });
  if (!category) {
    throw new Error(`no existe la categoría con id: ${id}`);
  }
  return true;
};

export const existProduct = async (id: number): Promise<boolean> => {
  if (isNaN(id)) {
    throw new Error(`el id debe ser numerico`);
  }

  const product = await prisma.products.findFirst({
    where: {
      id: Number(id),
      AND: {
        status: true,
      },
    },
  });

  if (!product) {
    throw new Error(`No existe el producto con ID: ${id}`);
  }
  return true;
};

export const existTicket = async (id: number): Promise<boolean> => {
  if (isNaN(id)) {
    throw new Error(`el id debe ser numerico`);
  }

  const ticket: Ticket | null = await prisma.tickets.findFirst({
    where: {
      folio: Number(id),
      AND: {
        status: true,
      },
    },
  });

  if (!ticket) {
    throw new Error(`El ticket con folio ${id}`);
  }

  return true;
};

export const existImage = async (photoName: string): Promise<boolean> => {
  const result = await prisma.imagesPaths.findFirst({
    where: {
      path: photoName,
    },
  });
  if (!result) {
    throw new Error(`${photoName} not found`);
  }
  return true;
};
