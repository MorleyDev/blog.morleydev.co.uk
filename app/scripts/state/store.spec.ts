import { ReduxStateStore } from "./store.ts";
import { Mock, It, Times } from "typemoq";
import test from "tape";

test("state/store.ReduxStateStore", t => {
	const createTestState = () => {
		const state = {
			store: new ReduxStateStore<{ counter: number }>({ counter: 0 }, {
				"increment": [
					(input, data) => Object.assign({}, input, { counter: input.counter + data }),
					(input, data) => Object.assign({}, input, { counter: input.counter + data * 2 })
				],
				"decrement": (input, data) => Object.assign({}, input, { counter: input.counter - data })
			}),
			activeSubscriptions: new Array(15).fill(0).map((_: any) => Mock.ofInstance(((input: { counter: number }) => { /* no-op */ }) as (input: { counter: number }) => void)),
			removedSubscriptions: new Array(15).fill(0).map((_: any) => Mock.ofInstance(((input: { counter: number }) => { /* no-op */ }) as (input: { counter: number }) => void))
		};

		state.activeSubscriptions.forEach(m => state.store.observe().subscribe(m.object));
		state.removedSubscriptions.map(m => state.store.observe().subscribe(m.object)).forEach(s => s.unsubscribe());
		return state;
	};

	t.test("When the state store is created", assert => {
		const state = createTestState();
		assert.doesNotThrow(
			() => {
				state.activeSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: 0 })), Times.once()));
				state.removedSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: 0 })), Times.once()));
			},
			"Then all the subscriptions have been fed the initial value"
		);
		assert.end();
	});
	t.test("State store: increment action", assert => {
		const state = createTestState();
		state.store.update("increment", 5);

		assert.deepEqual(state.store.getState(), { counter: 15 }, "Then the state is as expected");

		assert.doesNotThrow(() => state.activeSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: 15 })), Times.once())), "Then the subscribed subscriptions are invoked");
		assert.doesNotThrow(() => state.removedSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: 15 })), Times.never())), "Then the unsubscribed subscriptions are not invoked");
		assert.end();
	});
	t.test("State store: decrement action", assert => {
		const state = createTestState();

		state.store.update("decrement", 5);

		assert.deepEqual(state.store.getState(), { counter: -5 }, "Then the state is as expected");
		assert.doesNotThrow(() => state.activeSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: -5 })), Times.once())), "Then the subscriptions are invoked");
		assert.doesNotThrow(() => state.removedSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: -5 })), Times.never())), "Then the unsubscribed subscriptions are not invoked");
		assert.end();
	});
	t.test("State store: decrement action", assert => {
		const state = createTestState();

		state.store.update("no-op", { });

		assert.deepEqual(state.store.getState(), { counter: 0 }, "Then the state is as expected");
		assert.doesNotThrow(() => state.activeSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: 0 })), Times.exactly(2))), "Then the subscriptions are invoked");
		assert.doesNotThrow(() => state.removedSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: 0 })), Times.once())), "Then the unsubscribed subscriptions are not invoked");
		assert.end();
	});

	t.test("State store: setState", assert => {
		const state = createTestState();

		state.store.setState({ counter: 25 });

		assert.deepEqual(state.store.getState(), { counter: 25 }, "Then the state is as expected");
		assert.doesNotThrow(() => state.activeSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: 25 })), Times.once())), "Then the subscriptions are invoked as expected");
		assert.doesNotThrow(() => state.removedSubscriptions.forEach(s => s.verify(f => f(It.isValue({ counter: 25 })), Times.never())), "Then the unsubscribed subscriptions are not invoked as expected");
		assert.end();
	});
	t.end();
});
