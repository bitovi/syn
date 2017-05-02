import assign from 'lodash/assign';
import kefir from 'kefir';

import move from './behaviors/move';

import touch from './listeners/touch';

const syn = {};

const emitter;
const stream = kefir.stream(em => emitter = emitter);

assign(syn, {
	stream,
	emitter,
	move: move(emitter)
});

touch(syn.stream);

window.syn = syn;

export default syn;
