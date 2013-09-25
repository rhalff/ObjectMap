require('should');
var ObjectMap = require('../main');

describe("Object Map Test:", function() {

  it("Should work", function(done) {

    var obj = { id: 1, nothing: 'special' };

    map = new ObjectMap('id');

    map.set(obj, 'input');            // link object to this.input[obj.id]
    map.set(obj, ['ports','input']);  // link object to this.ports['input'][obj.id]
    map.set(obj, ['ports','output']); // link object to this.ports['output'][obj.id]

    // is fout dit, ports['input'] moet het hele object zijn met alle object id's
    map.get(['ports', 'input']).should.eql({ '1': { id: 1, nothing: 'special' } });
    map.get(['ports', 'output']).should.eql({ '1': { id: 1, nothing: 'special' } });

    // should be the exact same object
    map.get(['ports', 'input'])['1'].should.eql(obj);
    map.get(['ports', 'output'])['1'].should.eql(obj);
    map.get('input', obj.id).should.equal(obj);

    map.get(['ports','input'], obj.id).should.equal(obj);    // get this.ports['input'][id]

    map['ports']['input'].should.eql({ '1': { id: 1, nothing: 'special' } });
    map['ports']['output'].should.eql({ '1': { id: 1, nothing: 'special' } });

    // should be the exact same object
    map['ports']['input']['1'].should.equal(obj);
    map['ports']['output']['1'].should.equal(obj);
    map['input'][obj.id].should.equal(obj);


    // TODO: test remove, not unimportant
    map.remove(obj);

	done();

  });
  
});


