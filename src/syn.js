import assign from 'lodash/assign';
import kefir from 'kefir';

import move from './behaviors/move';

import touch from './listeners/touch';

const syn = {};

let emitter;
const stream = kefir.stream(em => emitter = em);
stream.onValue();

assign(syn, {
	stream,
	emitter,
	move: move(emitter)
});

touch(syn.stream);

window.syn = syn;

export default syn;
