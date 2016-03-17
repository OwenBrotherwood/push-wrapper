const Push = require('../push.js'),
    foreach = require('lodash.foreach'),
    partial = require('lodash.partial'),
    Player = require('./player.js');

window.addEventListener('load', () => {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({ sysex: true })
            .then(Push.create_bound_to_web_midi_api)
            .then(off_we_go)
            .catch(function(error) { console.log(error.message) });
    } else {
        alert('No MIDI support in your browser');
    }
});

function off_we_go(bound_push) {
    var btn = document.getElementsByClassName('button');

    for (var i = 0; i < btn.length; i++) {
        var player = new Player();
        player.on('started', partial(buttonClicked, btn[i]));
        player.on('stopped', partial(buttonReleased, btn[i]));
        btn[i].addEventListener('mousedown', player.play);
    }
}

function buttonClicked(ui_btn) {
    ui_btn.classList.add('active');
}

function buttonReleased(ui_btn) {
    ui_btn.classList.remove('active');
}