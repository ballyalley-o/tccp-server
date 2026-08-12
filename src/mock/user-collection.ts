import bcrypt   from 'bcryptjs'
import ObjectID from 'bson-objectid'

const studentCollection = [
  {
    firstname: 'Tina',
    lastname : 'Marrero',
    username : '@tinamarrero',
    role     : 'student',
    location : 'Chicago, Illinois, US',
    email    : 'tina@test.com',
    bootcamp : ObjectID('5c3b08cf6d663a3c4e8f3568'),
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    firstname: 'John',
    lastname : 'Doe',
    username : '@johndoe',
    role     : 'student',
    location : 'New York, NY, US',
    email    : 'john@example.com',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    firstname: 'Alice',
    lastname : 'Smith',
    username : '@alicesmith',
    role     : 'student',
    location : 'Los Angeles, CA, US',
    email    : 'alice@example.com',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    _id      : ObjectID('65d44d6ef8e810489db6a59c'),
    firstname: 'Bob',
    lastname : 'Johnson',
    username : '@bobjohnson',
    role     : 'trainer',
    location : 'Houston, TX, US',
    email    : 'bob@example.com',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    _id      : ObjectID('65d44d6ef8e810489db6a59d'),
    firstname: 'Emily',
    lastname : 'Brown',
    username : '@emilybrown',
    role     : 'trainer',
    location : 'Miami, FL, US',
    email    : 'emily@example.com',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    _id      : ObjectID('65d44d6ef8e810489db6a59f'),
    firstname: 'David',
    lastname : 'Smith',
    username : '@davidsmith',
    role     : 'student',
    location : 'San Francisco, CA, US',
    email    : 'david@example.com',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    _id      : ObjectID('65d44d6ef8e810489db6a59e'),
    firstname: 'Linda',
    lastname : 'Johnson',
    username : '@lindajohnson',
    role     : 'student',
    location : 'Dallas, TX, US',
    email    : 'linda@example.com',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    firstname: 'Michael',
    lastname : 'Davis',
    username : '@michaeldavis',
    role     : 'student',
    location : 'Seattle, WA, US',
    email    : 'michael@example.com',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    _id      : ObjectID('65d44d6ef8e810489db6a5a1'),
    firstname: 'Sophia',
    lastname : 'Miller',
    username : '@sophiamiller',
    role     : 'trainer',
    location : 'Denver, CO, US',
    email    : 'sophia@example.com',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  },
  {
    firstname: 'Daniel',
    lastname : 'Wilson',
    username : '@danielwilson',
    role     : 'student',
    location : 'Boston, MA, US',
    email    : 'daniel@example.com',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10),
  },
      // {
      //   firstname: 'test',
      //   lastname : 'TRUE',
      //   email    : 'ballyalleydev@gmail.com',
      //   studentname : '@beySaq',
      //   role     : 'trainer',
      //   avatar   : 'no-photo.jpg',
      //   location : 'Auckland, NZ',
      //   password : bcrypt.hashSync('123456', 10),
      // },
  {
    firstname: 'admin_1',
    lastname : '1',
    email    : 'ballyalleydev@gmail.com',
    username : '@admin1',
    role     : 'admin',
    avatar   : 'no-photo.jpg',
    location : 'Auckland, NZ',
    status   : 'active',
    password : bcrypt.hashSync('123456', 10)
  }
]

export default studentCollection
