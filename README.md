# node-push

## What?

A javascript wrapper for using the Ableton Push as a MIDI controller via a simple event-driven API, encapsulating the generation and parsing of MIDI messages sent to/from the Ableton Push hardware.

node-push can be compiled for use as a MIDI controller in a Web MIDI/Audio API enabled web browser.

## how to use

Add details for
- example app
- compiling
- running tests

## Why?

I posed myself a couple of front-end/musical-tool development questions and used this project to answer them.

### Can I write/test code in node and deploy for use in the browser?
- Node/npm provides a fast feedback environment for rapid test driven development
- Utilising [ports & adaptors](http://alistair.cockburn.us/Hexagonal+architecture) design pattern enables isolation of 'Push wrapper' code from the Web MIDI API used when deployed in the browser
  - presents simple MIDI IO interfaces that are easy to stub in tests
- [Browserify](http://browserify.org/) integrated into an npm workflow to bundle all the node application code into a single JS file for use in the web browser application

### Can I use the web browser as a *fast-booting* and *performant* environment (compared to e.g. MaxMSP, Ableton Live + Max4Live)?
- TBD

### Can i write a *reasonable looking* and *useful* app in a web browser (in a timeframe comparable to MaxMSP development)?
- TBD

# API documentation

The push wrapper presents each element of the Push hardware as a distinct object that emits **control events** (see [Event Emitter](https://nodejs.org/api/events.html)) in response to receiving MIDI messages from the Push hardware (via its `receive_midi` method). 

Similarly, **feedback commands** can be sent to elements of the hardware (e.g. turning on button LEDs) by calling the appropriate method on the object in the push wrapper (causing the wrapper to output the corresponding MIDI command)

## Instantiation and MIDI IO

### Create new Push wrapper

```
const Push = require('./push.js');
var midi_out = {
    send: function(midi_bytes) {
        // implementation expects midi_bytes to be an array
    }
}
var push = new Push(midi_out);

var midi_bytes = [144, 100, 127];
push.receive_midi(midi_bytes); // wrapper expects midi_bytes to be an array
```

### Web MIDI API integration
If you are using the Web MIDI API you can bind a MIDI input/output ports to the Push wrapper. It's no coincidence the interfaces expected by the wrapper closely match those exposed by the Web MIDI API:
```
navigator.requestMIDIAccess().then((midiAccess) => {
    var input = midiAccess.inputs.values()[0],
        output = midiAccess.outputs.values()[0];

    var push = new Push(output.value); // bind MIDI output
    input.value.onmidimessage = (event) => { push.receive_midi(event.data) }; // bind MIDI input
});
```

A static factory method is provided to encapsulate binding the Push wrapper to Web MIDI API input/output ports named "Ableton Push User Port"
```
const Push = require('./push.js');
navigator.requestMIDIAccess({ sysex: false })
    .then(Push.create_bound_to_web_midi_api)
    .then((push) => {
        // do stuff with the wrapper here    
    });
```

## Buttons

Individual buttons can be bound to with the below commands by replacing `BUTTON_NAME` with the `name_of_the_button`

(do I want a long list of button names here?)

### Control events
```
push.buttons.BUTTON_NAME.on('pressed', () => console.log('BUTTON_NAME pressed'));
push.buttons.BUTTON_NAME.on('released', () => console.log('BUTTON_NAME released'));
```

### Feedback commands
```
push.buttons.BUTTON_NAME.led_on()
push.buttons.BUTTON_NAME.led_off()
```

## Knobs

The 11 knobs on the hardware can emit events when turned, and are bound by name

(Do I want a list of knob names here?)

### Control events
```
// delta gives the 'number of clicks' turned : positive = clockwise, negative = anti-clockwise
push.knobs.KNOB_NAME.on('turned', (delta) => { // do stuff here } );
```

# app example credits/enhancement

Initial version of the app based off blog post here: http://www.keithmcmillen.com/blog/making-music-in-the-browser-web-midi-api/

I intend to create my own example app to include with the wrapper to demonstrate its use...

# Disclaimer

The code is written using javascript [ES2015/ES6](http://es6-features.org/) so expects native Promises and other language features to be available. It is only **known** to work in Google Chrome/OS X...