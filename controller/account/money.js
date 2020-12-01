const db_user = require('../../model/schema/user.js')

module.exports = {

	inc_money: async (uid,money) => {

		try{
			
			await db_user.findByIdAndUpdate(uid, { $inc: { money } })

			return { success:true, msg:"update success" }
		
		}catch(err){

			return { success:false, msg:"update fail" }
		}
	}
}