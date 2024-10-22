import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default prisma;
export class PrismaConector {
  static #instance: PrismaConector;
  #prisma: PrismaClient;
  private constructor() {
    this.#prisma = new PrismaClient();
  }
  public static getInstance(): PrismaConector {
    if (!PrismaConector.#instance) {
      this.#instance = new PrismaConector();
    }
    this.#instance;
    return this.#instance;
  }
  public getPrisma(): PrismaClient {
    return this.#prisma;
  }
}
