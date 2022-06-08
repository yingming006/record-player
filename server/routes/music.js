const express = require('express')
const router = express.Router()

const request = require('superagent')
const response = require('../common/response')

router.get('/search', function (req, res, next) {
    let keyword = encodeURIComponent(req.query.keyword || '')
    request.get(`https://netease-cloud-music-api-mocha-mu-31.vercel.app/search?keywords=${keyword}`)
        .end((err1, res1) => {
            if (err1) {
                res.send(response(100001, '获取失败'))
                return false
            }
            let data = JSON.parse(res1.text)
            if (data.code === 200) {
                let canPlay = []
                data.result.songs && data.result.songs.forEach(item => {
                    if (item.fee !== 1) canPlay.push(item)
                })
                data.result.songs = canPlay
                res.send(response(100000, '成功', data.result))
            }
            else res.send(response(100002, '获取失败'))
        })
})

router.get('/songDetail', function (req, res, next) {
    let id = Number(req.query.id) || 0
    request.get(`https://netease-cloud-music-api-mocha-mu-31.vercel.app/song/detail?ids=${id}`)
        .end((err1, res1) => {
            if (err1) {
                res.send(response(100001, '获取失败'))
                return false
            }
            
            let data = JSON.parse(res1.text)
            console.log(JSON.parse(res1.text).songs)
            if (data.code === 200 && data.songs && data.songs[0]) res.send(response(100000, '成功', data.songs[0]))
            else res.send(response(100002, '获取失败'))
        })
})

router.get('/lyric', function (req, res, next) {
    let id = Number(req.query.id) || 0
    request.get(`https://netease-cloud-music-api-mocha-mu-31.vercel.app/lyric?id=${id}`)
        .end((err1, res1) => {
            if (err1) {
                res.send(response(100001, '获取失败'))
                return false
            }
            let data = JSON.parse(res1.text)
            if (data.code === 200 && data.lrc && data.lrc.lyric) res.send(response(100000, '成功', data.lrc.lyric))
            else res.send(response(100002, '获取失败'))
        })
})

module.exports = router