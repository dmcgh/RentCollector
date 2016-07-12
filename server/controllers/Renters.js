/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Renters from '../models/Renter';
import Apartments from '../models/Apartment';
const router = module.exports = express.Router();

// index
router.get('/', (req, res) => {
  Renters.find().exec((err, renters) => {
    res.send({ renters });
  });
});

router.get('/:id', (req, res) => {
  Renters.findById(req.params.id, (err, renter) => {
    if (renter != null) {
      res.send({ renter });
    }
    else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

router.put('/:id/pay', (req, res) => {
  Renters.findById(req.params.id, (err1, renter) => {
    Apartments.findById(req.body.id, (err2, apartment) => {
      if (apartment != null && renter != null) {
        renter.pay(apartment, () => {
          res.send({ apartment, renter });
        });
      } else if (apartment == null) {
        res.status(400).send({ messages: ['apartment not found'] });
      } else if (renter == null) {
        res.status(400).send({ messages: ['renter not found'] });
      }
    });
  });
});

router.post('/add', (req, res) => {
  const renter = new Renters(req.body);
  renter.save(() => {
    res.send({ renter });
  });
});
