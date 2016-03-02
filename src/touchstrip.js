const EventEmitter = require('events'),
    util = require('util');

function TouchStrip(midi_out) {
    EventEmitter.call(this);
    this.midi_out = midi_out;
}
util.inherits(TouchStrip, EventEmitter);

// TouchStrip.prototype.led_on = function() { this.midi_out.send([176, this.cc, 127]) }
// TouchStrip.prototype.led_off = function() { this.midi_out.send([176, this.cc, 0]) }

// Knobs.prototype.receive_midi_cc = function(index, value) {
//     if (ccToKnobMap.hasOwnProperty(index)) {
//         var knob_name = ccToKnobMap[index];
//         var delta = value < 64 ? value : value - 128;
//         this[knob_name].emit('turned', delta);
//     } else {
//         console.log('No knob known for CC: ' + index);
//     }
// }

TouchStrip.prototype.receive_midi_pitch_bend = function(fourteen_bit_value) {
    if (fourteen_bit_value == 8192) return;
    this.emit('pitchbend', fourteen_bit_value);
}

TouchStrip.prototype.receive_midi_note = function(note, velocity) {
    if (note != 12) { 
        console.log('Touchstrip only responds to MIDI note 12. Received: ' + note);
        return;
    }

    if (velocity > 0) {
        this.emit('touched');
    } else {
        this.emit('released');
        this.emit('pitchbend', 8192);
    }
}

module.exports = TouchStrip;
