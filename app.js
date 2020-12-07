const express = require('Express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const lodash = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/blogDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const postSchema = {
    title: String,
    content: String
}
const Post = mongoose.model("Post", postSchema);

app.get('/', (req, res) => {
    Post.find({}, (e, foundItems) => {
        res.render('home', {
            homeLorumIpsum: homeStartingContent,
            postsArray: foundItems
        });
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        aboutLorumIpsum: aboutStartingContent
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        contactLorumIpsum: contactStartingContent
    })
});

app.get('/compose', (req, res) => {
    res.render('compose')
});
app.get('/posts/:postId', (req, res) => {
    const requestedPostId = req.params.postId;
    Post.find({
        _id: requestedPostId
    }, function (err, post) {
        res.render("post", {post: post});
        //or: res.render("post", postTitle: post.title, postBody: post.content)
    })
});

app.post('/compose', (req, res) => {
    const postTitle = req.body.postTitle;
    const postBody = req.body.postBody;
    const post = new Post({
        title: postTitle,
        content: postBody
    });
    if (postTitle.length > 0 && postBody.length > 0) {
        post.save();
    }
    res.redirect('/');
});

app.post('/delete', (req, res) => {
    const postId = req.body.deletePost;
    Post.findByIdAndRemove(postId, (e) => {
        if (e) {
            console.log(e);
        }else {
            console.log("Item deleted successfully!");
            res.redirect('/');
        }
    })
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
})