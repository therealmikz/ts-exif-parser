/*jslint browser: true, devel: true, bitwise: false, debug: true, eqeq: false, es5: true, evil: false, forin: false, newcap: false, nomen: true, plusplus: true, regexp: false, unparam: false, sloppy: true, stupid: false, sub: false, todo: true, vars: true, white: true */

var testCase = require('nodeunit').testCase;
var exif = require('../lib/exif.js');
var NodeBufferStream = require('../lib/bufferstream.js');
var DOMBufferStream = require('../lib/dom-bufferstream.js');
var buf = require('fs').readFileSync(__dirname + '/starfish.jpg');
var arrayBuffer = require('./buffertoarraybuffer')(buf);

module.exports = testCase({
	"test parseTags": function(test) {
		var expectedTags = require('./expected-exif-tags.json');
		var streams = [new NodeBufferStream(buf, 24, 23960, false), new DOMBufferStream(arrayBuffer, 24, 23960, false, global)];
		streams.forEach(function(stream) {
			var index = 0;
			exif.parseTags(stream, function(ifdSection, tagType, value, format) {
				var t = expectedTags[index];
				test.strictEqual(t.ifdSection, ifdSection);
				test.strictEqual(t.tagType, tagType);
				test.strictEqual(t.format, format);
				if(typeof t.value === 'string' && t.value.indexOf('b:') === 0) {
					test.ok(Buffer.isBuffer(value));
					test.strictEqual(parseInt(t.value.substr(2), 10), value.length);
				} else {
					test.deepEqual(t.value, value);
				}
				++index;
			});
			test.strictEqual(index, expectedTags.length, 'all tags should be passed to the iterator');
		});
		test.done();	
	}
});