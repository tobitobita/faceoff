var API_KEY = 'RCG0871087';
var API_CERTIFICATION_URL = 'http://eval.api.pux.co.jp:8080/webapi/tags.do';
var API_RECOGNIZE_URL = 'http://eval.api.pux.co.jp:8080/webapi/face.do';
var IMAGE_MIME = 'image/jpeg';
var REPLACE_STRING = 'data:' + IMAGE_MIME + ';base64,';

var tempCanvas;

NCMB.initialize("03f14794fcaa21cf389b3d752541483c5f664f25c908cec012a6ccd59235f90f", "5ce863d747e637c2fca8722105d0aa60e778a569a1032f5c122f4ef0e27d01f8");
var FaceInformation = NCMB.Object.extend("FaceInformation");
var FaceImage = NCMB.Object.extend("FaceImage");


function doDelete(faceId) {
    console.log('doDelete');
    var data = {
        'apiKey' : API_KEY
        , 'mode' : 'delete'
        , 'tagsFaceID' : faceId
    };
    $.ajax({
        type:"GET"
        , url:API_CERTIFICATION_URL
        , data:data
        , success: function(res) {
            console.log('response doDelete');
            console.log(res);
        }
        , error: function(res) {
            console.error(res);
        }
    });
}

function doKnowledge(userId) {
    console.log('doKnowledge');
    var data = {
        'apiKey' : API_KEY
        , 'inputBase64' : tempCanvas.toDataURL(IMAGE_MIME).replace(REPLACE_STRING, '')
        , 'optionFlgMinFaceWidth' : '1'
        , 'facePartsCoordinates' : '0'
        , 'blinkJudge' : '1'
        , 'ageAndgenderJudge' : '1'
        , 'angleJudge' : '1'
        , 'smileJudge' : '1'
        , 'enjoyJudge' : '1'
    };
    $.ajax({
        type:"POST"
        , url:API_RECOGNIZE_URL
        , data:data
        , success: function(res) {
            console.log('response doKnowledge');
            console.log(res);
            // ナレッジする
            var faceImg = new FaceImage();
            faceImg.set("mime", IMAGE_MIME);
            faceImg.set("base64", tempCanvas.toDataURL(IMAGE_MIME).replace(REPLACE_STRING, ''));
            var faceInfo = new FaceInformation();
            faceInfo.set('userId', userId);
            faceInfo.set('faceInfo', $.xml2json(res));
            faceInfo.set('image', faceImg);
            faceInfo.save(null, {
                success: function(result) {
                    console.log('knowlegde success.');
                    window.location = 'success.html';
                }
            });
        }
        , error: function(res) {
            console.error(res);
        }
    });
}

function doPost(userId, data) {
    console.log('doPost');
    $.ajax({
        type:"POST"
        , url:API_CERTIFICATION_URL
        , data:data
        , success: function(res) {
            var resObj = $.xml2json(res);
            var success = false;
            if(resObj.faceVerification.errorMessage === 'no face.' || resObj.faceVerification.verificationFaceInfo.candidate === undefined) {
                $('#messages').append('<div class="alert alert-danger"><p>違います！</p></div>');
            } else {
                var candidates = resObj.faceVerification.verificationFaceInfo.candidate;
                console.log(candidates);
                if(!(candidates instanceof Array)) {
                    candidates = [candidates];
                }
                console.log('check');
                candidates.sort(function(obj1, obj2) {
                    if( obj1.score < obj2.score ) return -1;
                    if( obj1.score > obj2.score ) return 1;
                    return 0;
                });
                console.log(candidates);
                if(candidates[0].tag === userId) {
                    success = true;
                } else {
                    $('#messages').append('<div class="alert alert-warning"><p>もう一度！</p></div>');
                }
            }
            if(resObj.faceVerification.verificationFaceInfo !== undefined) {
                console.log('delete picture.');
                doDelete(resObj.faceVerification.verificationFaceInfo.faceId);
            }
            if(success) {
                $.cookie('userId', $('#userId').val());
                doKnowledge(userId);
            } else {
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

function doSave(userId) {
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
    doPost(userId, data);
}

function save(userId) {
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
                doSave(userId);
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
