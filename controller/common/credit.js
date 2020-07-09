const notes = require('../../database/schema/notes')

const users = require('../../database/schema/users')

const comments = require('../../database/schema/comments')

const log = require('../common/log')

const NodeCache = require('node-cache')

const myCache = new NodeCache()

module.exports = {
	
	byComment : (uid,nid,nuid)=>{ //发布评论的用户id，帖子id 。机制一个每个用户一天评论一次，则文章发布者加 1 分

		const commentKey = 'COMMENT-'+uid.slice(15)+nid.slice(15)

		myCache.get(commentKey,async (err ,value)=>{

			if (err) {

				log.write(err)

				return false	
			}

			if (!value) {
				
				try{

					const user = await users.findById(nuid,'_id credit')

					user.credit = user.credit + 1

					user.save({timestamps:false})

					myCache.set(commentKey, 1, 3600*24)
				
				}catch(err){

					log.write(err)
				}
			}
		})
	},
	byRegister : (uid)=>{ //邀请码 加 1分



	},
	byGood : async (nid,good = true)=>{ //设为精选 加 5 分

		try{

			const note = await notes.findById(nid)

			const user = await users.findById(note.user)

			if (good) {

				user.credit = user.credit + 5
			}else{

				user.credit = user.credit - 5
			}

			user.save()

		}catch(err){

			log.write(err)
		}
	}
}