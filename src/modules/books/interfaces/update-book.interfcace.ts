import CategoryEnum from '../enum/category.enum';

export interface updateBookInterface {
  bookId: string;
  bookName: string;
  price: number;
  imageUrl: string;
  publisher: string;
  category: CategoryEnum;
  isAvailable: boolean;
}
