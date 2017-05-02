import syn from 'src/syn';

describe('move', () => {
	let testArea;

	before(() => {
		testArea = document.querySelector('#test-area');
	});

	afterEach(() => {
		while(testArea.children.length) {
			testArea.children[0].remove();
		}
	});

	it('should move the cursor', () => {
		document.addEventListener('mousemove', () => console.log('moved!'));

		syn.move({
			from: { clientX: 0, clientY: 0 },
			to: { clientX: 100, clientY: 100 }
		});
	});
});
