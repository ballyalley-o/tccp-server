import bcrypt from 'bcryptjs'
import ObjectID from 'bson-objectid'

const userCollection = [
  {
    firstname: 'Tina',
    lastname: 'Marrero',
    username: '@tinamarrero',
    role: ObjectID('5c3b08ae6d663a3c4e8f3566'),
    location: 'Chicago, Illinois, US',
    email: 'tina@test.com',
    cohort: ObjectID('5c3b08cf6d663a3c4e8f3568'),
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'John',
    lastname: 'Doe',
    username: '@johndoe',
    role: ObjectID('5c3b08ae6d663a3c4e8f3566'),
    location: 'New York, NY, US',
    email: 'john@example.com',
    // cohort: '',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'Alice',
    lastname: 'Smith',
    username: '@alicesmith',
    role: ObjectID('5c3b08ae6d663a3c4e8f3566'),
    location: 'Los Angeles, CA, US',
    email: 'alice@example.com',
    // cohort: '',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'Bob',
    lastname: 'Johnson',
    username: '@bobjohnson',
    role: ObjectID('5c3b08ae6d663a3c4e8f3566'),
    location: 'Houston, TX, US',
    email: 'bob@example.com',
    // cohort: '',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'Emily',
    lastname: 'Brown',
    username: '@emilybrown',
    role: ObjectID('5c3b08ae6d663a3c4e8f3566'),
    location: 'Miami, FL, US',
    email: 'emily@example.com',
    // cohort: '',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'David',
    lastname: 'Smith',
    username: '@davidsmith',
    role: ObjectID('5c3b08ae6d663a3c4e8f3566'),
    location: 'San Francisco, CA, US',
    email: 'david@example.com',
    // cohort: '',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'Linda',
    lastname: 'Johnson',
    username: '@lindajohnson',
    role: ObjectID('5c3b08ae6d663a3c4e8f3566'),
    location: 'Dallas, TX, US',
    email: 'linda@example.com',
    // cohort: '',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'Michael',
    lastname: 'Davis',
    username: '@michaeldavis',
    role: ObjectID('5c3b08bf6d663a3c4e8f3567'),
    location: 'Seattle, WA, US',
    // cohort: '',
    email: 'michael@example.com',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'Sophia',
    lastname: 'Miller',
    username: '@sophiamiller',
    role: ObjectID('5c3b08bf6d663a3c4e8f3567'),
    location: 'Denver, CO, US',
    email: 'sophia@example.com',
    // cohort: '',
    password: bcrypt.hashSync('123456', 10),
  },
  {
    firstname: 'Daniel',
    lastname: 'Wilson',
    username: '@danielwilson',
    role: ObjectID('5c3b08cf6d663a3c4e8f3568'),
    location: 'Boston, MA, US',
    email: 'daniel@example.com',
    cohort: ObjectID('5c3b08cf6d663a3c4e8f3568'),
    password: bcrypt.hashSync('123456', 10),
  },
]

export default userCollection