const router = require('express').Router();
const db = require('../db');

router.post('/', (req, res) => {
    console.log('SOMETHING IN POST POST')
    if (!req.body.title || !req.body.contents) {
        res.send("NOT WORKING")
    } else {
        db.insert(req.body)
        .then(id => {
            res.status(201).json(req.body);
        })
        .catch(err => {
            res.status(500).json({error: "There was an error while saving the post to the database", err});
        })
    }
});

router.post('/:id/comments', (req, res) => {
    const {id} = req.params;
    const {text} = req.body;
    // const body = req.body;
    // body.post_id = req.params.id;
    const object = {
        text: text,
        post_id: id
    }


    if (!text) {
        res.status(400).json({errorMessage: "Please provide text for the comment."})
    }

    db.findById(id)
    .then(post => {
        if (post.length > 0) {
            db.insertComment(object)
            .then(id => {
                res.status(201).json(id);
            })
            .catch(err => {
                res.status(404).json(err);
            })
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(err => {
        res.status(500).send("Some server issue is happening...", err);
    })

});


router.get('/:id', (req, res) => {
    const {id} = req.params;

    db.findById(id)
    .then(post => {
        if (post.length > 0) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    })
    .catch(err => {
        res.status(500).json({error: "The post information could not be retrieved.", err})
    })
});

router.delete('/:id', (req, res) => {
    const {id} = req.params;

    db.findById(id)
    .then(post => {
        if (post.length > 0) {
            db.remove(id)
            .then(records => {
                res.json(records);
            })
            .catch(err => {
                res.status(500).json({error: "The post could not be removed"}, err);
            })
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."});
        }
    })
    .catch(err => {
        res.status(500).send('Error in finding post!', err)
    })
});


router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {title, contents} = req.body;

    const changes = {
        title: title,
        contents: contents
    }

    if (!title || !contents) {
        res.status(400).json({errorMessage: "Please provide title and contents for the post."});
    } else {
        db.findById(id)
        .then(post => {
            if (post.length > 0) {
                db.update(id, changes)
                .then(record => {
                    db.findById(id)
                    .then(post => {
                        if (post.length > 0) {
                            res.status(200).json(post)
                        } else {
                            res.status(500).json(err)
                        }
                    })
                    .catch(err => {
                        res.status(404).json({message: "The post with the specified ID does not exist."});
                    })
                    // res.status(200).json(record);
                })
                .catch(err => {
                    res.status(500).json({error: "The post information could not be modified.", err})
                })
            } else {
                res.status(404).json({message: "The post with the specified ID does not exist."});
            }
        })
        .catch(err => {
            res.status(404).json({message: "The post with the specified ID does not exist."});
        })
    }
});



module.exports = router;
