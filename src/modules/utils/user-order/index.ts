import omit from 'lodash/omit';
import * as dayjs from 'dayjs';
import { isEqual, orderBy } from 'lodash';
import { DayQueryDTO } from 'src/modules/orders/dto/day-query.dto';
import { ReportOrderDTO } from 'src/modules/orders/dto/report-order.dto';

export class UserOrderUtil {
  static getTotalUserOrder(Ecategory: object, userOrders: any[]) {
    const categores = Object.assign(
      {},
      ...Object.values(Ecategory).map((category) => ({
        [category]: { quantity: 0, total: 0, books: [] },
      })),
    );

    for (const userOrder of userOrders) {
      categores[userOrder.category] = omit(userOrder, ['category']);
    }

    return categores;
  }

  static getDayInput(values: ReportOrderDTO[], query: DayQueryDTO) {
    const { startDay, endDay } = query;
    const startDate = dayjs(startDay);
    const endDate = dayjs(endDay);
    const days = [];

    for (
      let date = endDate;
      date.isAfter(startDate) || date.isSame(startDate);
      date = date.subtract(1, 'day')
    ) {
      days.push({
        totalPrice: 0,
        count: 0,
        date: date.format('DD/MM/YYYY'),
      });
    }

    for (const value of values) {
      const index = days.findIndex((day) => isEqual(day.date, value.date));
      if (index !== -1) {
        days[index] = value;
      }
    }

    return orderBy(days, ['date']);
  }
}
