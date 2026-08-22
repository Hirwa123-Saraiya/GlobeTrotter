-- CreateTable: Cities
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "region" VARCHAR(100),
    "description" TEXT,
    "image_url" TEXT,
    "cost_index" INTEGER DEFAULT 2,
    "popularity_score" INTEGER DEFAULT 85,
    "tags" TEXT[],

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Trip Stops
CREATE TABLE "trip_stops" (
    "id" SERIAL NOT NULL,
    "trip_id" INTEGER NOT NULL,
    "city_id" INTEGER NOT NULL,
    "arrival_date" DATE NOT NULL,
    "departure_date" DATE NOT NULL,
    "sequence_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trip_stops_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trip_stops" ADD CONSTRAINT "trip_stops_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
