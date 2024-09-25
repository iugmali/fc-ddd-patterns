import {app, sequelize} from "../express";
import request from "supertest";


describe('customer E2E tests', () => {
  beforeEach(async () => {
    await sequelize.sync({force: true});
    await request(app)
      .post('/customer')
      .send({
        name: 'John Doe',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          number: 123,
          zip: '62701'
        }
      });
    await request(app)
      .post('/customer')
      .send({
        name: 'Jane Doe',
        address: {
          street: '456 Main St',
          city: 'Idaho',
          number: 1,
          zip: '63510'
        }
      });
  })

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a customer', async () => {
    // Arrange
    // Act
    const response = await request(app)
      .post('/customer')
      .send({
        name: 'John Doe',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          number: 123,
          zip: '62701'
        }
      })
    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        number: 123,
        zip: '62701'
      }
    });
  });

  it('should not create a customer if name is missing', async () => {
    const response = await request(app)
      .post('/customer')
      .send({
        name: '',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          number: 123,
          zip: '62701'
        }
      })
    // Assert
    expect(response.status).toBe(500);
  });

  it('should list all customers', async () => {
    const response = await request(app).get('/customer').send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      customers: [
        {
          id: expect.any(String),
          name: 'John Doe',
          address: {
            street: '123 Main St',
            city: 'Springfield',
            number: 123,
            zip: '62701'
          }
        },
        {
          id: expect.any(String),
          name: 'Jane Doe',
          address: {
            street: '456 Main St',
            city: 'Idaho',
            number: 1,
            zip: '63510'
          }
        }
      ]
    });
  });

  it('should list all customers in xml', async () => {
    const response = await request(app).get('/customer').set('Accept', 'application/xml').send();
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('application/xml; charset=utf-8');
    expect(response.text).toContain('<customers>');
    expect(response.text).toContain('<customer>');
    expect(response.text).toContain('<id>');
    expect(response.text).toContain('<name>');
    expect(response.text).toContain('<address>');
    expect(response.text).toContain('<street>');
    expect(response.text).toContain('<city>');
    expect(response.text).toContain('<number>');
    expect(response.text).toContain('<zip>');
    expect(response.text).toContain('</customer>');
    expect(response.text).toContain('</customers>');
  });

  it('should find a customer by id', async () => {
    const customerCreatedResponse = await request(app)
      .post('/customer')
      .send({
        name: 'John Doe',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          number: 123,
          zip: '62701'
        }
      });
    const id = customerCreatedResponse.body.id;
    const response = await request(app).get(`/customer/${id}`).send();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id,
      name: 'John Doe',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        number: 123,
        zip: '62701'
      }
    });
  });

  it('should update a customer', async () => {
    const customerCreatedResponse = await request(app)
      .post('/customer')
      .send({
        name: 'John Doe',
        address: {
          street: '123 Main St',
          city: 'Springfield',
          number: 123,
          zip: '62701'
        }
      });
    const id = customerCreatedResponse.body.id;
    const response = await request(app).patch(`/customer/${id}`).send({
      name: 'John Snow',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        number: 123,
        zip: '62701'
      }
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id,
      name: 'John Snow',
      address: {
        street: '123 Main St',
        city: 'Springfield',
        number: 123,
        zip: '62701'
      }
    });
  });
});
