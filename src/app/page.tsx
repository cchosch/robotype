'use client'
import { Copy, Reload } from "@/icons";
import { effectEvent, useUpdate } from "@/util";
import { FC, Fragment, useEffect, useMemo, useRef, useState } from "react";
import styles from "./app.module.scss";

const keyMap: {[key: string]: string} = {
  "backspace": "\b",
  "enter": "\n",
  "tab": "\t"
};

enum OutputType {
  JSONOutput,
  RustMacroOutput
}

type Keystroke = {time: number, key: string}[];

export default function Home() {
  const currentStroke = useRef<Keystroke>([]);
  const inputElement = useRef<HTMLInputElement>(null);
  const outputDiv = useRef<HTMLDivElement>(null);
  const [speedMultiplier, setSpeedMultiplier] = useState(0.2);
  const [outputType, setOutputType] = useState<OutputType>(OutputType.JSONOutput);
  const update = useUpdate();
  const copyText = useMemo(() => {
    return () => {
      if(!outputDiv.current)
        return;
      navigator.clipboard.writeText(outputDiv.current.innerText);
    };
  }, []);

  useEffect(() => {
    if(!inputElement.current)
      return
    return effectEvent("keydown", (evt: KeyboardEvent) => {
      currentStroke.current.push({time: new Date().getTime(), key: (keyMap[evt.key.toLowerCase()]??evt.key)});
      update();
    }, undefined, inputElement.current);
  }, []);

  return <div className={styles.pageLayout}>
    <div className={styles.typeSide}>
      <div className="m-12">
        <div className="mb-12 text-2xl">
          <div className="mb-6">
            Type like a human, get the robot output.
          </div>
          <input className="w-full" ref={inputElement}/>
        </div>
        Speed multiplier
        <br/>
        <input className="max-w-full" step={0.2} type="number" defaultValue={speedMultiplier} onChange={(ev) => setSpeedMultiplier(parseFloat(ev.target.value))}/>
      </div>
    </div>

    <div className={styles.outputSide}>
      <div className="w-full bg-black font-mono text-slate-300 rounded-t-xl flex justify-between overflow-x-auto gap-4">
        <div className="flex items-center whitespace-nowrap">
          <div className={`cursor-pointer rounded-tl-lg px-2 text-black h-full transition-all
          ${outputType === OutputType.JSONOutput ? styles.selected : styles.unselected}
          `} style={{
          }} onClick={() => setOutputType(OutputType.JSONOutput)}>
            JSON Output
          </div>

          <div className={`
            cursor-pointer px-2 bg-slate-600 text-black h-full transition-all
            ${outputType === OutputType.RustMacroOutput ? styles.selected : styles.unselected}
            `} onClick={() => setOutputType(OutputType.RustMacroOutput)}>Rust Macro Output</div>

        </div>
      </div>
      <div className={`p-3 font-mono overflow-y-auto min-w-full transition-all`} ref={outputDiv}>
        {currentStroke.current && (() => {
          switch(outputType) {
            case OutputType.JSONOutput:
              return <JSONOutput currentStroke={currentStroke.current} speedMultiplier={speedMultiplier}/>

            case OutputType.RustMacroOutput:
              return <RustMacroOutput currentStroke={currentStroke.current} speedMultiplier={speedMultiplier}/>

            default:
              return <></>;
          }
        })()}
      </div>
      <div className="flex flex-col items-center justify-end p-2 gap-1 absolute right-0 bottom-0">
        <div className={styles.hoverParent}>
          <div>Copy Text</div>
          <Copy height="20px" className="cursor-pointer" onClick={copyText}/>
        </div>
        <div className={styles.hoverParent}>
          <div>Wipe Keys</div>
          <Reload fill={"white"} height="20px" className="cursor-pointer" onClick={() => {
            currentStroke.current = [];
            update();
            if(inputElement.current)
              inputElement.current.value = "";
          }}/>
        </div>
      </div>
    </div>
  </div>;
}

type OutputProps = {
  currentStroke: Keystroke,
  speedMultiplier: number
}

const JSONOutput: FC<OutputProps> = ({currentStroke, speedMultiplier}) => {
  return <>
    {"{"}
    <div className="ml-2">
      multiplier: {speedMultiplier}
      <br/>
      keys: [
        {currentStroke.map((v, i, arr) => {
          if(i === 0)
            return <div key={i}>&emsp;{`{"key": "${v.key}"}` + (arr.length === 1 ? "" : ",")}</div>;
          return <div key={i}>&emsp;{`{"key": "${v.key}", "time": ${(v.time - arr[i-1].time).toFixed(0)}}` + (i !== arr.length-1 ? "," : "")}</div>;
        })}
      ]
    </div>
    {"}"}
  </>;
};

const RustMacroOutput: FC<OutputProps> = ({currentStroke, speedMultiplier}) => {
  return <>
    Keys {"{"}<br/>
      <div className="ml-2">
        multiplier: {speedMultiplier},
        <br/>
        strokes: vec![
          <div className="ml-2">
            {currentStroke.map((v, i, arr) => {
              if(i === 0)
                return <Fragment key={i}>key!({`"${v.key}"`}){arr.length === 1 ? "" : ","}</Fragment>;
              return <Fragment key={i}>
                <br/>
                {`key!("${v.key}", ${(v.time - arr[i-1].time).toFixed(0)})${i === arr.length-1 ? "" : ","}`}
              </Fragment>;
            })}
          </div>
        ]
      </div>
    {"}"}
  </>;
};

