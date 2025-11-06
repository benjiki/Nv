-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Accountholder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "balance" DECIMAL NOT NULL DEFAULT 0.0,
    "accountNumber" TEXT NOT NULL DEFAULT '10000',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Accountholder" ("balance", "createdAt", "id", "name", "updatedAt") SELECT "balance", "createdAt", "id", "name", "updatedAt" FROM "Accountholder";
DROP TABLE "Accountholder";
ALTER TABLE "new_Accountholder" RENAME TO "Accountholder";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
