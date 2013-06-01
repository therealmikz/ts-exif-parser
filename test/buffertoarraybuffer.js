module.exports = function bufferToArrayBuffer(buffer) {
	var view = new Uint8Array(buffer.length);
	for(var i = 0; i < buffer.length; ++i) {
		view[i] = buffer.readUInt8(i);
	}
	return view.buffer;
}