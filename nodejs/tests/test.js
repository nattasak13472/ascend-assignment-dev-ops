const request = require("supertest");
const app = require('../main');
const req = request(app);

// START UNIT TEST 
describe("START UNIT TEST",function(){

    // Should response json as expected 
    it("Should response json {'title':'HELLO THIS IS ASCEND ASSIGNMENT'} ",function(done){

        req.get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(JSON.stringify({ 'title': 'HELLO THIS IS ASCEND ASSIGNMENT' }))
            .expect(200, done);
        
    });

});
