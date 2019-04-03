const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function() {
    before(function() {
        return runServer();
    });

    after(function() {
        return closeServer();
    });


    it("should create blog post on POST", function() {
        const newBlogPost = {
            title: "A New Day",
            content: "The New Day are the greatest tag team of all time and here is why...",
            author: "Kofi Kingston",
            publishDate: "September 22, 2018"
        };
        return chai
            .request(app)
            .post("/blog-posts")
            .send(newBlogPost)
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.all.keys('id','title','content', 'author', 'publishDate');
                expect(res.body.id).to.not.equal(null);
                expect(res.body.content).to.equal(newBlogPost.content);
                expect(res.body.title).to.equal(newBlogPost.title);
                expect(res.body.author).to.equal(newBlogPost.author);
            });
    });
    it("should return blog posts on GET", function() {
        return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);

                const expectedKeys = ["id", "title", "content", "author"];
                res.body.forEach(function(item) {
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });

    it("should update blog post on PUT", function() {
        const updateData = {
            title: 'Cheese is on the way',
            content: 'Cheese is making the biggest comeback ever to the face care products',
            author: 'Clint Eastwood'
        };
        return chai
            .request(app)
            .get("/blog-posts")
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/blog-posts/${updateData.id}`)
                    .send(updateData)
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });

    it("should delete blog post on DELETE", function() {
        return chai
            .request(app)
            .get('/blog-posts')
            .then(function(res) {
                return chai.request(app)
                    .delete(`/blog-posts/${res.body[0].id}`);
            })
            .then(function(res) {
                expect(res).to.have.status(204);
            });
    });
});