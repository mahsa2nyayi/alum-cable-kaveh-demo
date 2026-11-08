/** Node-runtime only (native bcrypt). Never import from middleware. */
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";

const COST = 12;

export const hashPassword = (password: string) => bcrypt.hash(password, COST);

export const verifyPassword = (password: string, hash: string) =>
  bcrypt.compare(password, hash);

/**
 * A real bcrypt hash of random data, computed once. Used to burn the same CPU
 * time when the e-mail does not exist, so response time does not reveal which
 * accounts are valid.
 */
let dummy: Promise<string> | null = null;
export const dummyHash = () =>
  (dummy ??= bcrypt.hash(randomBytes(24).toString("hex"), COST));
