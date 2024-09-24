import {app, sequelize} from "../express";
import request from "supertest";

describe('product E2E tests', () => {
  beforeEach(async () => {
    await sequelize.sync({force: true});
  })

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    // Arrange
    // Act
    const response = await request(app)
      .post('/product')
      .send({
        name: 'Product 1',
        price: 10_00
      });
    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Product 1',
      price: 10_00
    });
  });

  it('should not create a product if name or price is missing', async () => {
    const response1 = await request(app)
      .post('/product')
      .send({
        name: '',
        price: 10_00
      });
    expect(response1.status).toBe(500);
    const response2 = await request(app)
      .post('/product')
      .send({
        name: 'Produto 1',
        price: ''
      });
    expect(response2.status).toBe(500);
  });

  it('should list all products', async () => {
    await request(app)
      .post('/product')
      .send({
        name: 'Product 1',
        price: 10_00
      });
    await request(app)
      .post('/product')
      .send({
        name: 'Product 2',
        price: 20_00
      });
    const response = await request(app).get('/product').send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      products: [
        {
          id: expect.any(String),
          name: 'Product 1',
          price: 10_00
        },
        {
          id: expect.any(String),
          name: 'Product 2',
          price: 20_00
        }
      ]
    });
  });

  it('should find a product by id', async () => {
    const createResponse = await request(app)
      .post('/product')
      .send({
        name: 'Product 1',
        price: 10_00
      });
    const response = await request(app).get(`/product/${createResponse.body.id}`).send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: createResponse.body.id,
      name: 'Product 1',
      price: 10_00
    });
  });

  it('should not find a product by id if it does not exist', async () => {
    const response = await request(app).get(`/product/1`).send();
    expect(response.status).toBe(500);
  });

  it('should update a product', async () => {
    const createResponse = await request(app)
      .post('/product')
      .send({
        name: 'Product 1',
        price: 10_00
      });
    const response = await request(app)
      .patch(`/product/${createResponse.body.id}`)
      .send({
        name: 'Product 2',
        price: 20_00
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: createResponse.body.id,
      name: 'Product 2',
      price: 20_00
    });
  });
})
