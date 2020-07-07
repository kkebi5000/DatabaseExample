var express = require('express');
var path = require('path');
var http = require('http');
var static = require('serve-static');
var bodyParser=require('body-parser');
var cookieParser= require('cookie-parser');
var expressSession = require('express-session');
var expressErrorHandler = require('express-error-handler');

var mysql = require('mysql');

//연결객체 설정. 이 pool객체로 adduser, authenticate등을 한다.
var pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'admin',
    database:'test',
    debug:false
});

/*
//암호화모듈
var crypto = require('crypto');

//mongodb모듈 안에는 MongoClient라는 객체가 있다.
//var MongoClient = require('mongodb').MongoClient;

//mongodb모듈 대신 mongoose모듈 사용
var mongoose = require('mongoose');

var database;

//미리 선언을 해두면 다른곳에서 사용할수도 있다.
var UserSchema;
var UserModel;


//connectDB()메소드를 호출하면 mongoDB와 연결된다.
function connectDB(){
    
    //cmd창에서 mongod(mongo의 서버와 비슷)를 실행할때 포트번호가 27017 이라는것을 알았다.데이터베이스 url은 다음과같다
    var databaseUrl = 'mongodb://localhost:27017/local';
    
    //데이터베이스 연결이 될때 콜백함수가 실행된다.
    MongoClient.connect(databaseUrl, function(err,client){
        if(err){
            console.log('데이터베이스 연결시 에러 발생함');
            return;
        } 
        
        console.log('데이터베이스에 연결됨.' + databaseUrl);
        
        //위에서 변수만 선언한 database에 파라미터로 받은 db객체를 할당해준다.
        database = client.db('local');
    });
    
    //mongoose가 Promise를 사용하기 때문에 이렇게 할당해준것이다.mongoose라는 모듈이 이렇게 해달라해서 해주는것.
    mongoose.Promise = global.Promise;
    
    //mongodb 모듈보다 간단해진 것을 알 수 있다.
    mongoose.connect(databaseUrl);
    
    //mongoose에는 connection이라는 객체가 있다.언제 연결이 되었는지 확인해야하는데 확인할 수 있는 방법을 이벤트로 제공해준다.
    database = mongoose.connection;
    
    //database.on()함수는 이벤트 발생에 대한 함수를 처리할수 있다. 매개변수로 open을 넣으면 데이터베이스 연결이 되었을때 호출된다.mongoose.connection.on()과 같다.
    database.on('open', function(){
        console.log('데이터베이스에 연결됨 : ' +databaseUrl);
        
        //스키마 정의함수. create table sql과 비슷하다.
        UserSchema = mongoose.Schema({
            id: {type:String,required:true, unique:true, 'default':''}, 
            hashed_password: {type:String,required:true,'default':''},
            salt:{type:String, required:true},
            name: {type:String, index:'hashed', 'default':''},
            age:{type:Number, 'default':-1},
            created_at:{type:Date, index:{unique:false}, 'default':Date.now()},
            updated_at:{type:Date, index:{unique:false}, 'default':Date.now()}
        });
        console.log('UserSchema 정의함.');
        
        //password속성이 들어오면 set get함수 실행
        UserSchema.virtual('password').set(function(password){
            //여기서 this는 UserSchema를 뜻한다. salt칼럼 추가
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);
            console.log('virtual password 저장됨 : '+this.hashed_password);
        });
        
        //plainText : 가상 패스워드
        UserSchema.method('encryptPassword',function(plainText,inSalt){
            if(inSalt){
                //크립토 암호화 모듈의 sha1과 digest알고리즘을 구현하고 있다.
                return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
            } else{
                return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
            }
        });
        
        UserSchema.method('makeSalt',function(){
            return Math.round((new Date().valueOf() * Math.random())) +'';
        });
        
        UserSchema.method('authenticate', function(plainText, inSalt, hashed_password ){
            //salt값이 넘어온경우
            if(inSalt){
                console.log('authenticate 호출됨.');
                return this.encryptPassword(plainText, inSalt) === hashed_password;
            } else{
                console.log('authenticate 호출됨.');
                return this.encryptPassword(plainText) === hashed_password;
            }
        });
        
        //static으로 전역함수 등록. 여기서 정의한 함수는 모델에서 샤용할수 있다.
        UserSchema.static('findById', function(id, callback){
            //this= UserSchema. 실제 사용되는곳은 UserModel이다.id칼럼값으로 id파라미터인것을 찾고 결과를 callback으로 보내고있다. 
            return this.find({id:id},callback);
        });
        
        //위와같이 객체를 생성할수도 있지만 아래와같이 속성을 추가하는 식으로도 만들수 있다.
        UserSchema.statics.findById = function(id,callback){
            //자바스크립트의 this는 함수를 호출한 객체가 this가 된다. 따라서 UserSchema가 this가 아닐수 있다.find함수를 쓰는것으로 보아 this는 model인것 같다.
            return this.find({id:id},callback);
        };
        
        UserSchema.static('findAll', function(callback){
            return this.find({}, callback);
        });
        
        //users 컬렉션을 위에서 정의한 스키마와 타입연결을 해준다.
        UserModel = mongoose.model('users3', UserSchema);
        
        console.log('UserModel 정의함.');
        
    });
    
    database.on('disconnected', function(){
        console.log('데이터베이스 연결 끊어짐');
    });
    
    //콜백함수를 쓸수도 있지만 console.error.bind(console, parameter)을 쓸 수도 있다.여기까지 함으로써 mongodb로 연결하던것을 mongoose로 연결하였다.
    database.on('error',console.error.bind(console, 'mongoose 연결 에러'));
}*/

