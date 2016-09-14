import { INavigation, HistoryStateNavigation } from "../navigation.service.ts";
import { Mock, It, Times } from "typemoq";
import test from "tape";

const createTestState = () => {
	const registeredCallbacks: ((ev: PopStateEvent) => void)[] = [];
	const onHistoryChange: (callback: (ev: PopStateEvent) => void) => void = cb => { registeredCallbacks.push(cb); };
	const mockGetCurrentPath = Mock.ofInstance((() => "") as () => string);
	const mockPushState = Mock.ofInstance((data?: any, title?: string, newUrl?: string) => { /* no-op */ });
	const navigation: INavigation = new HistoryStateNavigation(onHistoryChange, mockPushState.object, mockGetCurrentPath.object);

	return {
		registeredCallbacks: registeredCallbacks,
		onHistoryChange: onHistoryChange,
		mockGetCurrentPath: mockGetCurrentPath,
		mockPushState: mockPushState,
		navigation: navigation
	};
};

test("util/navigation.service: Navigation.HistoryStateNavigation", r => {
	r.test("Given a pushstate-based navigation engine", t => {
		t.test("Then a callback is attached", assert => {
			const state = createTestState();

			assert.equal(state.registeredCallbacks.length, 1);
			assert.end();
		});
		t.test("When observing", assert => {
			const state = createTestState();

			const mockObserve = Mock.ofInstance((url: string) => { /*no op*/ });
			state.mockGetCurrentPath.setup(x => x()).returns(() => "/expected/path");
			state.navigation.observe().subscribe(val => { mockObserve.object(val); });

			assert.doesNotThrow(() => mockObserve.verify(f => f("/expected/path"), Times.once()), "Then the observable has the current path");
			assert.end();
		});
		t.test("When getting the current path and the hash is a path in the expected format", assert => {
			const state = createTestState();
			state.mockGetCurrentPath.setup(x => x()).returns(() => "/expected/path");
			const result = state.navigation.current();

			assert.equal(result, "/expected/path", "Then the expected result is returned");
			assert.end();
		});
		t.test("When navigating to a path", assert => {
			const state = createTestState();
			state.mockGetCurrentPath.setup(x => x()).returns(() => "/");
			const mockObserve = Mock.ofInstance((url: string) => { /*no op*/ });

			state.navigation.observe().subscribe(val => { mockObserve.object(val); });
			state.navigation.navigateTo("/some/path");

			assert.doesNotThrow(() => state.mockPushState.verify(x => x(It.isValue({ }), undefined, "/some/path"), Times.once()), "Then the history is updated to the expected path and state");

			assert.doesNotThrow(() => mockObserve.verify(f => f("/some/path"), Times.once()), "Then the observable is updated");
			assert.end();
		});
		t.test("When navigating to a path that is the current path", assert => {
			const state = createTestState();
			state.mockGetCurrentPath.setup(x => x()).returns(() => "/some/path");
			state.navigation.navigateTo("/some/path");

			assert.doesNotThrow(() => state.mockPushState.verify(x => x(It.isAny(), It.isAny(), It.isAny()), Times.never()), "Then the history is not updated");
			assert.end();
		});
		t.test("When onChange handlers are connected and a pop state is triggered", assert => {
			const state = createTestState();
			state.mockGetCurrentPath.setup(x => x()).returns(() => "/some/path");

			const mockObserve = Mock.ofInstance((url: string) => { /*no op*/ });
			state.navigation.observe().subscribe(val => { mockObserve.object(val); });

			const mockUnsubscribedObserve = Mock.ofInstance((url: string) => { /*no op*/ });
			state.navigation.observe().subscribe(val => { mockUnsubscribedObserve.object(val); }).unsubscribe();

			state.mockGetCurrentPath.setup(x => x()).returns(() => "/some/new/path");
			state.registeredCallbacks.forEach(h => h(({ } as any) as PopStateEvent));

			assert.doesNotThrow(() => mockObserve.verify(f => f("/some/new/path"), Times.once()), "Then the observable is updated");
			assert.doesNotThrow(() => mockUnsubscribedObserve.verify(f => f("/some/new/path"), Times.never()), "Then the unsubscribed observable is not updated");
			assert.end();
		});
		t.end();
	});
	r.end();
});
