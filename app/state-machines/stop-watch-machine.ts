import { assign, fromCallback, setup } from "xstate";

export const stopWatchMachine = setup({
  actors: {
    ticks: fromCallback(({ sendBack }) => {
      const interval = setInterval(() => {
        sendBack({ type: "TICK" });
      }, 10);
      return () => clearInterval(interval);
    }),
  },

  types: {
    context: {} as {
      elapsed: number;
    },
    events: {} as
      | { type: "start" }
      | { type: "reset" }
      | { type: "TICK" }
      | { type: "stop" },
  },
}).createMachine({
  id: "stop-watch",
  initial: "stopped",
  context: {
    elapsed: 0,
  },
  states: {
    stopped: {
      on: {
        start: "running",
      },
    },
    running: {
      invoke: {
        src: "ticks",
      },
      on: {
        TICK: {
          actions: assign({
            elapsed: ({ context }) => context.elapsed + 1,
          }),
        },
        stop: "stopped",
      },
    },
  },
  on: {
    reset: {
      actions: assign({
        elapsed: 0,
      }),
      target: ".stopped",
    },
  },
});
