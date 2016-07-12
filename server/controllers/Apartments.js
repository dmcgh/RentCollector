/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, array-callback-return, max-len */

import express from 'express';
import Renters from '../models/Renter';
import Apartments from '../models/Apartment';
const router = module.exports = express.Router();

// index
router.get('/', (req, res) => {
  Apartments.find().exec((err, apartments) => {
    res.send({ apartments });
  });
});

router.get('/:id', (req, res) => {
  Apartments.findById(req.params.id, (err, apartment) => {
    if (apartment != null) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

router.put('/:id/lease', (req, res) => {
  Renters.findById(req.body.id, (err1, renter) => {
    Apartments.findById(req.params.id, (err2, apartment) => {
      if (apartment != null && renter != null) {
        apartment.lease(renter, () => {
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
  const apartment = new Apartments(req.body);
  apartment.save(() => {
    res.send({ apartment });
  });
});
