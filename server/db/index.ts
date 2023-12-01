import { Sequelize} from "sequelize-typescript";


const HOST = "localhost";

const db = new Sequelize({
  host: HOST,
  port: 5432,
  dialect: "postgres",
  username: "postgres",
  database: "whspr",
  password: "ok",
  dialectOptions: {
    ssl: false,
    // Explicitly set the authentication mechanism to 'default'
    default: {
      authentication: {
        type: "default",
        options: {
          authentication: "default",
        },
      },
    },
  },
});

db.authenticate()
    .then(() => console.log('Database connected!'))
    .catch((err: Error) => console.log(err))


module.exports = {
    db
}