const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

//the code will be passed the password from the credentials we created in the MongoDB Atlass, as a command line parameter.
const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.tg0gt.mongodb.net/test?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 5) {

  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
    mongoose.connection.close()
  })

} else if (process.argv.length === 3) {
  Person.find({}).then(result => {
    if (result.length === 0) {
      console.log('Phonebook registry is empty. Please add entries.')
    }
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  console.log('To add an entry to the phonebook, please provide the following: node mongo.js <password> <"firstName lastName"> <number> \n To access the phonebook registry, please prodivde the following: node mongo.js <password>')
  process.exit(1)
}