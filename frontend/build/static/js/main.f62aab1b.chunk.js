(this.webpackJsonpidcompare=this.webpackJsonpidcompare||[]).push([[0],{126:function(e,t,a){e.exports=a(586)},131:function(e,t,a){},54:function(e,t){},583:function(e,t,a){},586:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(26),l=a.n(o),i=(a(131),a(41)),s=a(7),c=a(593),m=a(594),u=a(21),d=a(22),h=a(42),p=a(14),g=a(24),f=a(25),y=a(589),E=a(590),v=a(115),b=a(591),k=a(596),S=a(61),T=a.n(S),C=a(34),w=a.n(C),_=a(114),I=a.n(_),P="https://interverify.co",j="34d614b8c18543abd81f338aaeb7b0de",O={siteUrl:P,idme:{cliendId:j,clientSecret:"949e15f3b1dace8c2a3c685032d4e28d",redirectUrl:"https://interverify.co/idme_code",authEndPoint:"https://api.id.me/oauth/authorize?client_id="+j+"&redirect_uri=https://interverify.co/idme_code&response_type=token&scope=loa3"},aws:{accessKey:"AKIAVJKPVCLEKM2YG33J",secretKey:"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",region:"us-east-2",bucket:"idauth"},api:{verifyID:"/verifyID",getUser:"/api/getUser",registerUser:"/api/registerUser",sendMail:"/api/sendMail",sendResultMail:"/api/sendResultMail",updateUserInfo:"/api/updateUserInfo"}},U=a(595),x={width:1280,height:720,facingMode:"user"},M={width:1280,height:720,facingMode:{exact:"environment"}},B=function(e){Object(f.a)(a,e);var t=Object(g.a)(a);function a(e){var n;Object(u.a)(this,a),n=t.call(this);var o=new URLSearchParams(e.location.search).get("token");if(!o)return window.location.href="/",Object(h.a)(n);var l=parseInt(o.substr(-1))-8;o=o.substr(0,o.length-1),n.webcamRef=r.a.createRef(),n.state={userToken:o,authStep:l,verifyURL:O.siteUrl+O.api.verifyID+"?token="+o+"9",isPhotoTaken:!1,imageSrc:"",photo_source:"",photo_target:"",uploadedPhoto:"",uploadedId:"",blob:"",resultMsg:"",msgColor:"black",resultBtnStatus:0,uploadingProgress:0,showLoadingIcon:{display:"none"},apiTmr:0},n.photoCapture=n.photoCapture.bind(Object(p.a)(n)),n.photoTake=n.photoTake.bind(Object(p.a)(n)),n.comparePhoto=n.comparePhoto.bind(Object(p.a)(n)),n.navToVerify=n.navToVerify.bind(Object(p.a)(n));var i=n.getMobileOperatingSystem();return"Android"!=i&&"iOS"!=i||(x=M),n}return Object(d.a)(a,[{key:"getMobileOperatingSystem",value:function(){var e=navigator.userAgent||navigator.vendor||window.opera;return/windows phone/i.test(e)?"Windows Phone":/android/i.test(e)?"Android":/iPad|iPhone|iPod/.test(e)&&!window.MSStream?"iOS":/JavaFX/.test(e)?"JavaFx":"unknown"}},{key:"componentDidMount",value:function(){var e=this,t=this.state.userToken;fetch(O.api.getUser,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({token:t})}).then((function(e){return e.json()})).then((function(t){t.status&&(e.state.photo_source=t.data.id+"_face.jpg",e.state.photo_target=t.data.id+"_id.jpg"),e.setState({uploadedPhoto:t.data.verify_photo,uploadedId:t.data.verify_idcard})})),clearInterval(this.state.apiTmr),t&&(this.state.apiTmr=setInterval((function(){e.state.uploadedId?clearInterval(e.state.apiTmr):fetch(O.api.getUser,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({token:t})}).then((function(e){return e.json()})).then((function(t){e.setState({uploadedPhoto:t.data.verify_photo,uploadedId:t.data.verify_idcard}),t.data.verify_idcard&&clearInterval(e.state.apiTmr)}))}),3e3))}},{key:"photoTake",value:function(){var e=this.state.isPhotoTaken,t="";e||(t=this.webcamRef.current.getScreenshot())?(this.setState({isPhotoTaken:!e,imageSrc:t}),console.log("--------- imageSrc")):this.setState({msgColor:"red",resultMsg:"Camera is not connected!!",imageSrc:""})}},{key:"photoCapture",value:function(){var e=this,t=this.state,a=t.authStep,n=t.userToken,r=t.imageSrc,o=this.state,l=o.photo_source,i=o.photo_target;w.a.config.update({accessKeyId:O.aws.accessKey,secretAccessKey:O.aws.secretKey,region:O.aws.region});var s=new w.a.S3({params:{Bucket:O.aws.bucket}}),c=l;1===a&&(c=i),r=this.dataURItoBlob(r);var m=new File([r],c),u={Key:m.name,ContentType:"image/jpeg",Body:m};e.setState({msgColor:"black",resultMsg:"",uploadingProgress:.1}),s.putObject(u,(function(t,r){if(t)return alert(t.message),!1;var o={verify_photo:c};1===a&&(o={verify_idcard:c}),o.token=n,fetch(O.api.updateUserInfo,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify(o)}).then((function(e){return e.json()})).then((function(t){t.status&&(e.setState({msgColor:"black",resultMsg:"Uploading done."}),console.log("-------- uploaded: ",t),setTimeout((function(){e.setState({authStep:0,resultMsg:"",imageSrc:"",isPhotoTaken:!1,resultBtnStatus:0,uploadingProgress:0})}),1e3)),console.log("data",t.data)}))})).on("httpUploadProgress",(function(t){console.log("---- uploading progress: ",t),console.log("---- uploading progress: ",t.loaded/t.total*100);var a=parseInt(t.loaded/t.total*100);e.setState({uploadingProgress:a})}))}},{key:"navToVerify",value:function(){var e=this,t=this.state.userToken;this.setState({showLoadingIcon:{display:"inline-block"}}),fetch(O.api.getUser,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({token:t})}).then((function(e){return e.json()})).then((function(t){if(t.status){var a="";if(t.data.verify_idcard||(a="You didn't upload id card photo."),t.data.verify_photo||(a="You didn't upload face photo."),a)return void e.setState({msgColor:"red",resultMsg:a});e.setState({photo_source:t.data.verify_photo,photo_target:t.data.verify_idcard}),e.comparePhoto()}else e.setState({msgColor:"red",resultMsg:"Server connection failed."})}))}},{key:"dataURItoBlob",value:function(e){for(var t=atob(e.split(",")[1]),a=e.split(",")[0].split(":")[1].split(";")[0],n=[],r=0;r<t.length;r++)n.push(t.charCodeAt(r));return new Blob([new Uint8Array(n)],{type:a})}},{key:"comparePhoto",value:function(){var e=this,t=e.state,a=t.resultBtnStatus,n=t.userToken;if(a)e.setState({authStep:0,resultBtnStatus:0,showLoadingIcon:{display:"none"}});else{var r=O.aws.bucket,o=this.state,l=o.photo_source,i=o.photo_target;w.a.config.update({accessKeyId:O.aws.accessKey,secretAccessKey:O.aws.secretKey,region:O.aws.region});var s=new w.a.Rekognition,c={SourceImage:{S3Object:{Bucket:r,Name:l}},TargetImage:{S3Object:{Bucket:r,Name:i}},SimilarityThreshold:70};console.log("-- compare 0");try{s.compareFaces(c,(function(t,a){if(t)return console.log(t,t.stack),void e.setState({resultBtnStatus:1,msgColor:"red",resultMsg:"You didn't upload exact personal photo.",showLoadingIcon:{display:"none"}});a.FaceMatches.length?a.FaceMatches.forEach((function(t){t.Face.BoundingBox;var a=t.Similarity;fetch(O.api.updateUserInfo,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({token:n,verify_result:a})}).then((function(e){return e.json()})).then((function(t){t.status&&(console.log("-------- uploaded: ",t),fetch(O.api.sendResultMail,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({token:t.token,similarity:a})}).then((function(e){return e.json()})).then((function(t){console.log(t),t.status?window.location.href=t.data:e.setState({resultBtnStatus:1,msgColor:"red",resultMsg:t.data,showLoadingIcon:{display:"none"}})}))),console.log("data",t.data)}))})):e.setState({resultBtnStatus:1,msgColor:"red",resultMsg:"User and ID is not matched!",showLoadingIcon:{display:"none"}})}))}catch(m){e.setState({resultBtnStatus:1,msgColor:"red",resultMsg:"You didn't upload exact personal photo."}),console.log(m)}}}},{key:"render",value:function(){var e=this.state.authStep;return r.a.createElement(y.a,{style:{textAlign:"center"}},0===e&&r.a.createElement("div",null,r.a.createElement(E.a,{style:{marginTop:50}},r.a.createElement(v.a,null,r.a.createElement("h1",null,"Step 2. Verify Your Information"))),r.a.createElement(U.a,null),r.a.createElement(E.a,{style:{marginTop:30}},r.a.createElement(v.a,null,r.a.createElement("h4",null,"Your Face Photo"),r.a.createElement("img",{src:this.state.imageSrc,style:{marginBottom:6,display:this.state.isPhotoTaken?"inline-block":"none"}}),r.a.createElement(T.a,{style:{display:this.state.isPhotoTaken?"none":"inline-block"},videoConstraints:x,screenshotFormat:"image/jpeg",ref:this.webcamRef}),r.a.createElement("p",null,r.a.createElement(b.a,{variant:"primary",onClick:this.photoTake},this.state.isPhotoTaken?"Retake Photo":"Take A Photo"),r.a.createElement(b.a,{style:{marginLeft:30,display:this.state.isPhotoTaken?"inline-block":"none"},variant:"primary",onClick:this.photoCapture},"Upload"))),0===e&&r.a.createElement(v.a,null,r.a.createElement("h4",null,"Your ID card"),r.a.createElement(I.a,{value:this.state.verifyURL,size:256,level:"Q",includeMargin:!0}),r.a.createElement("p",null,r.a.createElement("a",{href:this.state.verifyURL},this.state.verifyURL)),this.state.uploadedId?r.a.createElement("p",{style:{color:"red"}},"ID has been submitted."):r.a.createElement("p",null,"Please scan this link and upload id card on your phone."))),r.a.createElement(U.a,null),r.a.createElement(E.a,{style:{marginTop:30}},r.a.createElement(v.a,null,r.a.createElement(b.a,{variant:"primary",onClick:this.navToVerify},r.a.createElement("i",{style:this.state.showLoadingIcon,className:"fa fa-spinner fa-spin"}),"Verify Information"))),this.state.uploadingProgress>0&&r.a.createElement("div",null,r.a.createElement(E.a,{style:{marginTop:30}},r.a.createElement(v.a,null),r.a.createElement(v.a,null,r.a.createElement(k.a,{now:this.state.uploadingProgress,label:this.state.uploadingProgress+"%",animated:!0})),r.a.createElement(v.a,null)))),1===e&&r.a.createElement("div",null,r.a.createElement(E.a,{style:{marginTop:50}},r.a.createElement(v.a,null,r.a.createElement("h1",null,"Upload Your ID Card"))),r.a.createElement(U.a,null),r.a.createElement(E.a,{style:{marginTop:30}},r.a.createElement(v.a,null,r.a.createElement("img",{src:this.state.imageSrc,style:{marginBottom:6,display:this.state.isPhotoTaken?"inline-block":"none"}}),r.a.createElement(T.a,{style:{display:this.state.isPhotoTaken?"none":"inline-block"},videoConstraints:x,screenshotFormat:"image/jpeg",ref:this.webcamRef}))),r.a.createElement(U.a,null),r.a.createElement(E.a,{style:{marginTop:30}},r.a.createElement(v.a,null,r.a.createElement("p",null,r.a.createElement(b.a,{variant:"primary",onClick:this.photoTake},this.state.isPhotoTaken?"Retake Photo":"Take A Photo"),r.a.createElement(b.a,{style:{marginLeft:30,display:this.state.isPhotoTaken?"inline-block":"none"},variant:"primary",onClick:this.photoCapture},"Upload")))),this.state.uploadingProgress>0&&r.a.createElement("div",null,r.a.createElement(E.a,{style:{marginTop:30}},r.a.createElement(v.a,null),r.a.createElement(v.a,null,r.a.createElement(k.a,{now:this.state.uploadingProgress,label:this.state.uploadingProgress+"%",animated:!0})),r.a.createElement(v.a,null)))),2===e&&r.a.createElement("div",null,r.a.createElement(E.a,{style:{marginTop:50}},r.a.createElement(v.a,null,r.a.createElement("h1",null,"Step 2. Verify Your Identity"))),r.a.createElement(U.a,null),r.a.createElement(E.a,{style:{marginTop:30}},r.a.createElement(v.a,null,r.a.createElement(b.a,{variant:"primary",onClick:this.comparePhoto},this.state.resultBtnStatus?"Upload again":"Verify")))),r.a.createElement(E.a,{style:{marginTop:30,marginBottom:30,color:this.state.msgColor}},r.a.createElement(v.a,null,this.state.resultMsg)),""!==this.state.blob&&r.a.createElement("img",{src:this.state.blob,alt:"blob"}))}}]),a}(r.a.Component),N=Object(s.f)(B),L=function(e){Object(f.a)(a,e);var t=Object(g.a)(a);function a(e){var n;return Object(u.a)(this,a),(n=t.call(this)).state={},n}return Object(d.a)(a,[{key:"goBack",value:function(){window.location.href="/"}},{key:"render",value:function(){return r.a.createElement(i.a,null,r.a.createElement(y.a,{style:{textAlign:"center"}},r.a.createElement("div",null,r.a.createElement(E.a,{style:{marginTop:150}},r.a.createElement(v.a,null,r.a.createElement("h2",null,"That info has been received and email has been sent to candidate. You can invite another candidate."))),r.a.createElement(E.a,{style:{marginTop:15}},r.a.createElement(v.a,null,r.a.createElement(b.a,{variant:"primary",onClick:this.goBack},"Go Back"))))))}}]),a}(r.a.Component),D=Object(s.f)(L),R=(a(583),a(584),a(592)),A=function(e){Object(f.a)(a,e);var t=Object(g.a)(a);function a(){var e;return Object(u.a)(this,a),(e=t.call(this)).state={userInfo:{candidate_name_first:"",candidate_name_last:"",candidate_email:"",date_of_interview:"",social_link:"",interviewer_name_first:"",interviewer_name_last:"",interviewer_email:""},isUploading:!1},e.registerUserData=e.registerUserData.bind(Object(p.a)(e)),e.handleChange=e.handleChange.bind(Object(p.a)(e)),e}return Object(d.a)(a,[{key:"componentDidMount",value:function(){console.log(O.api.getUsers)}},{key:"registerUserData",value:function(e){var t=this;e.preventDefault();var a=this.state,n=a.userInfo,r=a.isUploading;console.log("------ userInfo: ",n),r||(this.setState({isUploading:!0}),fetch(O.api.registerUser,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify(n)}).then((function(e){return e.json()})).then((function(e){e.status?fetch(O.api.sendMail,{headers:{"Content-Type":"application/json"},method:"POST",body:JSON.stringify({token:e.token})}).then((function(){t.setState({isUploading:!1}),window.location.href="/success"})):t.setState({isUploading:!1}),console.log("data",e.data)})))}},{key:"handleChange",value:function(e){var t=e.target.name,a=e.target.value,n=this.state.userInfo;n[t]=a,this.state.userInfo=n}},{key:"render",value:function(){return r.a.createElement(y.a,{style:{textAlign:"center"}},r.a.createElement("div",null,r.a.createElement(E.a,{style:{marginTop:50}},r.a.createElement(v.a,null,r.a.createElement("h1",null,"Step 1. Register New User"))),r.a.createElement(U.a,null),r.a.createElement(R.a,{style:{textAlign:"left"}},r.a.createElement(E.a,{style:{marginTop:30}},r.a.createElement(R.a.Group,{as:v.a,onChange:this.handleChange},r.a.createElement(R.a.Label,null,"Candidate Name"),r.a.createElement(R.a.Control,{type:"text",placeholder:"",name:"candidate_name_first"}),r.a.createElement(R.a.Text,{className:"text-muted"},"First Name")),r.a.createElement(R.a.Group,{as:v.a,onChange:this.handleChange},r.a.createElement(R.a.Label,null,"\xa0"),r.a.createElement(R.a.Control,{type:"text",placeholder:"",name:"candidate_name_last"}),r.a.createElement(R.a.Text,{className:"text-muted"},"Last Name"))),r.a.createElement(E.a,null,r.a.createElement(R.a.Group,{as:v.a,onChange:this.handleChange},r.a.createElement(R.a.Label,null,"Candidate Email"),r.a.createElement(R.a.Control,{type:"email",placeholder:"",name:"candidate_email"}),r.a.createElement(R.a.Text,{className:"text-muted"},"example@example.com")),r.a.createElement(v.a,null)),r.a.createElement(E.a,null,r.a.createElement(R.a.Group,{as:v.a,onChange:this.handleChange},r.a.createElement(R.a.Label,null,"Date Of Interview"),r.a.createElement(R.a.Control,{type:"date",placeholder:"",dateformat:"YYYY-MM-DD",name:"date_of_interview"}),r.a.createElement(R.a.Text,{className:"text-muted"},"Date")),r.a.createElement(v.a,null)),r.a.createElement(E.a,null,r.a.createElement(R.a.Group,{as:v.a,onChange:this.handleChange},r.a.createElement(R.a.Label,null,"Zoom, Skype, Bluejeans, Hirevue link"),r.a.createElement(R.a.Control,{type:"text",placeholder:"",name:"social_link"}),r.a.createElement(R.a.Text,{className:"text-muted"},"http://www.zoom.us/1234567890")),r.a.createElement(v.a,null)),r.a.createElement(E.a,null,r.a.createElement(R.a.Group,{as:v.a,onChange:this.handleChange},r.a.createElement(R.a.Label,null,"Interviewer's Name"),r.a.createElement(R.a.Control,{type:"text",placeholder:"",name:"interviewer_name_first"}),r.a.createElement(R.a.Text,{className:"text-muted"},"First Name")),r.a.createElement(R.a.Group,{as:v.a,onChange:this.handleChange},r.a.createElement(R.a.Label,null,"\xa0"),r.a.createElement(R.a.Control,{type:"text",placeholder:"",name:"interviewer_name_last"}),r.a.createElement(R.a.Text,{className:"text-muted"},"Last Name"))),r.a.createElement(E.a,null,r.a.createElement(R.a.Group,{as:v.a,onChange:this.handleChange},r.a.createElement(R.a.Label,null,"Interviewer's Email"),r.a.createElement(R.a.Control,{type:"email",placeholder:"",name:"interviewer_email"}),r.a.createElement(R.a.Text,{className:"text-muted"},"example@example.com")),r.a.createElement(v.a,null)),r.a.createElement(U.a,null),r.a.createElement(E.a,{style:{marginTop:30,marginBottom:30,textAlign:"center"}},r.a.createElement(v.a,null,r.a.createElement(b.a,{variant:"primary",type:"submit",onClick:this.registerUserData},this.state.isUploading?"Uploading...":"Submit"))))))}}]),a}(r.a.Component);var F=function(){return r.a.createElement(i.a,null,r.a.createElement(c.a,{expand:"lg",variant:"light",bg:"light"},r.a.createElement(c.a.Brand,{href:"#"},"ID Authenticate"),r.a.createElement(m.a,{className:"mr-auto"})),r.a.createElement(s.c,null,r.a.createElement(s.a,{path:"/success",children:r.a.createElement(D,null)}),r.a.createElement(s.a,{path:O.api.verifyID,children:r.a.createElement(N,null)}),r.a.createElement(s.a,{path:"/",children:r.a.createElement(A,null)})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(F,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[126,1,2]]]);
//# sourceMappingURL=main.f62aab1b.chunk.js.map