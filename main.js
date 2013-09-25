
function ObjectMap(key) {
  this._key    = key || 'id';
  this._objMap = {};   // id/object map
  this._keyMap = [];   // Keep track of the `paths` to the keys
  this._register = {}; // points to the indices of the _keyMap
}

module.exports = ObjectMap;

ObjectMap.prototype._mapKey = function(keys, obj) {

  // remember key
  idx = this._keyMap.indexOf(keys.toString()); 
  if(idx === -1) {
    this._keyMap.push(keys.toString());
    // push returns a position, but if an array was modified it's not really the current position
    idx = this._keyMap.indexOf(keys.toString()); 
  }

  if(!this._register[obj[this._key]]) this._register[obj[this._key]] = [];
  if(this._register[obj[this._key]].indexOf(idx) === -1) this._register[obj[this._key]].push(idx);

  return idx;

};

/*
 *
 * {
 *   _key: 'id',
 *   _objMap: { '1': { id: 1, nothing: 'special' } },
 *   _keyMap: [ 'input', 'ports,input', 'ports,output' ],
 *   _register: { '1': [ 1, 2, 3 ] },
 *   input: { '1': { id: 1, nothing: 'special' } },
 *   ports: { input: { '1': [Object] }, output: { '1': [Object] } }
 * }
 *
 */
ObjectMap.prototype.remove = function(obj) {

   for(i = 0; i < this._register[obj[this._key]].length; i++) {
      var idx = this._register[obj[this._key]][i];
      if(this._keyMap[idx]) {
        var keys = this._keyMap[idx].split(',');
        this._remove(keys, obj);

      } else {
        throw new Error("_keyMap: no such index " + idx);
      }
   }

   // cleanup
   delete this._objMap[obj.id]; 
   delete this._register[obj.id]; 

};

// removes only a single reference
//
// usage:
//     ._remove("input", obj);
//     ._remove(["ports","input"], obj);
//
ObjectMap.prototype._remove = function(keys, obj) {

  var what, i, idx;

  // do not do any checking, let javascript just bail out 
  if(typeof keys === "string") {

      // unset value
      delete this[keys][obj[this._key]];

  } else {
    // create the nested  key structure if it doesn't exist yet.
    // note: this.input = []; this.input.key = [] should throw an error
    //       it will by default actually.
    for(i = 0; i < keys.length; i++) {

      if(!what) what = this;  // root

      what = what[keys[i]];

      // set value
      if(keys.length === (i + 1)) {

        delete what[obj[this._key]];

      }

    }

  }

};

ObjectMap.prototype._init = function(keys, obj) {

  var what, i, idx;

  if(typeof keys === "string") {

      if(!this.hasOwnProperty(keys)) this[keys] = {};

      this._mapKey(keys, obj);

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

       this._mapKey(keys, obj);

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

// 
// map.get(['ports', 'input'])
//
//  is the same as:
//
// map.ports.input
// map['ports']['input']
//
// so the usefulness of this method is yet unknown, but let's just keep it :-)
// maybe executing functions along the way while traversing or something
//
ObjectMap.prototype.get = function(keys, id) {

  var i, what;

  if(typeof keys === "string") {

    if(id) {
      return this[keys][id];
    } else {
      return this[keys];
    }
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
        if(id) {
          return what[id];
        } else {
          return what;
        }
      }

    }

  }

};
