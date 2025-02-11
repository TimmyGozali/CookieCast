import { ForecastData } from "@/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { format } from "date-fns"


interface HourlyTemperaturePorps {
    data: ForecastData;
}

const HourleyTemperature = ({ data } : HourlyTemperaturePorps) => {

    const chartData = data.list.slice(0,8).map((item)=>({
        time: format(new Date(item.dt * 1000), "ha"),
        date: format(new Date(item.dt * 1000), "MM/dd/yy "),
        temp: Math.round(item.main.temp),
        feels_like: Math.round(item.main.feels_like),
    }))

    const temps = chartData.flatMap((item) => [item.temp, item.feels_like]);
    const chart_min = Math.min(...temps);
    const roundedMin = Math.floor(chart_min / 10) * 10;
    const chart_max = Math.max(...temps);
    const roundedMax = Math.ceil(chart_max / 5) * 5;

    const mainTicks = Array.from(
        { length: (roundedMax - roundedMin) / 10 + 1 },
        (_, i) => roundedMin + i * 10
      );

    const halfwayTicks = Array.from(
        { length: (roundedMax - roundedMin) / 10 + 1 },
        (_, i) => roundedMin + (i + 0.5) * 10
      );
      
      const allTicks = [...mainTicks, ...halfwayTicks].sort((a, b) => a - b);

  return (
    <Card className="flex-1">
        <CardHeader>
            <CardTitle>Today's Temperatures</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="h-[200px] w-full">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <LineChart data={chartData}>
                        <XAxis 
                            dataKey="time"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={true}
                            axisLine={true}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={true}
                            axisLine={true}
                            domain={[ Math.min(...allTicks), roundedMax ]}
                            ticks={allTicks}
                            tickFormatter={(value) => `${value}°`}
                        />

                        <CartesianGrid 
                            horizontal={true}
                            vertical={false}
                        />

                        <Tooltip 
                            content={({ active, payload }) => {
                               if (active && payload && payload.length) {
                                return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                        <div className="font-bold">{payload[0].payload.date}</div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Temperature</span>
                                                    <span className="font-bold">{payload[0].value}°</span>
                                                </div>
                                            </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">Feels like</span>
                                                    <span className="font-bold">{payload[1].value}°</span>
                                                </div>
                                        </div>
                                    </div>
                                );
                               }
                               return null;
                            }}
                        />

                        <Line 
                            type="monotone"
                            dataKey="temp"
                            stroke="#2563eb"
                            strokeWidth={2}
                            dot={true}
                        />
                        <Line 
                            type="monotone"
                            dataKey="feels_like"
                            stroke="#64748b"
                            strokeWidth={2}
                            dot={false}
                            strokeDasharray="5 5"
                        />
                    </LineChart>
                </ResponsiveContainer>

            </div>
        </CardContent>
    </Card>
  );
}

export default HourleyTemperature