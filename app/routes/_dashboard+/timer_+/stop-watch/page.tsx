import { useMachine } from "@xstate/react";
import { Button } from "~/components/button";
import { stopWatchMachine } from "~/state-machines/stop-watch-machine";

const formatTime = (elapsedTime: number) => {
  const elapsedSeconds = elapsedTime / 1000;
  let seconds = (elapsedSeconds % 60).toFixed(2);
  if (Number(seconds) < 10) {
    seconds = `0${seconds}`;
  }
  let minutes: string | number = Math.floor(elapsedSeconds / 60) % 60;
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${minutes}:${seconds}`;
};

export default function TimerPage() {
  const [snapshot, send] = useMachine(stopWatchMachine);

  return (
    <div>
      <h1>StopWatch {formatTime(snapshot.context.elapsed)}</h1>

      <div className="flex gap-x-2">
        <Button onPress={() => send({ type: "start" })}>Start</Button>
        <Button onPress={() => send({ type: "stop" })}>Pause</Button>
        <Button onPress={() => send({ type: "reset" })}>Reset</Button>
        <Button onPress={() => send({ type: "LAP" })}>Lap</Button>
      </div>

      <div className="flex flex-col">
        {snapshot.context.laps.length > 0 &&
          snapshot.context.laps.map((item) => (
            <div key={item.startTime}>
              {formatTime(item.elapsed)} --- {formatTime(item.startTime)}
            </div>
          ))}
      </div>
    </div>
  );
}
