const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const passportConfig = require('./passport');

dotenv.config();
const app = express();
db.sequelize
  .sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
passportConfig();

app.use(morgan('dev'));
app.use(
  cors({
    origin: true, // 'https://nodebird.com'
    credentials: true,
  }),
);
app.use('/', express.static(path.join(__dirname, 'uploads')));
// 프론트에서 axios.post로 보낸 데이터를 해석해서 req.body에 넣어준다.
app.use(express.json()); // 프론트에서 axios로 json 형식으로 데이터를 보냈을 때
app.use(express.urlencoded({ extended: true })); // 폼 submit을 했을 때 urlencoded 방식으로 데이터를 넘어왔을 때

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/post', postRouter);
app.use('/posts', postsRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(3065, () => {
  console.log('서버 실행 중');
});
