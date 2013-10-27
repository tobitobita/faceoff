var API_KEY = 'RCG0871087';
var API_CERTIFICATION_URL = 'http://eval.api.pux.co.jp:8080/webapi/tags.do';
var API_RECOGNIZE_URL = 'http://eval.api.pux.co.jp:8080/webapi/face.do';
var IMAGE_MIME = 'image/jpeg';
var REPLACE_STRING = 'data:' + IMAGE_MIME + ';base64,';

var tempCanvas;

NCMB.initialize("03f14794fcaa21cf389b3d752541483c5f664f25c908cec012a6ccd59235f90f", "5ce863d747e637c2fca8722105d0aa60e778a569a1032f5c122f4ef0e27d01f8");
var FaceUser = NCMB.Object.extend("FaceUser");

function addUser(userId, password, faceId) {
    console.log('addUser');
    var data = {
        'apiKey' : API_KEY
        , 'mode' : 'register'
        , 'tagsInfo':userId + ',' + faceId
    };
    $.ajax({
        type:"POST"
        , url:API_CERTIFICATION_URL
        , data:data
        , success: function(res) {
            var resObj = $.xml2json(res);
            console.log(resObj);
            var faceUser = new FaceUser();
            faceUser.set('userId', userId);
            faceUser.set('password', password);
            faceUser.save(null, {
                success: function(result) {
                    console.log('user add success.');
                    window.location = '/';
                }
            });
            
        }
        , error: function(res) {
            console.log(res.responseText);
        }
    });
}

function doPost(userId, password, data) {
    console.log('doPost');
    $.ajax({
        type:"POST"
        , url:API_CERTIFICATION_URL
        , data:data
        , success: function(res) {
            var resObj = $.xml2json(res);
            console.log(resObj);
            if(resObj.faceVerification.verificationFaceInfo !== undefined) {
                console.log('new picture.');
                console.log(resObj.faceVerification.verificationFaceInfo.faceId);
                addUser(userId, password, resObj.faceVerification.verificationFaceInfo.faceId);
            } else {
                $('#messages').append('<div class="alert alert-danger"><p>もう一度！</p></div>');
                $('#pic img').remove();
                $('#face').append('<video id="myFace" width="320" height="240" controls autoplay></video>');
                play();
            }
        }
        , error: function(res) {
            console.log(res.responseText);
        }
    });
}

function doSave(userId, password) {
    console.log('doSave');
    $('#pic img').remove();
    $('#messages div').remove();

    tempCanvas = document.createElement('canvas');
    var video = document.getElementById('myFace');

    tempCanvas.width = 640;
    tempCanvas.height = 480;
    var ctx = tempCanvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    var img = new Image();
    img.src = tempCanvas.toDataURL(IMAGE_MIME);
    img.width = 320;
    img.height = 240;
    $('#face video').remove();
    $('#pic').append(img);
    
    var data = {
        'apiKey' : API_KEY
        , 'mode' : 'verify'
        , 'inputBase64':tempCanvas.toDataURL(IMAGE_MIME).replace(REPLACE_STRING, '')
    };
    console.log(data);
    doPost(userId, password, data);
}

function save(userId, password) {
    console.log('save');
    if(typeof navigator.webkitGetUserMedia == 'function') {
        navigator.webkitGetUserMedia({
                video:true
            }
            , function (stream) {
                doSave(userId);
            }
            , function (e) {
                console.error(e);
            }
        );
    } else if(typeof navigator.mozGetUserMedia == 'function') {
        navigator.mozGetUserMedia({
                video:true
            }
            , function (stream) {
                doSave(userId, password);
            }
            , function (e) {
                console.error(e);
            }
        );
    } else {
        console.error(e);
    }
}            

function play() {
    console.log('play');
    var video = document.getElementById('myFace');
    // Opera getUserMedia
    if(typeof navigator.webkitGetUserMedia == 'function') {
        navigator.webkitGetUserMedia({
                /*audio:true
                , */video:true
            }
            , function (stream) {
                console.log('success');
                video.src = window.webkitURL.createObjectURL(stream);
            }
            , function (e) {
                console.error(e);
            }
        );
    } else if(typeof navigator.mozGetUserMedia == 'function') {
        navigator.mozGetUserMedia({
                video:true
            }
            , function (stream) {
                console.log('success');
                video.mozSrcObject = stream;
            }
            , function (e) {
                console.error(e);
            }
        );
    } else {
        console.error(e);
    }
}

$(document).ready(function() {
    console.log('start');
    $('#userId').val($.cookie('userId'));
    play();
    console.log('end');
});
