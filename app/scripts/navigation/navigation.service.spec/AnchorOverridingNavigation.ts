import { INavigation, AnchorOverridingNavigation } from "../navigation.service.ts";
import { Mock, It, Times } from "typemoq";
import test from "tape";

class DumbNavigation implements INavigation {
	public connect(): void { throw new Error("Not Implemented"); }
	public navigateTo(newUrl: string): void { throw new Error("Not Implemented"); }
	public current(): string { throw new Error("Not Implemented"); }
	public observe(): any { throw new Error("Not Implemented"); }
}

const createTestState = () => {
	const mockNavigation = Mock.ofType(DumbNavigation);
	const onDocumentClickCallbacks = [] as ((ev: MouseEvent) => void)[];
	return {
		onDocumentClickCallbacks: onDocumentClickCallbacks,
		mockNavigation: mockNavigation,
		navigation: new AnchorOverridingNavigation(mockNavigation.object, cb => onDocumentClickCallbacks.push(cb))
	};
};

test("util/navigation.service: Navigation.AnchorOverridingNavigation", r => {
	r.test("Given a Document and decorated navigation", t => {
		t.test("Then a document callback is connected", assert => {
			const state = createTestState();

			assert.equal(state.onDocumentClickCallbacks.length, 1);
			assert.end();
		});
		t.test("When navigating to a path", assert => {
			const state = createTestState();

			state.navigation.navigateTo("/some/path");

			assert.doesNotThrow(() => state.mockNavigation.verify(n => n.navigateTo("/some/path"), Times.once()), "Then the internal navigation is invoked");
			assert.end();
		});
		t.test("When getting the current path", assert => {
			const state = createTestState();

			state.mockNavigation.setup(n => n.current()).returns(() => "/some/path");

			let result = state.navigation.current();

			assert.equal(result, "/some/path", "Then the expected path is returned");
			assert.end();
		});
		t.test("When connected and the document is clicked with an anchor element on an absolute path", c => {
			const state = createTestState();

			let mockGetAttribute = Mock.ofInstance(((tag: string) => "") as (tag: string) => string);
			let mockPreventDefault = Mock.ofInstance(() => { /* no-op */ });
			let mockClickEvent = {
				target: {
					tagName: "A",
					getAttribute: mockGetAttribute.object
				},
				preventDefault: mockPreventDefault.object
			};

			mockGetAttribute.setup(f => f(It.isAnyString())).returns(() => "/some/url");
			state.onDocumentClickCallbacks.forEach(cb => cb((mockClickEvent as any) as MouseEvent));

			c.doesNotThrow(() => mockGetAttribute.verify(d => d("href"), Times.once()), "Then the href is retrieved");
			c.doesNotThrow(() => mockPreventDefault.verify(f => f(), Times.once()), "Then the event default is prevented");
			c.doesNotThrow(() => state.mockNavigation.verify(n => n.navigateTo("/some/url"), Times.once()), "Then the inner is navigated to the expected path");
			c.end();
		});
		t.test("When connected and the document is clicked with an anchor element on a relative path", assert => {
			const state = createTestState();

			let mockGetAttribute: Mock<(tag: string) => string>;
			let mockPreventDefault: Mock<() => void>;
			let mockClickEvent: { target: { tagName: string, getAttribute: (tag: string) => string }, preventDefault: () => void };

			mockGetAttribute = Mock.ofInstance(((tag: string) => "") as (tag: string) => string);
			mockPreventDefault = Mock.ofInstance(() => { /* no-op */ });
			mockClickEvent = {
				target: {
					tagName: "A",
					getAttribute: mockGetAttribute.object
				},
				preventDefault: mockPreventDefault.object
			};

			mockGetAttribute.setup(f => f(It.isAnyString())).returns(() => "./some/url");
			state.onDocumentClickCallbacks.forEach(cb => cb((mockClickEvent as any) as MouseEvent));

			assert.doesNotThrow(() => mockGetAttribute.verify(g => g("href"), Times.once()), "Then the href is retrieved");
			assert.doesNotThrow(() => mockPreventDefault.verify(f => f(), Times.never()), "Then the event default is not prevented");
			assert.doesNotThrow(() => state.mockNavigation.verify(n => n.navigateTo(It.isAnyString()), Times.never()), "Then the inner is not navigated");
			assert.end();
		});
		t.test("When connected and the document is clicked with an element that is not an anchor element", assert => {
			const state = createTestState();

			let mockPreventDefault: Mock<() => void>;
			let mockClickEvent: { target: { tagName: string }, preventDefault: () => void };

			mockPreventDefault = Mock.ofInstance(() => { /* no-op */ });
			mockClickEvent = {
				target: {
					tagName: "DIV"
				},
				preventDefault: mockPreventDefault.object
			};

			state.onDocumentClickCallbacks.forEach(cb => cb((mockClickEvent as any) as MouseEvent));

			assert.doesNotThrow(() => mockPreventDefault.verify(f => f(), Times.never()), "Then the event default is not prevented");
			assert.doesNotThrow(() => state.mockNavigation.verify(n => n.navigateTo(It.isAnyString()), Times.never()), "Then the inner is not navigated");
			assert.end();
		});

		t.test("When connected and the document is clicked and the target is not an element", assert => {
			const state = createTestState();

			let mockPreventDefault: Mock<() => void>;
			let mockClickEvent: { target: { }, preventDefault: () => void };

			mockPreventDefault = Mock.ofInstance(() => { /* no-op */ });
			mockClickEvent = {
				target: { },
				preventDefault: mockPreventDefault.object
			};

			state.onDocumentClickCallbacks.forEach(cb => cb((mockClickEvent as any) as MouseEvent));

			assert.doesNotThrow(() => mockPreventDefault.verify(f => f(), Times.never()), "Then the event default is not prevented");
			assert.doesNotThrow(() => state.mockNavigation.verify(n => n.navigateTo(It.isAnyString()), Times.never()), "Then the inner is not navigated");
			assert.end();
		});
		t.test("When connected and the document is clicked with an anchor element that lacks a href", assert => {
			const state = createTestState();

			let mockGetAttribute: Mock<(tag: string) => (string | null)>;
			let mockPreventDefault: Mock<() => void>;
			let mockClickEvent: { target: { tagName: string, getAttribute: (tag: string) => (string | null) }, preventDefault: () => void };

			mockGetAttribute = Mock.ofInstance(((tag: string) => "") as (tag: string) => (string | null));
			mockPreventDefault = Mock.ofInstance(() => { /* no-op */ });
			mockClickEvent = {
				target: {
					tagName: "A",
					getAttribute: mockGetAttribute.object
				},
				preventDefault: mockPreventDefault.object
			};

			mockGetAttribute.setup(f => f(It.isAnyString())).returns(() => null);
			state.onDocumentClickCallbacks.forEach(cb => cb((mockClickEvent as any) as MouseEvent));

			assert.doesNotThrow(() => mockPreventDefault.verify(f => f(), Times.never()), "Then the event default is not prevented");
			assert.doesNotThrow(() => state.mockNavigation.verify(n => n.navigateTo(It.isAnyString()), Times.never()), "Then the inner is not navigated");
			assert.end();
		});
		t.end();
	});
	r.end();
});
