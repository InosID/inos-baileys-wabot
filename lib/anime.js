const axios = require('axios');

function getRandomObject(obj) {
    var keys = Object.keys(obj);
    var randomKey = keys[keys.length * Math.random() << 0];
    return randomKey
}

function getRandomObjectValue(obj) {
    var randomKey = getRandomObject(obj);
    return obj[randomKey];
}


function changeAnswers(obj) {
    var randomKey = getRandomObject(obj);
    var randomValue = getRandomObjectValue(obj[randomKey]);
    var randomValue2 = getRandomObjectValue(obj[randomKey]);
    var randomValue3 = getRandomObjectValue(obj[randomKey]);
    if (randomValue == randomValue2) {
        randomValue2 = getRandomObjectValue(obj[randomKey]);
    }
    if (randomValue == randomValue3) {
        randomValue3 = getRandomObjectValue(obj[randomKey]);
    }
    if (randomValue2 == randomValue3) {
        randomValue3 = getRandomObjectValue(obj[randomKey]);
    }
    obj = {
        key: randomKey,
        value: [randomValue, randomValue2, randomValue3]
    }
    return obj
}


async function createQuiz(obj) {
    return new Promise (async (resolve, reject) => {
    var soal = changeAnswers(obj);
    let value = soal['value'];
    var randomValue = value[Math.floor(Math.random() * value.length)];
    getimage = await axios.get('https://frieren.my.id/searching/googleimages?query=' + randomValue);
    let imagenya = []
    for (let i of getimage.data.result) {
        if (i.includes('jpg') || i.includes('png')) {
            imagenya.push(i)
        }
    }
    var randomImage = imagenya[Math.floor(Math.random() * imagenya.length)];
    var quiz = {
        question: 'Siapa Nama Character ini?',
        image: randomImage,
        answers: value,
        correctAnswer: randomValue
    }
    resolve(quiz);
   })
}


module.exports = {
    createQuiz
}
