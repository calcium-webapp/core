CREATE TABLE "sso" (
    "id" bigserial PRIMARY KEY,
    "username" varchar NOT NULL,
    "providerId" bigserial NOT NULL REFERENCES ssoprovider (id),
    "accessToken" varchar NOT NULL,
    "expirationDate" TIMESTAMP NOT NULL DEFAULT (NOW() + INTERVAL '1 day'),
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);