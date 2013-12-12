// test cases are described in fixtures.js
describe("parseJSON", function(){

  it("should match the result of calling JSON.parse", function(){
    stringifiableValues.forEach(function(obj){
      var result = parseJSON(JSON.stringify(obj));
      var equality = _.isEqual(result, obj); // why can't we use `===` here?
      expect(equality).toBeTruthy();
    });

    // extraCreditStrings.forEach(function(string){
    //   log(string);
    //   var expected = JSON.parse(string);
    //   var result = parseJSON(string);
    //   var equality = _.isEqual(result, expected);
    //   expect(equality).toBeTruthy();
    // });
  });

  it("should error out sometimes", function(){
    arrayWithInvalidStrings.forEach(function(test){
      // expect(parseJSON(test)).toBe(undefined); // you can use this test if you'd prefer
      expect(function(){
        parseJSON(test);
      }).toThrow();
    });
  });

});
