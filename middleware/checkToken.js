const jwt = require('jsonwebtoken')

const fs = require('fs') //引入他的模块之后调用读取文件的方法

const key = fs.readFileSync(process.cwd() + '/jwt-key.txt', 'utf-8')

const decode = (req, res, next) => {

    //检查post的信息或者url查询参数或者头信息

    const token = req.headers['token']

    // 解析 token

    if (token) {

        // 确认token

        jwt.verify(token, key, (err, decoded) => {

            if (err) {

                return res.status(401).send({ success: false, msg: 'token信息错误.' })

            } else {

                // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用

                req.user = decoded

                next()
            }
        })

    } else {

        // 如果没有token，则返回错误

        return res.send({ success: false, msg: '没有提供token！' })
    }
}

const admin = (req, res, next) => {

    //检查post的信息或者url查询参数或者头信息

    const token = req.headers['token']

    if (token) {

        // 确认token

        jwt.verify(token, key, (err, decoded) => {

            if (err) {

                return res.send({ success: false, msg: 'token信息错误.' })

            } else {

                // 如果没问题就把解码后的信息保存到请求中，供后面的路由使用

                req.user = decoded

                if (req.user.access.indexOf('admin')===-1) {

                    return res.send({ success: false, msg: '权限缺失' })
                }

                next()
            }
        })

    } else {

        // 如果没有token，则返回错误

        return res.send({ success: false, msg: '没有提供token！' })
    }
}

const encode = function(info, expire = 60 * 68 * 24) {

    return jwt.sign(info, key, { 'expiresIn': expire }) // 设置过期时间
}

module.exports = { decode, admin, encode }