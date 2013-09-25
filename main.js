

function ObjectMap(key) {
  this._key    = key || 'id';
  this._objMap = {};
}

ObjectMap.prototype._init = function(keys, obj) {

  var what, i;

  if(typeof keys === "string") {

      if(!this.hasOwnProperty(keys)) this[keys] = {};

      // set value
      this[keys][obj[this._key]] = obj; 

  } else {
    // create the nested  key structure if it doesn't exist yet.
    // note: this.input = []; this.input.key = [] should throw an error
    //       it will by default actually.
    for(i = 0; i < keys.length; i++) {

      if(!what) what = this;  // root

      if(!what.hasOwnProperty(keys[i])) what[keys[i]] = {};

      what = what[keys[i]];

      // set value
      if(keys.length === (i + 1)) {
        what[obj[this._key]] = obj;
      }

    }

  }

};

ObjectMap.prototype.set = function(obj, keys) {

  // register object if it is unknown
  if(!this._objMap.hasOwnProperty(obj[this.key])) {
    this._objMap[obj[this._key]] = obj;
  }

  // ensure structure is available
  this._init(keys, obj);

};

ObjectMap.prototype.get = function(keys, id) {

  var i, what;

  if(typeof keys === "string") {
    if(!this[keys][id]) {
      // fail hard, we must be able to trust the map
      throw new Error("Object is unknown");
    }
    return this[keys][id];
  } else {

    for(i = 0; i < keys.length; i++) {

      if(!what) what = this;  // root

      if(!what.hasOwnProperty(keys[i])) {
        // we must be able to trust the requested keys 
        throw new Error("Unrecognized key:" + keys[i]);
      }

      what = what[keys[i]];

      // get value
      if(keys.length === (i + 1)) {
        return what[obj[this._key]];
      }

    }

  }

};

ObjectMap.prototype.remove = function(obj) {

  // clean up

};

var obj = { id: 1, nothing: 'special' };


// dacht, just kunt ook als key 'ports:input' gebruiken maar dan kun je niet alle ports teruggeven.
// dus wel nuttig dit.
//
var o;
map = new ObjectMap('id');

map.set(obj, 'input');            // link object to this.input[obj.id]
map.set(obj, ['ports','input']);  // link object to this.ports['input'][obj.id]
map.set(obj, ['ports','output']); // link object to this.ports['output'][obj.id]

o = map.get(['ports', 'input']);       // all input ports, the inputPortMap
console.log(o);
o = map.get(['ports', 'output']);      // all output ports, the outputPortMap 
console.log(o);
o = map.get('input', obj.id);              // get this.input[id] 
console.log(o);
o = map.get(['ports','input'], obj.id);    // get this.ports['input'][id]
console.log(o);
o = map.get(['ports','output'], obj.id);   // get this.ports['output'][id]
console.log(o);

map.remove(obj);                   // remove obj from all lists.

console.log(map);