var app = express();

app.set('port',process.env.PORT || 3000);
app.use('/public', static(path.join(__dirname, 'public')));

//post로 요청이 오는것을 받을수 있도록 함
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cookie와 session을 사용가능하도록 함
app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true,
    
}));

var router = express.Router();


router.route('/process/login').post(function(req,res){
    console.log('/process/login 라우팅함수 호출됨');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password; 
    
    console.log('요청 파라미터 : ' +paramId + ',' + paramPassword)
    
    
    authUser(paramId, paramPassword, function(err, rows){
       if(err){
           console.log('에러발생');
           res.writeHead(200,{"Content-Type" : "text/html; charset=utf8"});
           res.write("<h1>에러 발생</h1>");
           res.end();
           return;
       } 
       if(rows){
            //console.dir(docs);
            res.writeHead(200,{"Content-Type" : "text/html; charset=utf8"});
            res.write("<h1>사용자 로그인 성공</h1>");
            res.write("<div><p>사용자 : "+rows[0].name+"</p></div>");
            res.write("<br><br><a href = '/public/login.html'>다시 로그인하기</a>")
            res.end();
        } else {
           console.log('에러발생');
           res.writeHead(200,{"Content-Type" : "text/html; charset=utf8"});
           res.write("<h1>사용자 데이터 조회 안됨.</h1>");
           res.end();
        }
    });
    
});

