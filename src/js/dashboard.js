NCMB.initialize("03f14794fcaa21cf389b3d752541483c5f664f25c908cec012a6ccd59235f90f", "5ce863d747e637c2fca8722105d0aa60e778a569a1032f5c122f4ef0e27d01f8");
var FaceInformation = NCMB.Object.extend("FaceInformation");
var FaceImage = NCMB.Object.extend("FaceImage");

var DATA_LIMIT = 30;

var graphDatas = [];

$(document).ready(function() {
    console.log('start');
    var query = new NCMB.Query(FaceInformation);
    query.descending("createDate");
    query.limit(DATA_LIMIT);
    query.find({
        success: function(results) {
            var mainCount = [];
            var subCount = [];
            var myAge = [];
            var ageData = [];
            var smileData = [];
            var troubleData = [];
            var doyaaData = [];
            var man = 0;
            var woman = 0;
            var cat = 0;
            var dog = 0;
            var racoonDog = 0;
            var fox = 0;
            var squirrel = 0;
            var fish = 0;
            for(var i = DATA_LIMIT - 1; i >= 0; --i) {
                if(results.length > i) {
                    var faceInfo = results[i].get('faceInfo').faceRecognition.detectionFaceInfo;
                    graphDatas['key_' + (i + 1)] = results[i].get('image').id;
                    mainCount[i] = String(i + 1);
                    subCount[i] = String(i + 1);
                    myAge[i] = 35;
                    ageData[i] = faceInfo.ageJudge.ageResult;
                    smileData[i] = faceInfo.smileJudge.smileLevel;
                    troubleData[i] = faceInfo.enjoyJudge.troubleLevel;
                    doyaaData[i] = faceInfo.enjoyJudge.doyaLevel;
                    switch(Number(faceInfo.genderJudge.genderResult)) {
                        case 0 :
                            ++man;
                        break;
                        case 1 :
                            ++woman;
                        break;
                        default :
                        break;
                    }
                    var similarAnimal = faceInfo.enjoyJudge.similarAnimal;
                    if(similarAnimal === 'cat') {
                        ++cat;
                    } else if(similarAnimal === 'dog') {
                        ++dog;
                    } else if(similarAnimal === 'racoonDog') {
                        ++racoonDog;
                    } else if(similarAnimal === 'fox') {
                        ++fox;
                    } else if(similarAnimal === 'squirrel') {
                        ++squirrel;
                    } else if(similarAnimal === 'fish') {
                        ++fish;
                    }
                } else {
                    mainCount[i] = String(i + 1);
                    subCount[i] = String(i + 1);
                    myAge[i] = undefined;
                    ageData[i] = undefined;
                    smileData[i] = undefined;
                    troubleData[i] = undefined;
                    doyaaData[i] = undefined;
                }
            }
            console.log(graphDatas);
            var ageDatas = [
                mainCount.reverse()
                , myAge.reverse()
                , ageData.reverse()
            ];
            YUI().use('charts', function (Y) {
                var mychart = new Y.Chart({
                    axes: {
                        values: {
                            maximum: 100
                            , minimum: 0
                        }
                    }
                    , dataProvider: ageDatas
                    , render: "#ageChart"
                    , tooltip : {
                        markerLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex) {
                            var msg = document.createElement("div");
                            $(msg).attr('id', 'item_' + categoryItem.value);
                            if(seriesIndex == 1) {
                                console.log(graphDatas['key_' + categoryItem.value]);
                                var img = new Image();
                                var faceImgId = graphDatas['key_' + categoryItem.value];
                                var imgQuery = new NCMB.Query(FaceImage);
                                imgQuery.get(faceImgId, {
                                    success: function(results) {
                                        $('#' + 'item_' + categoryItem.value).append('<img src="data:' + results.get('mime') + ';base64,' + results.get('base64') + '" width="128">');
                                    }
                                });
//                                faceImg.fetch({
//                                    success: function(object) {
//                                    }
//                                });
                            } else if(seriesIndex == 0) {
                                $(msg).append('<p>' + valueItem.value + '歳</p>');
                            }
                            return msg; 
                        }
                    }
                });
            });
            var theSubCount = subCount.slice(0, 20).reverse();
            // 見た目笑顔
            var smileDatas = [
                theSubCount
                , smileData.slice(0, 20).reverse()
            ];
            YUI().use('charts', function (Y) {
                var mychart = new Y.Chart({
                    axes: {
                        values: {
                            maximum: 100
                            , minimum: 0
                        }
                    }
                    , dataProvider: smileDatas
                    , render: "#smileChart"
                });
            });
            // 見た目困った
            var troubleDatas = [
                theSubCount
                , troubleData.slice(0, 20).reverse()
            ];
            YUI().use('charts', function (Y) {
                var mychart = new Y.Chart({
                    axes: {
                        values: {
                            maximum: 100
                            , minimum: 0
                        }
                    }
                    , dataProvider: troubleDatas
                    , render: "#troubleChart"
                });
            });
            // 見た目ドヤァ
            var doyaaDatas = [
                theSubCount
                , doyaaData.slice(0, 20).reverse()
            ];
            YUI().use('charts', function (Y) {
                var mychart = new Y.Chart({
                    axes: {
                        values: {
                            maximum: 100
                            , minimum: 0
                        }
                    }
                    , dataProvider: doyaaDatas
                    , render: "#doyaaChart"
                });
            });
            // 性別
            var sexDatas = [
                {
                    category : "性別"
                    , '男性' : (man / (man + woman)) * 100
                    , '女性' : (woman / (man + woman)) * 100
                }
            ];
            YUI().use('charts', function (Y) {
                var mychart = new Y.Chart({
                    axes: {
                    }
                    , dataProvider : sexDatas
                    , render : "#sexChart"
                    , type : "bar"
                    , stacked : true
                });
            });
            // 見た目動物
            var animalDatas = [
                ['イヌ', 'ネコ', 'タヌキ', 'キツネ', 'リス', 'サカナ']
                , [dog, cat, racoonDog, fox, squirrel, fish]
            ];
            YUI().use('charts', function (Y) {
                var mychart = new Y.Chart({
                    axes: {
                        values: {
                            maximum: 30
                        }
                    }
                    , dataProvider : animalDatas
                    , render : "#animalChart"
                    , type : "bar"
                });
            });
        }
    });
    console.log('end');
});
