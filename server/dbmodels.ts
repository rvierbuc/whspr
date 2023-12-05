import { Sequelize, DataTypes } from 'sequelize'

const HOST = 'localhost'

const db = new Sequelize({
  host: HOST,
  port: 5432,
  dialect: 'postgres',
  username: 'postgres',
  database: 'whspr',
  password: 'ok'
})

export const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING
  },
  profileImgUrl: {
    type: DataTypes.STRING
  }
})

export const MagicConch = db.define('MagicConch', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  sendingUserId: {
    type: DataTypes.BIGINT
  },
  receivingUserId: {
    type: DataTypes.BIGINT
  },
  title: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING
  },
  audioId: {
    type: DataTypes.BIGINT
  }
})

export const Sound = db.define('Sound', {
  userId: {
    type: DataTypes.BIGINT
  },
  postId: {
    type: DataTypes.BIGINT
  },
  recordingUrl: {
    type: DataTypes.STRING
  }
})

export const Post = db.define('Post', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.BIGINT
  },
  postId: {
    type: DataTypes.BIGINT
  },
  category: {
    type: DataTypes.STRING
  },
  title: {
    type: DataTypes.STRING
  },
  url: {
    type: DataTypes.STRING
  },
  audioId: {
    type: DataTypes.BIGINT
  }
})

export const Radio = db.define('Radio', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  hostId: {
    type: DataTypes.BIGINT
  },
  listenerCount: {
    type: DataTypes.BIGINT
  },
  url: {
    type: DataTypes.STRING
  },
  title: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING
  }
})

export const Like = db.define('Like', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.BIGINT
  },
  postId: {
    type: DataTypes.BIGINT
  }
})

export const UsersRadio = db.define('UsersRadio', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  socketId: {
    type: DataTypes.BIGINT
  },
  userId: {
    type: DataTypes.BIGINT
  },
  radiosId: {
    type: DataTypes.BIGINT
  }
})

export const Follower = db.define('Follower', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.BIGINT
  },
  followingId: {
    type: DataTypes.BIGINT
  }
})

export const Stat = db.define('Stat', {
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.BIGINT
  },
  postId: {
    type: DataTypes.BIGINT
  },
  type: {
    type: DataTypes.STRING
  }
})
// defines table relations
MagicConch.belongsTo(User, { foreignKey: 'sendingUserId', as: 'sendingUser' })
MagicConch.belongsTo(User, { foreignKey: 'receivingUserId', as: 'receivingUser' })
MagicConch.belongsTo(Sound, { foreignKey: 'audioId', as: 'audio' })

Like.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Like.belongsTo(Post, { foreignKey: 'postId', as: 'post' })

UsersRadio.belongsTo(User, { foreignKey: 'userId', as: 'user' })
UsersRadio.belongsTo(Radio, { foreignKey: 'radiosId', as: 'radio' })

Radio.belongsTo(User, { foreignKey: 'hostId', as: 'host' })

Post.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Post.belongsTo(Post, { foreignKey: 'postId', as: 'parentPost' })
Post.belongsTo(Sound, { foreignKey: 'audioId', as: 'audio' })

Stat.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Stat.belongsTo(Post, { foreignKey: 'postId', as: 'post' })

Follower.belongsTo(User, { foreignKey: 'userId', as: 'user' })
Follower.belongsTo(User, { foreignKey: 'followingId', as: 'followingUser' })

db.authenticate()
  .then(() => {
    console.log(`Successfully connected to the database on ${HOST}`)
  })
  .catch((error: any) => {
    console.error('Error connecting to the database:', error.message)
  })

// this function syncs the database, but you need a semicolon on the line above
// sync database whenever you make changes to the models above
// (async () => {
//   try {
//     await db.sync({ force: true })
//     console.log('Database synced!')
//   } catch (error) {
//     console.error('Error syncing database:', error)
//   } finally {
//     await db.close()
//   }
// })().catch((err: any) => { console.error(err) })
