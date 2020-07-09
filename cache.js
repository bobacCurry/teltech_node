const redis = require('redis')

const client = redis.createClient(6379, '127.0.0.1')

const cache = () => {}
 
let text = async(key)=>{

    let doc = await new Promise( (resolve) => {

        client.get(key,function(err, res){

            return resolve(res)

        })

    })

    return JSON.parse(doc)
}

cache.set = function(key, value) {

    value = JSON.stringify(value)

    return client.set(key, value, function(err){

        if (err) {

            console.error(err)

        }

    })

}
 
cache.get = async(key)=>{

    return await text(key)
}
 
cache.expire = function(key, time) {

    return client.expire(key, time)
}

cache.del = async(key)=>{

	return await new Promise( (resolve) => {

		client.del(key,function(err, res){

            return resolve(res)

        })
	})
}

module.exports = cache