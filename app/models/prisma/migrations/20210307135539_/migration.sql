-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "psn_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "score_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rank_score" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users.psn_id_unique" ON "users"("psn_id");

-- CreateIndex
CREATE UNIQUE INDEX "score_logs_user_id_date_uniuqe_constraint" ON "score_logs"("user_id", "date");

-- AddForeignKey
ALTER TABLE "score_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
