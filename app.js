const express = require('Express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const lodash = require('lodash');

const homeStartingContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nunc tellus, imperdiet ac sapien sit amet, porta aliquet orci. Nunc ac pretium quam, ut luctus purus. Aliquam turpis magna, mollis varius sollicitudin quis, suscipit quis nisi. Integer neque ipsum, porttitor eleifend eros lacinia, commodo interdum lectus. Cras vitae laoreet quam. Nullam fermentum elit in pharetra gravida. In eu elit congue, volutpat urna vel, tincidunt sem. Quisque pretium augue sit amet ante imperdiet sagittis. Sed iaculis neque quam, et suscipit nunc lobortis eu. Maecenas pretium finibus ligula, a lobortis elit vulputate et. Donec nec quam et nibh vestibulum egestas.'
const aboutStartingContent = 'Aliquam erat volutpat. Vestibulum at faucibus nisl. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam non maximus quam, et vehicula metus. Curabitur at tristique ante, a ultricies nisl. Quisque feugiat porttitor risus, quis tincidunt ligula mollis at. Nam pellentesque sed elit quis tincidunt. In accumsan egestas sagittis. In gravida lacus orci, vitae congue est ultricies ac. Fusce lacus risus, eleifend vel venenatis at, congue nec velit. Vivamus tempus vulputate tristique. Proin sed accumsan tortor. Cras lacinia elementum tellus, in mollis nibh egestas vel. Cras porta magna ac est molestie, non vehicula enim lacinia.'
const contactStartingContent = 'Etiam ipsum mauris, tincidunt in lobortis eget, tristique fringilla urna. Praesent sem leo, convallis id congue vel, posuere at nibh. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eu erat vitae odio sodales imperdiet. Morbi id ultrices elit. Aenean sit amet sollicitudin elit. Fusce vestibulum posuere lectus, vitae lacinia nibh facilisis ac. Aenean ut erat sit amet erat lacinia tincidunt. Praesent in rutrum sapien. Sed elit orci, rutrum id dignissim viverra, pellentesque vitae metus. Integer a sagittis lacus.'

let posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('home', {homeLorumIpsum: homeStartingContent, postsArray: posts})
    console.log(posts);
});

app.get('/about', (req, res) => {
    res.render('about', {aboutLorumIpsum: aboutStartingContent});
});

app.get('/contact', (req, res) => {
    res.render('contact', {contactLorumIpsum: contactStartingContent})
});

app.get('/compose', (req, res) => {
    res.render('compose')
});
app.get('/posts/:selectedPost', (req, res) => {
    const selectedTitle = lodash.lowerCase(req.params.selectedPost);
    posts.forEach((post) => {
        const storedTitle = lodash.lowerCase(post.title);
        if (storedTitle === selectedTitle){
            res.render('post', {
                postTitle: post.title, 
                postBody: post.body})
        }
    })
});

app.post('/compose', (req, res) => {
    const postTitle = req.body.postTitle;
    const postBody = req.body.postBody;
    const post = {
        title: postTitle,
        body: postBody
    }
    posts.unshift(post)
    res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
})