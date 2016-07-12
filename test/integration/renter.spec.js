/* eslint-disable max-len, no-unused-expressions no-underscore-dangle */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('Renters', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populateRenters.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('post /Renters/add', () => {
    it('should create new Renter', (done) => {
      request(app)
      .post('/Renters/add')
      .send({ name: 'Bob', money: 34 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter._id).to.not.be.null;
        expect(rsp.body.renter.money).to.equal(34);
        expect(rsp.body.renter.name).to.equal('Bob');
        done();
      });
    });
  });
  describe('get /Renters', () => {
    it('should return all renters', (done) => {
      request(app)
      .get('/Renters')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(3);
        done();
      });
    });
  });
  describe('get /Renters/:id', () => {
    it('should return one renter', (done) => {
      request(app)
      .get('/Renters/012345678901234567890012')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter).to.not.be.null;
        expect(rsp.body.renter.money).to.equal(20000);
        done();
      });
    });
  });
  describe('get /Renters/:id', () => {
    it('should return a 400 on an id that does not exist', (done) => {
      request(app)
      .get('/Renters/012345678901234567890016')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.renter).to.not.be.null;
        expect(rsp.body.messages).to.deep.equal(['id not found']);
        done();
      });
    });
  });
  describe('put /Renters/:id/pay', () => {
    it('should pay rent for given apartment', (done) => {
      request(app)
      .put('/Renters/012345678901234567890012/pay')
      .send({ id: '012345678901234567890113' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.money).to.equal(18525);
        expect(rsp.body.apartment.collectedRent).to.equal(1475);
        done();
      });
    });
  });
  describe('put /Renters/:id/pay', () => {
    it('should not pay rent for a non-existing renter', (done) => {
      request(app)
      .put('/Renters/0123456789012345678900000/pay')
      .send({ id: '012345678901234567890113' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['renter not found']);
        done();
      });
    });
  });
  describe('put /Renters/:id/pay', () => {
    it('should not pay rent for a non-existing apartment', (done) => {
      request(app)
      .put('/Renters/012345678901234567890012/pay')
      .send({ id: '0123456789012345678901130000' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['apartment not found']);
        done();
      });
    });
  });
  describe('put /Renters/:id/pay', () => {
    it('should not pay rent if renter doesnt have enough money', (done) => {
      request(app)
      .put('/Renters/012345678901234567890013/pay')
      .send({ id: '012345678901234567890112' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.collectedRent).to.equal(0);
        expect(rsp.body.renter.money).to.equal(100);
        done();
      });
    });
  });
});
