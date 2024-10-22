import jwt, { JwtPayload } from "jsonwebtoken";
import bcryptjs from "bcryptjs";

export async function generateJWT(id: number, role: string) {
  const salt = bcryptjs.genSaltSync(10);
  const promise = new Promise((resolve, reject) => {
    console.log({ role: role });
    role = bcryptjs.hashSync(role, salt);
    console.log({ hashed: role });
    const payload = { id, role };
    jwt.sign(
      payload,
      process.env.SECRETORPRIVATEKEY!,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err) {
          reject("no se genero el JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
  return promise;
}
export function validateJWT(token: string): string | JwtPayload {
  const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY!);
  return payload;
}
