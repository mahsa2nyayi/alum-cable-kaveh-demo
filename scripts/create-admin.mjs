// Create (or reset the password of) an admin user.
//
//   Interactive:      npm run admin:create
//   Non-interactive:  ADMIN_EMAIL=me@corp.com ADMIN_PASSWORD='...' npm run admin:create
//
// The password is hidden while typing and never echoed or logged.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import readline from "node:readline";

const prisma = new PrismaClient();
const MIN_LEN = 12;

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (str) => {
        if (str.includes(question)) rl.output.write(question);
        // swallow typed characters
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer);
    });
  });
}

function validatePassword(pw) {
  if (pw.length < MIN_LEN) return `Password must be at least ${MIN_LEN} characters.`;
  if (!/[a-z]/.test(pw) || !/[A-Z]/.test(pw) || !/\d/.test(pw))
    return "Password must contain lowercase, uppercase and a digit.";
  return null;
}

async function main() {
  const interactive = !(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
  if (interactive) console.log("\nCreate admin user\n");

  const email = (process.env.ADMIN_EMAIL ?? (await ask("E-mail: "))).trim().toLowerCase();
  let password = process.env.ADMIN_PASSWORD ?? (await ask(`Password (min ${MIN_LEN} chars): `, { hidden: true }));

  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Invalid e-mail address.");
  const problem = validatePassword(password);
  if (problem) throw new Error(problem);

  if (interactive) {
    const again = await ask("Repeat password: ", { hidden: true });
    if (again !== password) throw new Error("Passwords do not match.");
  }

  const hash = await bcrypt.hash(password, 12);
  password = ""; // drop the plain text as early as possible

  // upsert => re-running resets the password (which also revokes old sessions)
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { password: hash },
    create: { email, password: hash },
  });

  console.log(`\nAdmin ready: ${admin.email}`);
  console.log("Sign in at /admin/login\n");
}

main()
  .catch((e) => {
    console.error("\nError:", e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
