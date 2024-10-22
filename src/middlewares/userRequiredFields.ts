import { check } from "express-validator";

/** Fields that are required for create
 *  a new user
 *  [ firstName, lastName, phone, email, password ]*/
const userRequiredFields = [
  check("firstName", "no debe ser vacio").notEmpty(),
  check("lastName", "no debe ser vacio").notEmpty(),
  check("phone", "debe ser de almenos 10 digitos y numerico")
    .isLength({ min: 10 })
    .isNumeric(),
  check("email", "No tiene el formato de un correo").isEmail(),
  check("userPassword", "deben ser minimo 8 caracteres").isLength({ min: 8 }),
];
export default userRequiredFields;
