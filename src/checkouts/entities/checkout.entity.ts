import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CheckoutStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export type CreateCheckoutCommand = {
  items: {
    quantity: number;
    price: number;
    product: {
      name: string;
      description: string;
      imagem: string;
      product_id: string;
    };
  };
};

@Entity()
export class Checkout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @Column()
  status: CheckoutStatus = CheckoutStatus.PENDING;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => CheckoutItem, (item) => item.checkout, {
    cascade: ['insert'], eager: true
  })
  items: CheckoutItem[];

  static create(input: CreateCheckoutCommand) {
    const checkout = new Checkout();

    checkout.items = input.items.map((item) => {
      const checkoutItem = new CheckoutItem();
      checkoutItem.quantity = item.quantity;
      checkoutItem.price = item.price;
      checkoutItem.product = new CheckoutProduct();
      checkoutItem.product.name = item.product.name;
      checkoutItem.product.description = item.product.description;
      checkoutItem.product.image = item.product.image;
      checkoutItem.product.product_id = item.product.product_id;

      return checkoutItem;
    });
    checkout.total = checkout.items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return checkout;
  }
}

@Entity()
export class CheckoutProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  product_id: number; // productId in another microservice
}

@Entity()
export class CheckoutItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @ManyToMany(() => Checkout)
  checkout: Checkout;

  @ManyToMany(() => Checkout, { cascade: ['insert'], eager: true })
  product: CheckoutProduct;
}
