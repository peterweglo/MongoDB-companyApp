const Employee = require('../employee.model');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const Department = require('../department.model');

describe('Employee', () => {
  before(async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      console.error(err);
    }
  });

  describe('Reading data', () => {
    before(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'Marketing',
      });
      await testEmpTwo.save();
    });

    it('should return all the data with "find" method', async () => {
      const employees = await Employee.find();
      const expectedLength = 2;
      expect(employees.length).to.be.equal(expectedLength);
    });

    it('should return proper document by various params with findOne method', async () => {
      const employee = await Employee.findOne({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      expect(employee.firstName).to.be.equal('John');
      expect(employee.lastName).to.be.equal('Doe');
      expect(employee.department).to.be.equal('IT');
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Creating data', () => {
    it('should insert new document with "insertOne" method', async () => {
      const employee = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      await employee.save();
      expect(employee.isNew).to.be.false;
    });
    after(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'Marketing',
      });
      await testEmpTwo.save();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Employee.updateOne(
        { firstName: 'John', lastName: 'Doe', department: 'IT' },
        { $set: { firstName: '=John=', lastName: '=Doe=', department: '=IT=' } }
      );
      const updatedEmployee = await Employee.findOne({
        firstName: '=John=',
        lastName: '=Doe=',
        department: '=IT=',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const employee = await Employee.findOne({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      employee.firstName = '=John=';
      employee.lastName = '=Doe=';
      employee.department = '=IT=';
      await employee.save();

      const updatedEmployee = await Employee.findOne({
        firstName: '=John=',
        lastName: '=Doe=',
        department: '=IT=',
      });
      expect(updatedEmployee).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Employee.updateMany(
        {},
        {
          $set: {
            firstName: 'Updated!',
            lastName: 'Updated!',
            department: 'Updated!',
          },
        }
      );
      const employees = await Employee.find({
        firstName: 'Updated!',
        lastName: 'Updated!',
        department: 'Updated!',
      });
      expect(employees.length).to.be.equal(2);
    });

    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      const testEmpOne = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      await testEmpOne.save();

      const testEmpTwo = new Employee({
        firstName: 'Amanda',
        lastName: 'Doe',
        department: 'Marketing',
      });
      await testEmpTwo.save();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Employee.deleteOne({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      const removeEmployee = await Employee.findOne({
        firstName: 'John',
        lastName: 'Doe',
        department: 'IT',
      });
      expect(removeEmployee).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Employee.deleteMany();
      const employees = await Employee.find();
      expect(employees.length).to.be.equal(0);
    });
    afterEach(async () => {
      await Employee.deleteMany();
    });
  });

  describe('Populate department', () => {
    beforeEach(async () => {
      const testDep = new Department({ name: 'Department #1' });
      await testDep.save();
      const department = await Department.findOne({ name: 'Department #1' });
      const testEmp = new Employee({
        firstName: 'John',
        lastName: 'Doe',
        department: department.id,
      });
      await testEmp.save();
    });

    it('should properly populate department ', async () => {
      const employee = await Employee.findOne({
        firstName: 'John',
        lastName: 'Doe',
      }).populate('department');

      expect(employee.department.name).to.be.equal('Department #1');
    });

    afterEach(async () => {
      await Employee.deleteMany();
      await Department.deleteMany();
    });
  });
});
