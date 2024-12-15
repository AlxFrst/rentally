-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Property_sciId_fkey" FOREIGN KEY ("sciId") REFERENCES "SCI" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Property" ("address", "buildYear", "createdAt", "floor", "hasBasement", "hasElevator", "hasParking", "heatingType", "id", "rooms", "sciId", "status", "surface", "type", "updatedAt", "userId") SELECT "address", "buildYear", "createdAt", "floor", "hasBasement", "hasElevator", "hasParking", "heatingType", "id", "rooms", "sciId", "status", "surface", "type", "updatedAt", "userId" FROM "Property";
DROP TABLE "Property";
ALTER TABLE "new_Property" RENAME TO "Property";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
