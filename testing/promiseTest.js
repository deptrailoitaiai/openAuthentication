const test = require('../controllers/registerAction');

async function testing(){
    const string = 'minh0912873465@gmail.com';
    await test.presave_existed_email(string)
    .then(()=>{throw new Error(`hehe`)})
    .then(result =>{console.log(result)})
    .catch(err => {console.log(`${err}`)})
}
testing();