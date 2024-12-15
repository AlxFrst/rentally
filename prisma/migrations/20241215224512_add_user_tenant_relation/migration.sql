/*
  Warnings:

  - Added the required column `userId` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/

-- Get first admin user
CREATE TABLE IF NOT EXISTS "_temp_first_user" (
    "id" TEXT
);
INSERT INTO "_temp_first_user" ("id")
SELECT "id" FROM "User" LIMIT 1;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tenant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "previousAddress" TEXT,
    "salary" REAL NOT NULL,
    "profession" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Tenant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Tenant" ("birthDate", "createdAt", "email", "firstName", "id", "lastName", "phone", "previousAddress", "profession", "salary", "updatedAt", "userId")
SELECT "birthDate", "createdAt", "email", "firstName", "id", "lastName", "phone", "previousAddress", "profession", "salary", "updatedAt",
    (SELECT "id" FROM "_temp_first_user") as "userId"
FROM "Tenant";
DROP TABLE "Tenant";
ALTER TABLE "new_Tenant" RENAME TO "Tenant";
DROP TABLE "_temp_first_user";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
