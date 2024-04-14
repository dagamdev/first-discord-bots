require('dotenv').config()

const token = process.env.TOKEN
const mongoUrl = process.env.MONGO_URL
const enviroment = process.env.ENVIROMENT

module.exports = {
  token, 
  mongoUrl,
  enviroment
}