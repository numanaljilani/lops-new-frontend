import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DollarSign } from "lucide-react";
import Wave from "react-wavify";

function Bubble({color , title , value , setTab , btn , desc , callFunction , callFunc } : any) {
  return (
    <div className={`border  cursor-pointer  size-40 hover:scale-105 duration-200 shadow-lg hover:shadow-slate-400 rounded-full overflow-hidden relative flex justify-center items-center`} onClick={callFunc ? callFunction  :()=>btn ?   setTab(title) :  console.log("no")}>
      <Wave
        // fill="#60a5fa"
        fill={color}
        paused={true}

        style={{ display: "flex", position: "absolute", bottom: 0 , flex : 1 , height : '100%'}}
        
        options={{
          height: -20,


          amplitude: 2,
          // speed: 0.15,
          // points: 3,
        }}
      ></Wave>

      <Card
        x-chunk="dashboard-01-chunk-0"
        className="rounded-full size-64 flex justify-center items-center "
      >
        <div className="z-30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-md text-center font-medium">{title}</CardTitle>
            {/* <DollarSign className="h-4 w-4 text-muted-foreground" /> */}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-center">{value}</div>
            <div className="text-xs font-light text-gray-600 text-center">{desc}</div>
            {/* <div className="text-2xl font-bold">$45,231.89</div> */}
            {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}

export default Bubble;

