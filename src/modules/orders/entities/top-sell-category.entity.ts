import { ApiProperty } from "@nestjs/swagger";
import CategoryEnum from "src/modules/books/enum/category.enum";
import { TopSellCategoryItemEntity } from "./top-sell-category-item.entity";

export class TopSellCategoryEntity {
    @ApiProperty({
        enum: CategoryEnum,
        example: CategoryEnum.ACTION
    })
    category: CategoryEnum

    @ApiProperty({
        type: [TopSellCategoryItemEntity],
    })
    topSeller: [TopSellCategoryItemEntity]
}