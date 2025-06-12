"use client"

import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"

import {useIsMobile} from "@/lib/use-mobile.ts"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card.tsx"
import {type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart.tsx"
import type {FilteredMeasurementData, MeasurementData} from "@/types/apiTypes.ts";


/**
 * Method for creating a diagram (specialized on a single measurement) for the analytics page
 *
 * @author Danilo Bleul
 * @since 1.0
 *
 * @param data The whole data fetched from the API function
 * @see FilteredMeasurementData
 * @param measurementKey the key which the data should be filtered to
 * @see MeasurementData
 *
 * @constructor
 */
export function ChartDataPerTime(
    { data, measurementKey }: {
        data: FilteredMeasurementData[],
        measurementKey: keyof MeasurementData
    }
) {
  const isMobile = useIsMobile()

  // Extract all unique controller IDs
  const controllerIds = Array.from(
      new Set(data.flatMap(entry => entry.entries.map(d => d.controllerID)))
  )

  // Create chart configuration based on controller IDs (for displaying)
  const chartConfig: ChartConfig = Object.fromEntries(
      controllerIds.map(id => [
        id,
        {
          label: id,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`
        }
      ])
  )

  // Filtering the chart data according to the measurementKey
  const chartData = data.map(entry => {
    const point: Record<string, string | number> = {
      date: entry.timeStampISO.toString()
    }
    for (const { controllerID, data: m } of entry.entries) {
      point[controllerID] = m[measurementKey]
    }
    return point
  })

  // Exporting card title
  const cardTitle = measurementKey.toString().toUpperCase()

  // Drawing the diagram
  return (
      <Card className="@container/card">
          {/* Header */}
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">Interactive diagram for {cardTitle} values</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
          >
              {/* Line-based chart */}
            <AreaChart
                data={chartData}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit"
                    })
                  }}
              />
                {/* Hovering element */}
              <ChartTooltip
                  cursor={false}
                  defaultIndex={isMobile ? -1 : chartData.length - 1}
                  content={
                    <ChartTooltipContent
                        labelFormatter={(value) => {
                          const date = new Date(value)
                          return date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit"
                          })
                        }}
                        indicator="dot"
                    />
                  }
              />
              {controllerIds.map((id) => (
                  <Area
                      key={id}
                      dataKey={id}
                      type="natural"
                      fill={chartConfig[id].color}
                      fillOpacity={0.1}
                      stroke={chartConfig[id].color}
                      animationDuration={0}
                  />
              ))}
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
  )
}
