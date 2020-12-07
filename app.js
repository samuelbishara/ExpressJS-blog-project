const express = require('Express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const lodash = require('lodash');
const mongoose = require('mongoose');

const aboutStartingContent = 'Aliquam erat volutpat. Vestibulum at faucibus nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam non maximus quam, et vehicula metus. Curabitur at tristique ante, a ultricies nisl. Quisque feugiat porttitor risus, quis tincidunt ligula mollis at. Nam pellentesque sed elit quis tincidunt. In accumsan egestas sagittis. In gravida lacus orci, vitae congue est ultricies ac. Fusce lacus risus, eleifend vel venenatis at, congue nec velit. Vivamus tempus vulputate tristique. Proin sed accumsan tortor. Cras lacinia elementum tellus, in mollis nibh egestas vel. Cras porta magna ac est molestie, non vehicula enim lacinia.'
const contactStartingContent = 'Etiam ipsum mauris, tincidunt in lobortis eget, tristique fringilla urna. Praesent sem leo, convallis id congue vel, posuere at nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu erat vitae odio sodales imperdiet. Morbi id ultrices elit. Aenean sit amet sollicitudin elit. Fusce vestibulum posuere lectus, vitae lacinia nibh facilisis ac. Aenean ut erat sit amet erat lacinia tincidunt. Praesent in rutrum sapien. Sed elit orci, rutrum id dignissim viverra, pellentesque vitae metus. Integer a sagittis lacus.'


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