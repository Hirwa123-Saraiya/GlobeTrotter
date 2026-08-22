-- CreateTable: Initial Trips Migration
CREATE TABLE "trips" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL DEFAULT 1,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "cover_image" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "total_budget" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "vibe" VARCHAR(50) DEFAULT 'Balanced',
    "status" VARCHAR(20) DEFAULT 'planning',
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "share_token" VARCHAR(64),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "trips_share_token_key" ON "trips"("share_token");
