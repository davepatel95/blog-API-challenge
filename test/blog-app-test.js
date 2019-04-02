const chai = require("chai");
const chaiHttp = require("chai-http");

const {app, runServer, closeServer} = require("../server.");

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
            author: 'Kofi Kingston'
        };
        return chai
            .request(app)
            .send("/blog-posts")
            .then(function(res) {
                expect(res).to.have.status(201);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.include.keys('id','title','content', 'author');
                expect(res.body.id).to.not.equal(null);
                expect(res.body).to.deep.equal(Object.assign(newBlogPost, {id: res.body.id}));
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
        return chai
            .request(app)
    });

    it("should delete blog post on DELETE", function() {
        return chai
            .request(app)
    });
});