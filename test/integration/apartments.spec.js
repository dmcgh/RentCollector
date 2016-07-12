const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
const Renter = require('../../dst/models/Renter');
const Apartment = require('../../dst/models/Apartment');


describe('Apartment', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populateApartments.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('post /Apartments/add', () => {
    it('should create new Apartment', (done) => {
      request(app)
      .post('/Apartments/add')
      .send({ name: "apt 4", sqft: 1800, bdrm: 4, floor: 4, rent: 2500 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('apt 4');
        expect(rsp.body.apartment.sqft).to.equal(1800);
        expect(rsp.body.apartment.bdrm).to.equal(4);
        expect(rsp.body.apartment.floor).to.equal(4);
        expect(rsp.body.apartment.rent).to.equal(2500);
        done();
      });
    });
  });

  describe('get /Apartments', () => {
    it('should return all apartments', (done) => {
      request(app)
      .get('/Apartments')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(3);
        done();
      });
    });
  });

  describe('get /Apartments/:id', () => {
    it('should return one apartment', (done) => {
      request(app)
      .get('/Apartments/012345678901234567890112')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('apt 2');
        done();
      });
    });
  });
  describe('put /Apartments/:id/lease', () => {
    it('should lease apartment to a renter', (done) => {
      request(app)
      .put('/Apartments/012345678901234567890111/lease')
      .send({ id: '012345678901234567890011' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.not.be.null;
        expect(rsp.body.apartment._id.toString()).to.equal('012345678901234567890111');
        expect(rsp.body.apartment.renter.toString()).to.equal('012345678901234567890011');
        expect(rsp.body.renter.apartment.toString()).to.equal('012345678901234567890111');
        done();
      });
    });
  });
  describe('put /Apartments/:id/lease', () => {
    it('trying to lease apartment that does not exist', (done) => {
      request(app)
      .put('/Apartments/012345678901234567890000/lease')
      .send({ id: '012345678901234567890011' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['apartment not found']);
        done();
      });
    });
  });
  describe('put /Apartments/:id/lease', () => {
    it('trying to lease apartment to renter that does not exist', (done) => {
      request(app)
      .put('/Apartments/012345678901234567890111/lease')
      .send({ id: '012345678901234567890000' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['renter not found']);
        done();
      });
    });
  });
});
