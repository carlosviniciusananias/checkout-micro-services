import { Injectable } from '@nestjs/common';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Checkout } from './entities/checkout.entity';

const PRODUCTS_LIST = [
  {
    id: 0,
    name: '',
    description: '',
    image: '',
    price: '',
  },
  {
    id: 1,
    name: '',
    description: '',
    image: '',
    price: '',
  },
];

@Injectable()
export class CheckoutsService {
  constructor(
    @InjectRepository(Checkout) private checkoutRepo: Repository<Checkout>,
  ) {}

  async create(createCheckoutDto: CreateCheckoutDto) {
    const productIds = createCheckoutDto.items.map((item) => item.product_id);
    const products = PRODUCTS_LIST.filter((product) =>
      productIds.includes(product.id),
    );

    const checkout = Checkout.create({
      items: createCheckoutDto.items.map((item) => {
        const product = products.find((p) => p.id === item.product_id);

        return {
          quantity: item.quantity,
          price: product.price,
          product: {
            name: product.name,
            description: product.description,
            image: product.image,
            product_id: product.id,
          },
        };
      }),
    });

    await this.checkoutRepo.save(checkout);
  }

  findAll() {
    return `This action returns all checkouts`;
  }

  findOne(id: number) {
    return this.checkoutRepo.findOneByOrFail({
      id,
    })
  }

  async pay(id: number) {
    const checkout = await this.checkoutRepo.findOneByOrFail({
      id
    })
    checkout.pay()

    return this.checkoutRepo.save(checkout)
  }

  async fail(id: number) {
    const checkout = await this.checkoutRepo.findOneByOrFail({
      id
    })
    checkout.fail()

    return this.checkoutRepo.save(checkout)
  }
}
