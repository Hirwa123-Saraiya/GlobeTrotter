/*
  Warnings:

  - You are about to drop the column `city_id` on the `trip_stops` table. All the data in the column will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `city_name` to the `trip_stops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "trip_stops" DROP CONSTRAINT "trip_stops_city_id_fkey";

-- AlterTable
ALTER TABLE "trip_stops" DROP COLUMN "city_id",
ADD COLUMN     "city_name" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "cities";
