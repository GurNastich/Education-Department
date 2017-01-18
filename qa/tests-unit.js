var mottos = require('../lib/mottos.js');
var expect = require('chai').expect;

suite('Test mottos', function() {
  expect(typeof mottos.getMotto() === 'string');
});