const fs = require('fs')

const path = require('path')

const config = require('../../config.js')

const PICURL = config.env.picurl

const AVATARPATH = 'static/avatar' // 头像文件夹

const TGPATH = 'static/tg' // tg文件夹

const COMMONPATH = 'static/common'

const exist_or_build = dir => {
  // 文件夹不存在则创建
  if (!fs.existsSync(dir)) {
    
    fs.mkdirSync(dir)
  }
}

const get_src_path = (type = 'avatar') => {
  
  if (type === 'avatar') {
    
    return AVATARPATH
  
  }
  
  if (type === 'telegram') {
    
    return TGPATH
  
  }

  return COMMONPATH
}

module.exports = {
  
  upload_file: (req, res) => {
    
    var file_stream = req.body.stream

    const file_type = req.body.type

    if (!file_stream || !file_stream.trim()) {
    
      return res.send({ code: 0, msg: '没有接收到文件流' })
    
    }

    var file_stream = file_stream.replace(/^data:image\/\w+;base64,/, '')

    const file_buffer = new Buffer(file_stream, 'base64')

    const filename = req.user._id + '_' + new Date().getTime() + '.jpeg'

    const src_path = get_src_path(file_type)

    if (!src_path) {

      return res.send({ code: 0, msg: '文件类型未允许被上传' })
    
    }

    const file_path = path.resolve(process.cwd(), src_path, filename)

    exist_or_build(path.resolve(process.cwd(), src_path))

    return fs.writeFile(file_path, file_buffer, function(err) {
      
      if (err) {
        
        res.send({ code: 0, msg: err })
      
      } else {
      
        let pic_url = PICURL + src_path + '/' + filename

        res.send({ code: 1, msg: pic_url })
      }
    })
  }
}