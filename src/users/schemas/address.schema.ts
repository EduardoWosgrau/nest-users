import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  number: string;

  @Prop()
  complement?: string;

  @Prop({ required: true })
  neighborhood: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  state: string;

  @Prop()
  zipCode: string;
}
