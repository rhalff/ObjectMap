var should = require('should');
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

	done();

  });

  it("Should remove", function(done) {

    var obj = { id: 1, nothing: 'special' };

    map = new ObjectMap('id');
    map.set(obj, 'input');            // link object to this.input[obj.id]
    map.set(obj, ['ports','input']);  // link object to this.ports['input'][obj.id]
    map.set(obj, ['ports','output']); // link object to this.ports['output'][obj.id]

    // all references should be gone.
    map.remove(obj);
    // remove all values from the map
    //map.clear();
    // is fout dit, ports['input'] moet het hele object zijn met alle object id's
    map.get(['ports', 'input']).should.eql({});
    map.get(['ports', 'output']).should.eql({});
    map['ports']['input'].should.eql({});
    map['ports']['output'].should.eql({});

    should.not.exist(map.get(['ports', 'input'])['1']);
    should.not.exist(map.get(['ports', 'output'])['1']);
    should.not.exist(map.get(['input'], obj.id));
    should.not.exist(map.get(['ports','input'], obj.id));

    should.not.exist(map['ports']['input']['1']);
    should.not.exist(map['ports']['output']['1']);
    should.not.exist(map['input'][obj.id]);

    /**
     * 
     * Left behind structure should be cleaned up also:
     * 
     * The _keyMap should not be removed, it's the structure itself.
     * So, remove _objMap[id] && _register[id]
     * 
     * {
     *  _key: 'id',
     *  _objMap: { '1': { id: 1, nothing: 'special' } },
     *  _keyMap: [ 'input', 'ports,input', 'ports,output' ],
     *  _register: { '1': [ 0, 1, 2 ] },
     *  input: {},
     *  ports: { input: {}, output: {} }
     * }
     *
     **/
    map.should.eql({
      _key: 'id',
      _objMap: { },
      _keyMap: [ 'input', 'ports,input', 'ports,output' ],
      _register: { },
      input: {},
      ports: { input: {}, output: {} }
    });
     
    done();

  });
  
});


