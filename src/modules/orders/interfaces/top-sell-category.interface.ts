import CategoryEnum from 'src/modules/books/enum/category.enum';
import { TopSellCategoryItemInterface } from './top-sell-category-item.interface';

export interface TopSellCategoryInterface {
  category: CategoryEnum;
  topSeller: [TopSellCategoryItemInterface];
}
