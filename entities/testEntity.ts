// testEntity.ts

import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Test {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("text")
  location!: string;

  @Column("int")
  signalStrength!: number;

}
