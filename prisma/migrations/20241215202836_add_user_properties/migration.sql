/*
  Warnings:

  - You are about to drop the column `ephemeralLink` on the `Inspection` table. All the data in the column will be lost.
  - You are about to drop the column `linkExpiry` on the `Inspection` table. All the data in the column will be lost.
  - You are about to drop the column `photos` on the `Inspection` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Inspection` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inspection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "notes" TEXT,
    "propertyId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inspection_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Inspection" ("createdAt", "date", "id", "notes", "propertyId", "type", "updatedAt") SELECT "createdAt", "date", "id", "notes", "propertyId", "type", "updatedAt" FROM "Inspection";
DROP TABLE "Inspection";
ALTER TABLE "new_Inspection" RENAME TO "Inspection";
CREATE TABLE "new_Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "address" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "surface" REAL NOT NULL,
    "rooms" INTEGER NOT NULL,
    "floor" INTEGER,
    "buildYear" INTEGER NOT NULL,
    "hasElevator" BOOLEAN NOT NULL DEFAULT false,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "hasBasement" BOOLEAN NOT NULL DEFAULT false,
    "heatingType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT,
    "sciId" TEXT,
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Property_sciId_fkey" FOREIGN KEY ("sciId") REFERENCES "SCI" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "buildYear", "createdAt", "floor", "hasBasement", "hasElevator", "hasParking", "heatingType", "id", "rooms", "sciId", "status", "surface", "type", "updatedAt") SELECT "address", "buildYear", "createdAt", "floor", "hasBasement", "hasElevator", "hasParking", "heatingType", "id", "rooms", "sciId", "status", "surface", "type", "updatedAt" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
