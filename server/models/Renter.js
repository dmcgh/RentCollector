/* eslint-disable no-underscore-dangle, no-param-reassign, func-names, no-console */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const renterSchema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, required: true },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment' },
});

renterSchema.methods.pay = function (apartment, cb) {
  if (this.money < apartment.rent) cb();
  this.money = (this.money - apartment.rent);
  apartment.collectedRent = apartment.collectedRent + apartment.rent;

  this.save(() => {
    apartment.save(() => {
      cb();
    });
  });
};

module.exports = mongoose.model('Renter', renterSchema);
