-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "psnid" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userdata" (
    "userid" INTEGER NOT NULL,
    "rankscore" INTEGER NOT NULL,
    "date" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "score_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rank_score" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users.psnid_unique" ON "users"("psnid");

-- CreateIndex
CREATE UNIQUE INDEX "userdata.userid_date_unique" ON "userdata"("userid", "date");

-- AddForeignKey
ALTER TABLE "userdata" ADD FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "score_logs" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
