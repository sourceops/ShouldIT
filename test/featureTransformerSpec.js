var featureTransformer = require('../lib/featureTransformer'),
    fs = require('fs'),
    chai = require('chai'),
    assert = require('chai').assert;
chai.use(require('chai-fuzzy'));

describe("Tranformation", function() {

    it("transforms a single IT", function(done) {
        var inputFile = "test/fixtures/spec/exampleSpec.feature";
        var expectedOutput = {
            "should do something" : "test/fixtures/spec/exampleSpec.feature:1"
        }
        verifyFileOutput(inputFile, expectedOutput, done);
        
    });

    it("transforms a describe", function(done) {
        var inputFile = "test/fixtures/spec/describe.feature";
        var expectedOutput = {
            "a description" : {
                "should do something" : "test/fixtures/spec/describe.feature:2"
            }
        }
        verifyFileOutput(inputFile, expectedOutput, done);
        
    });

    it("transforms nested describes", function(done) {
        var inputFile = "test/fixtures/spec/twoDescribes.feature";
        var expectedOutput = {
            "a description" : {
                "another description" : {
                    "should match 2 descriptions" : "test/fixtures/spec/twoDescribes.feature:3"
                }
                
            }
        }
        verifyFileOutput(inputFile, expectedOutput, done);
    });

    it("ignores empty describes", function(done) {
        var inputFile = "test/fixtures/spec/closedDescribe.feature";
        var expectedOutput = {
            "open description" : {
                "should do something" : "test/fixtures/spec/closedDescribe.feature:4"
            }
        }
        verifyFileOutput(inputFile, expectedOutput, done);
    });

    it("handles multiple describes", function(done) {
        var inputFile = "test/fixtures/spec/full.feature";
        var expectedOutput = {
            "first description" : {
                "should do something" : "test/fixtures/spec/full.feature:2"
            },
            "second description" : {
                "nested description" : {
                    "should do something else" : "test/fixtures/spec/full.feature:6"
                }
            }
        }
        verifyFileOutput(inputFile, expectedOutput, done);
    });

    function verifyFileOutput(inputFile, expectedOutput, done) {
        var tempOut =  "test/fixtures/test-output/tmp.json";

        featureTransformer(inputFile, tempOut, function() {
            fs.readFile(tempOut, 'utf8', function (err, data) {
                if (err) throw err;
                assert.notEqual(data, "");
                assert.like(JSON.parse(data), expectedOutput);
                done();
            });
        });
    }
});