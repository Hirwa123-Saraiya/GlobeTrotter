-- CreateTable: CityCatalog
CREATE TABLE "cities_catalog" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "region" VARCHAR(100),
    "cover_image" TEXT,
    "description" TEXT,
    "cost_index" VARCHAR(20) DEFAULT 'Moderate',
    "popularity" INTEGER NOT NULL DEFAULT 90,
    "avg_daily_cost" DECIMAL(10,2) NOT NULL DEFAULT 3500.00,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cities_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ActivityCatalog
CREATE TABLE "activities_catalog" (
    "id" SERIAL NOT NULL,
    "city_catalog_id" INTEGER NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "estimated_cost" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "duration" VARCHAR(50),
    "cover_image" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_catalog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "activities_catalog" ADD CONSTRAINT "activities_catalog_city_catalog_id_fkey" 
FOREIGN KEY ("city_catalog_id") REFERENCES "cities_catalog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
