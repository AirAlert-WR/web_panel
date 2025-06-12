import * as Icons from "@tabler/icons-react";
import {ChartDataPerTime} from "@/components/custom/embedded/analytics/chartDataPerTime.tsx";
import { FilteredMeasurementData, FilteredMeasurementDataSchema} from "@/types/apiTypes.ts";

import {get} from 'aws-amplify/api';
import {useEffect, useState} from "react";

export const DATA = {
    id: "analytics",
    title: "Analytics",
    icon: Icons.IconChartBar,
    component: Content,
    enabled: true,
}

function Content() {

    const [measurementData, setMeasurementData] = useState<FilteredMeasurementData[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function getMeasurementData() {
            try {
                const restOperation = get({
                    apiName: "AirAlertRestApi2",
                    path: "data/forTime",
                    options: {
                        queryParams: {
                            untilTimeStamp: new Date(Date.now() - 1000000).toISOString(),
                            segments: "20",
                        },
                    }
                });

                const response = await restOperation.response;
                const body = await response.body.json();

                const parsed = FilteredMeasurementDataSchema.array().parse(body);
                setMeasurementData(parsed);

            } catch (e) {
                console.error("API call failed", e);
                setError("Could not fetch data");
            }
        }

        getMeasurementData().then(() => {});
    }, []);

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (measurementData === null) {
        return <div className="text-gray-500">Load data...</div>;
    }

    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6 space-y-6">
                    <ChartDataPerTime data={measurementData} measurementKey={"pm2_5"} />
                    <ChartDataPerTime data={measurementData} measurementKey={"pm10"} />
                    <ChartDataPerTime data={measurementData} measurementKey={"co2"} />
                    <ChartDataPerTime data={measurementData} measurementKey={"temperature"} />
                    <ChartDataPerTime data={measurementData} measurementKey={"humidity"} />
                </div>
            </div>
        </div>
    );
}