import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Address } from './address.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Address], required: true })
  addresses: Address[];

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  birthDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