//회원가입 라우팅함수. 로그인 라우팅함수랑 비슷하다.
router.route('/process/adduser').post(function(req,res){
    console.log('/process/adduser라우팅함수 호출됨.');
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramAge = req.body.age || req.query.age;
    
    console.log('요청 파라미터 : ' + paramId + ',' + paramPassword + ',' + paramName +','+paramAge);
    
   var age = Number(paramAge);
    addUser(paramId,paramPassword,paramName,paramAge,function(err,result){
        if(err){
            console.log('에러발생');
            res.writeHead(200,{
                "Content-type" : "text/html;charset=utf8"
            });
            res.write('<h1>에러발생</h1>');
            res.end();
            return;
        }
        if(result){
            console.dir(result);
            
            res.writeHead(200,{"Content-type":"text/html;charset=utf8"});
            res.write('<h1>사용자 추가 성공</h1>');
            res.write('<div><p>사용자 : ' +paramName+'</p></div>');
            res.end();
            
        } else {
            console.log('에러 발생.');
            res.writeHead(200,{"Content-type":"text/html;charset=utf8"});
            res.write('<h1>사용자 추가 실패</h1>');
            res.end();
        }
    });
    
    /*
    if(database){
        addUser(database,paramId,paramPassword,paramName,function(err,result){
            if(err){
                console.log('에러발생');
                res.writeHead(200,{
                    "Content-type" : "text/html;charset=utf8"
                });
                res.write('<h1>에러발생</h1>');
                res.end();
                return;
            }
            if(result){
                console.dir(result);
                
                res.writeHead(200,{"Content-type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 성공</h1>');
                res.write('<div><p>사용자 : ' +paramName+'</p></div>');
                res.end();
            } else{
                console.log('에러 발생.');
                
                res.writeHead(200,{"Content-type":"text/html;charset=utf8"});
                res.write('<h1>사용자 추가 안됨.</h1>');
                res.end();
            }
        });
    } else {
        console.log('에러발생');
        res.writeHead(200,{"Content-Type" : "text/html; charset=utf8"});
        res.write("<h1>데이터베이스 연결 안됨.</h1>");
        res.end();
    }
    */
});

router.route('/process/listuser').post(function(req,res){
    console.log('/process/listuser라우팅함수 호출됨.');
    
    if(database){
        UserModel.findAll(function(err,results){
            if(err){
                console.log('에러발생');
                res.writeHead(200,{
                    "Content-type" : "text/html;charset=utf8"
                });
                res.write('<h1>에러발생</h1>');
                res.end();
                return;
            }
            
            if(results){
                console.dir(results);
                
                res.writeHead(200,{
                    "Content-type":"text/html;charset=utf8"
                });
                res.write('<h3>사용자리스트</h3>');
                res.write('<div><ul>');
                
                for(var i = 0; i<results.length;i++){
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write('    <li>#' +i +" -> " + curId + ","+curName+"</li>");
                }
                
                res.write("</ul></div>");
                res.end();
            } else{
                console.log('에러 발생.');
                
                res.writeHead(200,{"Content-type":"text/html;charset=utf8"});
                res.write('<h1>조회된 사용자 없음.</h1>');
                res.end();
            }
        });
    } else {
        console.log('에러발생');
        res.writeHead(200,{"Content-Type" : "text/html; charset=utf8"});
        res.write("<h1>데이터베이스 연결 안됨.</h1>");
        res.end();
    }
});

app.use('/', router);




