const expect = require('chai').expect;
let chai = require("chai");
let chaiHttp = require("chai-http");
const puppeteer = require('puppeteer');
let app = require("../server");
const request = require('supertest');
chai.use(chaiHttp);
chai.should();
chai.use(require('chai-things'));

var groupsdata

const host = "http://localhost:3000";
let page;

// the test suite
describe('My test suite', function () {

  // open a new browser tab and set the page variable to point at it
  before (async function () {
    global.expect = expect;
    global.browser = await puppeteer.launch( { headless: false } );
    page = await browser.newPage();
    page.setViewport({width: 1187, height: 1000});

  });

  // close the browser when the tests are finished
  after (async function () {
    await page.close();
    await browser.close();

  });

  // @todo tests go here!!!
  it('homepage loads and has correct page title', async function () {
       const [response] = await Promise.all([
         page.goto(host, {timeout:0}),
         page.waitForNavigation({timeout:0}),
       ]);
       expect(await page.title()).to.eql('Democracy Book');
     });



            it("It should get all local groups and see if have id", function () {
                chai.request(app)
                    .get("/localgroup/findgroups")
                    .end((err, response) => {
                      if(err){
                        console.log("error",err)
                      }else{
                  console.log(response.body.data)
                        response.body.data.should.all.have.property('_id')


                    }})})

                    it("It should get all local groups and see if have centroid",  function () {
                       chai.request(app)
                            .get("/localgroup/findgroups")
                            .end((err, response) => {
                              if(err){
                                console.log("error",err)
                              }else{
                          console.log(response.body.data)
                                response.body.data.should.all.have.property('centroid')
                                groupsdata=JSON.parse(JSON.stringify(response.body.data))
                                done()
                            }})})


     it("It should create a user", function(done){

console.log("groupsdata",groupsdata)
// usercoords,groupscoords,userid
//
//
//
//        var userId=mongoose.Types.ObjectId()
//        var localgroup=joinLocalGroup(usercoords,values.groupsCoordinates,userId)
//        const user = {
//          _id:userId,
//          name: name,
//          email: email,
//          expertise: expertise,
//          localgroup:localgroup,
//          coordinates: coordinates,
//          password: "mmmmmm"
//        }
//
//        try {
//          let response = await fetch('/api/users/', {
//            method: 'POST',
//            headers: {
//              'Accept': 'application/json',
//              'Content-Type': 'application/json'
//            },
//            body: JSON.stringify(user)
//          })
//          return await response.json()
//        } catch(err) {
//          console.log(err)
//        }
//
//
//                 chai.request(server)
//                     .post("/api/users/")
//                     .end((err, response) => {
//                         response.should.have.status(200);
//                         response.body.should.be.a('array');
//                         response.body.length.should.be.eq(3);
//                     done();
//                     });
            });


     //
     // it('creating user', async function () {
     //
     //      const [response] = await Promise.all([
     //
     //        page.goto('http://localhost:3000/signup',{timeout:0}),
     //        page.waitForNavigation(5000),
     //
     //      ]);
     //
     //      var addresses=["Petersham","Stanmore","Lewisham","Croydon","Macdonaldtown","Newtown","Glebe","Ultimo","Five Dock","Homebush"]
     //      var usernames=[]
     //      for(var x=0;x<10;x++){
     //        var randnum=Math.floor(Math.random()*10)+1
     //        console.log(randnum)
     //        var randaddress=addresses[randnum]
     //        console.log(randaddress)
     //        var randstring= Math.random().toString(36).substring(2, 9)
     //        await page.type('#name', randstring, { delay: 100 })
     //        await page.type('#email', `${randstring}@gmail.com`, { delay: 100 })
     //        usernames.push(`${randstring}@gmail.com`)
     //        await page.type('#address', `${randaddress} Sydney`, { delay: 100 })
     //        await page.type('#expertise', 'expertise', { delay: 100 })
     //        await page.type('#password', 'mmmmmm', { delay: 100 })
     //        await page.click('#submit')
     //
     //      }
     //
     //       let title = await page.$eval('#title',el => el.innerText)
     //      expect(title).to.eql('Sign Up')
     //    });


});






function joinLocalGroup(usercoords,groupscoords,userid){

  console.log("joining local group")
console.log(usercoords)
console.log(groupscoords)
console.log(userid)

const distances=groupscoords.map(item=>{
let dist=calculatedist(item['centroid'],usercoords)
return {
id:item['_id'],
distance:dist,
}}
)
distances.sort((a, b) => (a.distance > b.distance) ? 1 : -1)
console.log("distances",distances)

const options = {
method: 'put',
headers: {
'Content-Type': 'application/json'
},
 body: ''
}

fetch("groups/joinlocalgroup/"+distances[0]['id']+"/"+ userid.toString(), options
)  .then(res => {
console.log(res);
}).catch(err => {
console.log(err);
})
return distances[0]['id']
}

function calculatedist(groupcoords,usercoords){
  return geodist({lat: usercoords[0], lon: usercoords[1]}, {lat: groupcoords[0], lon: groupcoords[1]})
}
