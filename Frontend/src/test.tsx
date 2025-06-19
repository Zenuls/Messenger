type Product = {
  type: string;
  name: string;
  price: number;
  quantity?: number;
};

type Result = {
  [type: string]: {
    averagePrice: number;
    totalQuantity: number | "Товара нет в наличии";
  };
};

const TsTask = ({testData} : { testData : Product[] }) => {
  function calculator3(testData: Product[]): Result {
    const group: { [type: string]: Product[] } = {};

    //сгруппировал по типу, чтобы было легче работать с количеством и ценой во время подсчёта товаров конкретного типа
    testData.forEach((product)=> {
      if (!group[product.type]) {
        group[product.type] = [];
      }
      group[product.type].push(product);
    })

    const result: Result = {};  
    for (const type in group) {
      const items = group[type];

      let totalQuantity = 0;
      let sumPrice = 0;

      items.forEach((item) => {
        if (item.quantity !== undefined) {
          totalQuantity += item.quantity;
          sumPrice += item.price;
        }
      });

      const averagePrice = sumPrice / items.length;

      result[type] = {
        averagePrice: averagePrice,
        totalQuantity: totalQuantity > 0 ? totalQuantity : "Товара нет в наличии"
      };
    }

    return result;
  }

  return(
    <div>
      {calculator3(testData)}
    </div>
  )
}

export default TsTask;