//node.js는 비동기방식을 선호하기때문에 코드를 단순화시키기위해 별도의 함수로 만들어주는것이 좋다.
var authUser = function(id, password, callback){
    console.log('authUser 호출됨.'+id+','+password);
    
    pool.getConnection(function(err,conn){
        if(err){
            if(conn){
                conn.release();
            }
            callback(err,null);
            return;
        }
        console.log('데이터베이스 연결스레드 아이디 : '+ conn.threadId);
        
        var tablename = 'users';
        var columns = ['id','name','age'];
        var exec = conn.query('select ?? from ?? where id = ? and password = ?', [columns, tablename, id , password], function(err,rows){
            conn.release();
            console.log('실행된 sql : ' +exec.sql);
            
            if(err){
                callback(err,null);
                return;
            }
            
            if(rows.length>0){
                console.log('사용자 찾음.');
                callback(null,rows);
                
            } else{
                console.log('사용자 찾지 못함.');
                callback(null,null);
            }
            
        });
    });
    
    /*
    //내가 정의한 함수 findById
    UserModel.findById(id, function(err,results){
        if(err){
            callback(err,null);
            return;
        }
        
        console.log('아이디 %s로 검색됨.');
        if(results.length>0){
            var user = new UserModel({id:id});
            
            //위에서 정의한 UserModel의 메소드
            var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
            
            if(results[0]._doc.password === password){
                console.log('비밀번호 일치함.');
                callback(null,results);
            }else{
                console.log('비밀번호 일치하지 않음.');
                callback(null,null);
            }
        } else{
            console.log('아이디 일치하는 사용자 없음.');
            callback(null,null);
        }
    });
    
    //UserModel로 데이터 조작이 가능하다.mongodb와 비슷하게 생긴  mongoose의 find함수. 차이가 있다면 mongodb는 단순 컬렉션을 참조하지만 mongoose는 스키마 정의된 컬렉션을 참조한다.
    UserModel.find({"id":id, "password":password}, function(err,docs){
        if(err){
            callback(err,null);
            return;
        }
        if(docs.length > 0){
            console.log('일치하는 사용자를 찾음');
            
             //err=null
            callback(null,docs);
        }else{
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null,null);
        }
    });
    
    
    //명령프롬프트를 이용해 users라는 컬렉션을 만들었다. mongo에서 컬렉션은 oracle의 table과 비슷하다.
    var users = db.collection('users');
    console.log(db.collection('users'));
    
    
    
    
   //찾고자 하는 정보를 불러와서 배열로 바꿔준다.이 배열을 처리하려면 callback함수를 넣어주면 된다.docs는 하나의 레코드와 같다. 
    users.find({"id":id,"password":password}).toArray(function(err,docs){
        if(err){
            
            //에러가 발생하면 클라이언트가 알수 있도록 callback으로 던져준다. docs = null
            callback(err,null);
            return;
        }
        
        if(docs.length > 0){
            console.log('일치하는 사용자를 찾음');
            
             //err=null
            callback(null,docs);
        }else{
            console.log('일치하는 사용자를 찾지 못함.');
            callback(null,null);
        }
    });
    */
};
/*
    //insert 함수 만들기. 로그인하는 함수랑 비슷하다.
var addUser = function(db,id,password,name,callback){
    console.log('addUser 호출됨 : '+id+','+password+','+name);
    
    //한명의 user정보를 가진 객체를 만듦.
    var user = new UserModel({"id":id, "password":password,"name":name});
    
    //만든 객체를 저장. 저장이 정상적으로 됐는지 콜백함수로 확인
    user.save(function(err){
        if(err){
            callback(err,null);
        return;
        }
        
        console.log('사용자데이터 추가함.');
        callback(null,user);
    });
    
    var users = db.collection('users');
    users.insertMany([{"id":id,"password":password,"name":name}],function(err,result){
        if(err){
            callback(err,null);
            return;
        }
        
        if(result.insertedCount>0){
            console.log('사용자 추가됨 : ' + result.insertedCount);
            callback(null,result);
        } else{
            console.log('추가된 레코드가 없음');
            callback(null,null);
        }
    });
};

*/

var addUser  = function(id, name , age, password, callback){
    console.log('addUser 호출됨.');
    
    pool.getConnection(function(err, conn){
        if(err){
            if(conn){
                conn.release();
            }
            callback(err,null);
            console.dir(err);
            return;
        }
        console.log('데이터베이스 연결의 스레드 아이디 : '+ conn.threadId);
        
        var data = {id:id, name:name, age:age, password:password};
        
        //sql문 사용 가능하게 하는 query함수. 리턴되는것을 exec변수로 받아서 sql이 어떻게 실행됐는지 확인할수 있다.
        var exec = conn.query('insert into users set ?',data,function(err,result){
            conn.release();
            console.log('실행된 sql : '+ exec.sql);
            
            if(err){
                console.log('sql 실행시 에러발생.');
                callback(err,null);
                return;
            }
            
            callback(null,result);
        });
        
    });
};


//404에러 페이지 처리
var errorHandler = expressErrorHandler({
    static:{
        '404':'./public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('익스프레스로 웹서버를 실행함 : '+ app.get('port'));
    //웹서버가 정상적으로 실행이 되는것을 확인한 후 데이터베이스를 연결해준다.데이터베이스를 먼저 연결해도 상관없다.
    //connectDB();
});
