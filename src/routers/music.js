const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const axios = require('axios')

//query params object
let payload = {
    'api_key': process.env.LASTFM_API_KEY,
    'format': 'json',
}

const DEFAULT_LIMIT = 3
const URL = 'http://ws.audioscrobbler.com/2.0/'

//search for a track 
router.get('/music/search', auth, async (req, res) => {
    try {
        if(!req.query.track) {
            throw new Error ("Please provide track.")
        }
        payload['track'] = req.query.track
        payload['limit'] = req.query.limit || DEFAULT_LIMIT
        payload['method'] = 'track.Search'
        
        const response = await axios({
            method: 'get',
            url: URL,
            params: payload,
            headers: {'user-agent': 'q1ra'}
        })
        res.send(response.data.results.trackmatches.track.map((track) => {
            return {
                'artist': track.artist,
                'track': track.name
            }
        }))
    } catch(e) {
        res.status(404).send(e)
    }
})

//like a track
router.post('/music/like/track', auth, async (req, res) => {
    try {
        if(!req.query.track) {
            throw new Error ("Please provide track.")
        }
        payload['track'] = req.query.track
        payload['limit'] = req.query.limit || DEFAULT_LIMIT
        payload['method'] = 'track.Search'
        
        const response = await axios({
            method: 'get',
            url: URL,
            params: payload,
            headers: {'user-agent': 'q1ra'}
        })
        const tracks = response.data.results.trackmatches.track.map((track) => {
            return {
                'artist': track.artist,
                'track': track.name
            }
        })
        
        if(tracks.len == 0) {
            throw new Error("No tracks found.")
        }
        req.user.favouriteSongs.push(tracks[0])
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(404).send(e)
    }
})

//like an artist
router.post('/music/like/artist', auth, async (req, res) => {        
    try {
        if(!req.query.artist) {
            throw new Error ("Please provide track.")
        }
        payload['artist'] = req.query.artist
        payload['limit'] = req.query.limit || DEFAULT_LIMIT
        payload['method'] = 'artist.Search'
        
        const response = await axios({
            method: 'get',
            url: URL,
            params: payload,
            headers: {'user-agent': 'q1ra'}
        })
        const artists = response.data.results.artistmatches.artist.map((artist) => {
            return {
                'artist': artist.name,
            }
        })
        
        if(artists.len == 0) {
            throw new Error("No artists found.")
        }
        req.user.favouriteArtists.push(artists[0])
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(404).send(e)
    }
})

// unlike a track 
router.delete('/music/unlike/track/:id', auth, async (req, res) => {
    try {
        req.user.favouriteSongs = req.user.favouriteSongs.filter(track => track._id != req.params.id)
        await req.user.save()
        res.send()
    } catch(error) {
        res.status(500).send(error)
    }  
})

// unlike an artist 
router.delete('/music/unlike/artist/:id', auth, async (req, res) => {
    try {
        req.user.favouriteArtists = req.user.favouriteArtists.filter(artist => artist._id != req.params.id)
        await req.user.save()
        res.send()
    } catch(error) {
        res.status(500).send(error)
    }  
})

// get popular music tags
router.get('/tags', auth, async (req, res) => {
    try {
        payload['method'] = 'tag.getTopTags'
        const response = await axios({
            method: 'get',
            url: URL,
            params: payload,
            headers: {'user-agent': 'q1ra'}
        })
        //console.log(response.data.toptags)
        const tags = response.data.toptags.tag.map((tag) => tag.name)
        res.send(tags)
    } catch(e) {
        res.status(404).send(e)
    }    
})

// get songs from tag
router.get('/tags/:tag', auth, async (req, res) => {
    try {
        payload['limit'] = req.query.limit || DEFAULT_LIMIT
        payload['method'] = 'tag.getTopTracks'
        payload['tag'] = req.params.tag
        const response = await axios({
            method: 'get',
            url: URL,
            params: payload,
            headers: {'user-agent': 'q1ra'}
        })
        console.log(response.data.tracks.track)
        const songs = response.data.tracks.track.map((tag) => {
            return {
                name: tag.name,
                artist: tag.artist.name
            }
        })
        res.send(songs)
    } catch(e) {
        res.status(404).send(e)
    }   
})


module.exports = router