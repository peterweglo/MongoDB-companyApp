const Employee = require('../employee.model.js');
const mongoose = require('mongoose');
const expect = require('chai').expect;

describe('Employee', () => {
  it('should throw an error if no "firstName" arg', async () => {
    const dep = new Employee({ lastName: 'Doe', department: 'IT' });

    dep.validateSync((err) => {
      expect(err.errors.firstName).to.exist;
    });
  });

  it('should throw an error if no "lastName" arg', () => {
    const dep = new Employee({ firtName: 'John', department: 'IT' });

    dep.validateSync((err) => {
      expect(err.errors.lastName).to.exist;
    });
  });
  it('should throw an error if no "department" arg', () => {
    const dep = new Employee({ firstName: 'John', lastName: 'Doe' });

    dep.validateSync((err) => {
      expect(err.errors.department).to.exist;
    });
  });

  it('should throw an error if "firstName" is not a string', () => {
    const cases = [{}, []];
    for (let firstName of cases) {
      const dep = new Employee({
        firstName,
        lastName: 'Doe',
        department: 'IT',
      });

      dep.validateSync((err) => {
        expect(err.errors.firstName).to.exist;
      });
    }
  });
  it('should throw an error if "lastName" is not a string', () => {
    const cases = [{}, []];
    for (let lastName of cases) {
      const dep = new Employee({
        lastName,
        firtName: 'John',
        department: 'IT',
      });

      dep.validateSync((err) => {
        expect(err.errors.lastName).to.exist;
      });
    }
  });
  it('should throw an error if "department" is not a string', () => {
    const cases = [{}, []];
    for (let department of cases) {
      const dep = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department,
      });

      dep.validateSync((err) => {
        expect(err.errors.department).to.exist;
      });
    }
  });

  it('should not throw an error if arguments are okay', () => {
    const cases = [
      {
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      },
      {
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'Marketing',
      },
      {
        firstName: 'Johnatan',
        lastName: 'Wilson',
        department: 'IT',
      },
    ];

    for (let employee of cases) {
      const dep = new Employee({ employee });

      dep.validateSync((err) => {
        expect(err).to.not.exist;
      });
    }
  });

  after(() => {
    mongoose.models = {};
  });
});
