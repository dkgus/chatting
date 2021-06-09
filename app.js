/**
 *  app.js는 서버
 *  index.js 클라이언트로
 *  소켓사용시 두 가지가 모두 수정되어야한다.
 * 
 */




/**
 *  필요 모듈을 require로 가져와 변수에 담는다
 *  http모듈은 node.js 의 기본내장 모듈이기 때문에 따로 다운 하지않아도 사용가능 
 * 
*/ 


const express = require("express");
const http =require("http");
const app = express();
const path = require("path");
const server = http.createServer(app);//http모듈은 서버생성 메소드인 createServer를 제공하며
// 파라미터로 익스프레스를 넘겨준다. 그리고 이것을 통해 express로 서버를 생성한다.
//파라미터로 전달하여 실행하면 그만일텐데 server변수에 담는 이유는 
//http.createServer();메소드는 서버를 생성하는 작업을 하고난 후 생성한
//서버객체를 리턴해주기 때문이다. 그리고 그 생성된 서버를 제어하기위해 server변수에 담는다


const socketIO =require("socket.io");
const moment = require("moment");

const io = socketIO(server);


//src폴더 하위로 index.html을 생성했기때문에
//express객체가 src폴더에 접근할 수 있도록 설정해줘야한다
//이 작업을 실행하지않으면 http://주소/src/index.html로접근하려했을때
//엑세스가 거부된다. 
//express의 use메소드를통해 정적 파일을 설정해주고
//파라미터에는 express.static 미들웨서 함수를 사용하여 경로를 설정하여 전달
app.use(express.static(path.join(__dirname,"src")));


const PORT =process.env.PORT || 5000;



/**
 *  on메소드를 통해 이벤트를 바인딩 할 수 있으며, emit메소드를 통해 이벤트를 호출할 수 있다.
 *  on은 수신 emit은 발신으로 생각하면 쉬움
 * 
 */
io.on("connection", (socket)=>{ //connection의 콜백함수를 보면 socket인자가전달되어오는데
                                // socket은 접속된 해당 소켓의 객체
                                //소켓 연결중 어떠한 이벤트를 바인딩 하고싶다면  connection의 콜백함수 스코프 내부에
                                //이벤트 리스너들을 작성하면 된다
    
    
        socket.on("chatting",(data)=>{ //이때 on에서 설정한 이 chatting이라는 주제로 들어오느 메시지에만 반응해 출력하도록 하는것
        console.log(data);
        const {name,msg}= data;
        io.emit("chatting", {//실제전송시에는 emit을 사용
            name,
            msg,
            time: moment(new Date()).format("h:mm A")
        });
        
    })
})


server.listen(PORT, () => console.log(`server is running ${PORT}`));
//생성된 서버를 사용자가 웹에서 확인할 수 있게 합니다.
//listen메소드를 사용하여 port설정한다