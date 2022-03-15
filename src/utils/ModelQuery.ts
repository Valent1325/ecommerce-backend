export default class ModelQuery {
  query: any;
  model: any;
  queryString: any;
  total: number;

  constructor(query: any, model: any, queryString: any) {
    this.query = query;
    this.model = model;
    this.queryString = queryString;
    this.total = 0;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const exludedFileds = ['page', 'sort', 'limit', 'keyword', 'price.gte', 'price.lte'];
    exludedFileds.forEach((key: string) => delete queryObj[key]);

    // Полнотекстовый поиск по наименованию товара
    if (this.queryString.keyword) {
      queryObj = { ...queryObj, $text: { $search: this.queryString.keyword } };
    }

    // Фильтрация по цене
    if (this.queryString['price.gte']) {
      queryObj = { ...queryObj, price: { $gte: Number(this.queryString['price.gte']) } };
    }

    if (this.queryString['price.lte']) {
      queryObj = { ...queryObj, price: { $lte: Number(this.queryString['price.lte']) } };
    }

    if (this.queryString['os']) {
      queryObj = { ...queryObj, 'properties.os': { $in: this.queryString['os'].split(',') } };
    }

    if (this.queryString['cpu']) {
      queryObj = { ...queryObj, 'properties.cpu': { $in: this.queryString['cpu'].split(',') } };
    }

    if (this.queryString['memory']) {
      queryObj = { ...queryObj, 'properties.memory': { $in: this.queryString['memory'].split(',') } };
    }

    if (this.queryString['ram']) {
      queryObj = { ...queryObj, 'properties.ram': { $in: this.queryString['ram'].split(',') } };
    }

    if (this.queryString['color']) {
      queryObj = { ...queryObj, 'properties.color': { $in: this.queryString['color'].split(',') } };
    }

    this.query = this.query.find(queryObj);
    this.model = this.model.find(queryObj);

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;

    this.query = this.query
      .skip(skip)
      .limit(limit);

    return this;
  }

  count() {
    this.total = this.model.countDocuments();

    return this;
  }
}
