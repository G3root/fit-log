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
      laps: { startTime: number; elapsed: number }[];
    },
    events: {} as
      | { type: "start" }
      | { type: "reset" }
      | { type: "TICK" }
      | { type: "stop" }
      | { type: "LAP" },
  },
}).createMachine({
  id: "stop-watch",
  initial: "stopped",
  context: {
    elapsed: 0,
    laps: [],
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
        LAP: {
          actions: assign({
            laps: ({ context }) => {
              const laps = [...context.laps];
              const latestLap = laps[laps.length - 1] ?? {
                startTime: 0,
                elapsedTime: 0,
              };

              laps.push({
                elapsed: context.elapsed - latestLap.startTime,
                startTime: context.elapsed,
              });

              return laps;
            },
          }),
        },
      },
    },
  },
  on: {
    reset: {
      actions: assign({
        elapsed: 0,
        laps: [],
      }),
      target: ".stopped",
    },
  },
});
