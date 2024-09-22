import {Table, Model, PrimaryKey, Column, Unique} from "sequelize-typescript";

@Table({
  tableName: "products",
  timestamps: false,
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Unique
  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;
}
