import { INavigation, BrowserNavigation } from "../navigation.service.ts";
import { Mock, It, Times } from "typemoq";
import test from "tape";

const createTestState = () => {
	const mockRedirect = Mock.ofInstance((url: string) => { /*no op*/ });
	const mockCurrentPath = Mock.ofInstance((() => "") as () => string);
	const navigation: INavigation = new BrowserNavigation(mockRedirect.object, mockCurrentPath.object);

	return {
		mockRedirect: mockRedirect,
		mockCurrentPath: mockCurrentPath,
		navigation: navigation
	};
};

test("util/navigation.service: Navigation.BrowserNavigation", r => {
	r.test("Given a browser navigation", t => {
		t.test("When observing", assert => {
			const state = createTestState();
			const mockObserve = Mock.ofInstance((url: string) => { /*no op*/ });

			state.mockCurrentPath.setup(f => f()).returns(v => "/expected");
			state.navigation.observe().subscribe(val => { mockObserve.object(val); });

			assert.doesNotThrow(() => mockObserve.verify(f => f("/expected"), Times.once()), "Then the observable has the current path");
			assert.end();
		});
		t.test("When getting the current path", assert => {
			const state = createTestState();
			state.mockCurrentPath.setup(f => f()).returns(v => "/expected");
			const result = state.navigation.current();

			assert.doesNotThrow(() => assert.equal(result, "/expected"), "Then the expected path is returned");
			assert.end();
		});
		t.test("When navigating to a path that is not the current path", assert => {
			const state = createTestState();
			state.mockCurrentPath.setup(f => f()).returns(v => "/expected");
			state.navigation.navigateTo("/some-path");

			assert.doesNotThrow(() => state.mockRedirect.verify(f => f("/some-path"), Times.once()), "Then the navigation function is invoked");
			assert.end();
		});
		t.test("When navigating to a path that is the current path", assert => {
			const state = createTestState();
			state.mockCurrentPath.setup(f => f()).returns(v => "/some-path");
			state.navigation.navigateTo("/some-path");

			assert.doesNotThrow(() => state.mockRedirect.verify(f => f(It.isAny()), Times.never()), "Then the navigation function is not invoked");
			assert.end();
		});
		t.end();
	});
	r.end();
});
