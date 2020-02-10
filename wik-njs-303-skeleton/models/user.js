const db = require('sqlite')
const Redis = require('ioredis')
const redis = new Redis()


module.exports = {
  get: async(userId) => {
    return await redis.hgetall('user:'+userId)
  },

  count: () => {
    return db.get('SELECT COUNT(*) as count FROM users')
  },

  getAll: async(limit, offset) => {
    let listusers = []
    let users = await redis.keys('user:*')

    for (user in users) {
      if (user != undefined) {
        listusers.push(await redis.hgetall('user:'+user))
      }
    }
    return listusers
  },

  insert: async (params) => {
    const userId = await redis.incr('userId') 
    return redis.hmset(`user:${userId}`,'pseudo',params.pseudo,'firstname', params.firstname,'lastname', params.lastname,'email', params.email, 'password',params.password, 'userId', userId)
  },

  update: async(params) => {
    return await redis.hmset('user:'+params.userId,'pseudo',params.pseudo,'firstname', params.firstname,'lastname', params.lastname,'email', params.email, 'password',params.password, 'userId', params.userId)
  },

  remove: async (userId) => {
    return await redis.del('user:'+userId)
  }

}







