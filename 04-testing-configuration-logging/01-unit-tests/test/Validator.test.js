const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля минимум', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: '' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 0');
    });

    it('валидатор проверяет строковые поля максимум', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 5,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 5, got 6');
    });

    it('валидатор проверяет строковые поля валидное', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 8,
        },
      });

      const errors = validator.validate({ name: 'Lalala' });

      expect(errors).to.have.length(0);
    });

    it('валидатор проверяет числовые поля минимум', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
      });

      const errors = validator.validate({ age: 0 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 5, got 0');
    });

    it('валидатор проверяет числовые поля максимум', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 5,
          max: 10,
        },
      });

      const errors = validator.validate({ age: 3e6 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 5, got 3000000');
    });

    it('валидатор проверяет строковые и числовые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 5,
          max: 10, 
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 'La', age: 1 });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 5, got 2');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too little, expect 18, got 1');
    });

    it('валидатор проверяет соответствие типов имени и ошибка минимального возраста', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 8, age: 10 });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('too little, expect 18, got 10');
    });

    it('валидатор проверяет соответствие типов имени', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 8, age: 20 });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор проверяет соответствие типов возраста и короткого имени', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 'SashaSashaSashaSashaSasha', age: '10' });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 25');
      expect(errors[1]).to.have.property('field').and.to.be.equal('age');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор проверяет соответствие типов возраста', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
        age: {
          type: 'number',
          min: 18,
          max: 27,
        }
      });

      const errors = validator.validate({ name: 'SashaSashaS', age: '10' });

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор проверяет соответствие типов возраста и имени', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 18,
          max: 27,
        },
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const errors = validator.validate({ name: 444, age: '10' });

      expect(errors).to.have.length(2);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
      expect(errors[1]).to.have.property('field').and.to.be.equal('name');
      expect(errors[1]).to.have.property('error').and.to.be.equal('expect string, got number');
    });
  });
});