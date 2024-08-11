'use client'
import { effectEvent, useUpdate } from "@/util";
import { useEffect, useRef, useState } from "react";

const keyMap: {[key: string]: string} = {
  "backspace": "\b",
  "enter": "\n",
  "tab": "\t"
};

export default function Home() {
  const currentStroke = useRef<{time: number, key: string}[]>([]);
  const inputElement = useRef<HTMLInputElement>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(0.2);
  const update = useUpdate();

  useEffect(() => {
    if(!inputElement.current)
      return
    return effectEvent("keydown", (evt: KeyboardEvent) => {
      currentStroke.current.push({time: new Date().getTime(), key: (keyMap[evt.key.toLowerCase()]??evt.key)});
      update();
      return;
    }, undefined, inputElement.current);
  }, []);

  return <div className="relative h-[100vh] flex p-8">
    <div className="flex flex-col items-center gap-2 w-1/2 h-full">
      <div className="w-4/6 text-lg m-24">
        <div className="mb-3">
          Type like a human, and get the robot output
          <br/>
          <input className="w-full" ref={inputElement}/>
        </div>
        Speed multiplier
        <br/>
        <input type="number" defaultValue={speedMultiplier} onChange={(ev) => setSpeedMultiplier(parseFloat(ev.target.value))}/>
      </div>
    </div>
    <div className="w-1/2 rounded-lg" style={{backgroundColor: "rgb(14 15 16)"}}>
      <div className="w-full bg-black px-2 py-1 font-mono text-slate-300 rounded-t-xl">Incoming Events</div>
      <div className="px-3 font-mono">
        [
          {currentStroke.current.map((v, i, arr) => {
            if(i === 0)
              return <div key={i}>&emsp;{`{"key": "${v.key}"}` + (arr.length === 1 ? "" : ",")}</div>;
            return <div key={i}>&emsp;{`{"key": "${v.key}", "time": ${((v.time - arr[i-1].time) * speedMultiplier).toFixed(2)}}` + (i !== arr.length-1 ? "," : "")}</div>;
          })}
        ]
      </div>
    </div>
  </div>;
}
