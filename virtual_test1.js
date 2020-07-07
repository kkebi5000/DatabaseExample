var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

function connectDB(){
    var databaseUrl = "mongodb://localhost:27017/local";
    
    mongoose.Promise= global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;
    
    database.on('open', function(){
        console.log('데이터베이스에 연결됨 : '+databaseUrl);
        
        //복잡해보이기때문에 아래에서 따로 정의.
        createUserSchema();
        
        doTest();
    });
    
    database.on('disconnect', function(){
        console.log('데이터베이스 연결 끊어짐.')
    });
    
    database.on('error', console.error.bind(console, 'mongoose 연결 에러.'));
}

function createUserSchema(){
    UserSchema = mongoose.Schema({
        id: {type:String,required:true, unique:true}, 
        name: {type:String, index:'hashed'},
        age:{type:Number, 'default':-1},
        created_at:{type:Date, index:{unique:false}, 'default':Date.now()},
        updated_at:{type:Date, index:{unique:false}, 'default':Date.now()}
    });
    console.log('UserSchema 정의함.');
    
    //info속성(파라미터)를 받으면 실행되는 get set 함수
    UserSchema.virtual('info').set(function(info){
        var splitted = info.split(' ');
        this.id = splitted[0];
        this.name = splitted[1];
        console.log('virtual info 속성 설정됨 : '+ this.id + ', ' + this.name);
    }).get(function(){
        return this.id + ' ' + this.name
    });
    
    UserModel = mongoose.model('users4', UserSchema);
    console.log('UserModel 정의함.');
}

function doTest(){
    
    //공백으로 들어간 아이디와 이름. info로 넣었기 때문에 위의 get set 함수가 실행된다.
    var user = new UserModel({"info":"test01 소녀시대"});
    
    user.save(function(err){
        if(err){
            console.log('에러발생');
            return ;
        }
        console.log('데이터 추가함.');
    });
    
}

connectDB();




