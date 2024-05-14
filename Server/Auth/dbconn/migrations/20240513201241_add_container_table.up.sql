CREATE TABLE "container" (
    "id" bigserial PRIMARY KEY,
    "userId" bigserial NOT NULL REFERENCES "user" ("id"),
    "statusId" bigserial NOT NULL REFERENCES "containerStatus" ("id"),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
)