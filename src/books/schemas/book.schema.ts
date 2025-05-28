import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  genre: string;

  @Prop()
  publishedYear: number;

  @Prop({ default: true })
  available: boolean;
}

export const BookSchema = SchemaFactory.createForClass(Book);