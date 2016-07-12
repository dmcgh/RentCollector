/* eslint-disable no-underscore-dangle, no-param-reassign, func-names, no-console */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const apartmentSchema = new Schema({
  name: { type: String, required: true },
  sqft: { type: Number, required: true },
  bdrm: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  collectedRent: { type: Number, default: 0 },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter' },
});

apartmentSchema.methods.lease = function (renter, cb) {
  this.renter = renter._id;
  renter.apartment = this._id;
  this.save(() => {
    renter.save(() => {
      cb();
    });
  });
};

module.exports = mongoose.model('Apartment', apartmentSchema);
