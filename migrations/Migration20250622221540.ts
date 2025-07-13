import { Migration } from '@mikro-orm/migrations';

export class Migration20250622221540 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "base_entity" ("id" serial primary key, "created_at" date not null, "updated_at" date not null);`);

    this.addSql(`create table "users" ("id" serial primary key, "created_at" date not null, "updated_at" date not null, "username" varchar(255) not null, "login" varchar(255) not null, "password" varchar(255) not null);`);

    this.addSql(`create table "wifi" ("id" serial primary key, "created_at" date not null, "updated_at" date not null, "user_id" int not null, "name" varchar(255) not null, "bssid" varchar(255) not null, "distance" numeric(10,0) not null, "level" numeric(10,0) not null, "security" varchar(255) not null, "frequency" numeric(10,0) not null, "lat" numeric(10,0) not null, "lng" numeric(10,0) not null, "accuracy" numeric(10,0) not null, "city" varchar(255) not null, "zipcode" varchar(255) not null, "street_name" varchar(255) not null, "street_number" varchar(255) not null, "country_code" varchar(255) not null);`);

    this.addSql(`alter table "wifi" add constraint "wifi_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);
  
    this.addSql(`
    create table "heatmaps" (
      "id" serial primary key,
      "user_id" int not null,
      "ssid" varchar(255),
      "grid_info" jsonb,
      "signal_grid" jsonb,
      "floor_plan_image" bytea,
      "created_at" timestamp default now()
    );
  `);
  }


  override async down(): Promise<void> {
    this.addSql(`alter table "wifi" drop constraint "wifi_user_id_foreign";`);

    this.addSql(`drop table if exists "base_entity" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "wifi" cascade;`);
    
    this.addSql(`alter table "heatmaps" drop constraint "heatmaps_user_id_foreign";`);
    this.addSql(`drop table if exists "heatmaps" cascade;`);

  
  }

}
