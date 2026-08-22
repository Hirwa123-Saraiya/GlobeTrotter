-- CreateTable: ItineraryActivities
CREATE TABLE "itinerary_activities" (
    "id" SERIAL NOT NULL,
    "trip_stop_id" INTEGER NOT NULL,
    "custom_title" VARCHAR(150) NOT NULL,
    "category" VARCHAR(50) DEFAULT 'Sightseeing',
    "scheduled_date" DATE NOT NULL,
    "start_time" VARCHAR(10),
    "end_time" VARCHAR(10),
    "custom_cost" DECIMAL(10,2) DEFAULT 0.00,
    "notes" TEXT,
    "sequence_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itinerary_activities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "itinerary_activities" ADD CONSTRAINT "itinerary_activities_trip_stop_id_fkey" FOREIGN KEY ("trip_stop_id") REFERENCES "trip_stops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
