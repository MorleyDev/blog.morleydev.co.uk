import { INavigation, HashNavigation } from "../navigation.service.ts";
import { Mock, It, Times } from "typemoq";
import test from "tape";

const createTestState = () => {
	const mockGetHash = Mock.ofInstance((() => "") as () => string);
	const mockSetHash = Mock.ofInstance((s: string) => { /* no-op */ });
	const registeredCallbacks: ((ev: HashChangeEvent) => void)[] = [];
	const onHashChange: (callback: (ev: HashChangeEvent) => void) => void = cb => { registeredCallbacks.push(cb); };
	const navigation: INavigation = new HashNavigation(mockGetHash.object, mockSetHash.object, onHashChange);

	return {
		mockGetHash: mockGetHash,
		mockSetHash: mockSetHash,
		registeredCallbacks: registeredCallbacks,
		onHashChange: onHashChange,
		navigation: navigation
	};
};

test("util/navigation.service: Navigation.HashNavigation", r => {
	r.test("Given a hash-based navigation engine", t => {
		t.test("Then a callback is attached", assert => {
			const state = createTestState();

			assert.equal(state.registeredCallbacks.length, 1);
			assert.end();
		});
		t.test("When observing", assert => {
			const state = createTestState();

			const mockObserve = Mock.ofInstance((url: string) => { /*no op*/ });
			state.mockGetHash.setup(x => x()).returns(() => "#!/expected/path");
			state.navigation.observe().subscribe(val => { mockObserve.object(val); });

			assert.doesNotThrow(() => mockObserve.verify(f => f("/expected/path"), Times.once()), "Then the observable has the current path");
			assert.end();
		});
		t.test("When getting the current path and the hash is a path in the expected format", assert => {
			const state = createTestState();

			state.mockGetHash.setup(x => x()).returns(() => "#!/expected/path");
			const result = state.navigation.current();

			assert.doesNotThrow(() => assert.equal(result, "/expected/path"), "Then the expected result is returned");
			assert.end();
		});
		t.test("When getting the current path and the hash is not in a hashbang format", assert => {
			const state = createTestState();

			state.mockGetHash.setup(x => x()).returns(() => "#nonsense");
			const result = state.navigation.current();

			assert.doesNotThrow(() => assert.equal(result, "/"), "Then the expected result is returned");
			assert.end();
		});
		t.test("When navigating to a path", assert => {
			const state = createTestState();

			state.mockGetHash.setup(x => x()).returns(() => "#!/");
			state.navigation.navigateTo("/some/path");

			assert.doesNotThrow(() => state.mockSetHash.verify(x => x("#!/some/path"), Times.once()), "Then the hash is updated to the expected hashbang");
			assert.end();
		});
		t.test("When navigating to a path that is the current path", assert => {
			const state = createTestState();

			state.mockGetHash.setup(x => x()).returns(() => "#!/some/path");
			state.navigation.navigateTo("/some/path");

			assert.doesNotThrow(() => state.mockSetHash.verify(x => x(It.isAny()), Times.never()), "Then the hash is not updated");
			assert.end();
		});
		t.test("When onChange handlers are connected and a hashchange is triggered", assert => {
			const state = createTestState();

			let mockObserve: Mock<(url: string) => void>;
			let mockUnsubscribedObserve: Mock<(url: string) => void>;

			state.mockGetHash.setup(x => x()).returns(() => "#!/some/path");

			mockObserve = Mock.ofInstance((url: string) => { /*no op*/ });
			state.navigation.observe().subscribe(val => { mockObserve.object(val); });

			mockUnsubscribedObserve = Mock.ofInstance((url: string) => { /*no op*/ });
			state.navigation.observe().subscribe(val => { mockUnsubscribedObserve.object(val); }).unsubscribe();

			state.mockGetHash.setup(x => x()).returns(() => "#!/some/new/path");
			state.registeredCallbacks.forEach(h => h(({ } as any) as HashChangeEvent));

			assert.doesNotThrow(() => mockObserve.verify(f => f("/some/new/path"), Times.once()), "Then the observable is updated");
			assert.doesNotThrow(() => mockUnsubscribedObserve.verify(f => f("/some/new/path"), Times.never()), "Then the unsubscribed observable is not updated");
			assert.end();
		});
		t.end();
	});
	r.end();
});
