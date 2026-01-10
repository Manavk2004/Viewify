-- AlterTable
CREATE SEQUENCE products_id_seq;
ALTER TABLE "Products" ALTER COLUMN "id" SET DEFAULT nextval('products_id_seq');
ALTER SEQUENCE products_id_seq OWNED BY "Products"."id";
