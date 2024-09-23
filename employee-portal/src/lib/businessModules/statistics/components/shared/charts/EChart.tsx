/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EChartsOption } from "echarts";
import ReactEChartsCore from "echarts-for-react/lib/core";
import {
  BarChart as EChartBar,
  PieChart as EChartPie,
  ScatterChart as EChartScatter,
  LineChart as ELineChart,
  MapChart,
} from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import langDE from "echarts/lib/i18n/langDE";
import { CanvasRenderer, SVGRenderer } from "echarts/renderers";
import { useCallback, useEffect, useRef, useState } from "react";
import { mergeDeep } from "remeda";

import { theme } from "@/lib/baseModule/theme/theme";

import { ImageType } from "./types";

echarts.use([
  EChartBar,
  EChartPie,
  EChartScatter,
  ELineChart,
  MapChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  SVGRenderer,
  CanvasRenderer,
  LegendComponent,
]);
echarts.registerLocale("DE", langDE);

export interface ChartApi {
  exportAsImage: (imageType: ImageType) => void;
}

export function EChart(props: {
  option: EChartsOption;
  chartApi?: (chartApi: ChartApi) => void;
}) {
  const ref = useRef<ReactEChartsCore | null>(null);
  const [imageType, setImageType] = useState<ImageType>(ImageType.PNG);

  const exportAsImage = useCallback(() => {
    // Echarts is not actually ready after onChartReady. So the labels were not showing when trying to export the image.
    // Therefore, we opted for a simple timeout of 1 second and hope that it works most of the time.
    setTimeout(() => {
      const downloadLink = document.createElement("a");
      const instance = ref.current!.getEchartsInstance();
      instance.resize({
        height: 750,
        width: 1000,
      });
      downloadLink.href = instance.getDataURL();
      instance.resize({
        height: "auto",
        width: "auto",
      });
      downloadLink.download = "Diagramm";
      downloadLink.click();
    }, 1000);
  }, [ref]);

  const eChartApi = props.chartApi;
  useEffect(() => {
    if (!eChartApi) {
      return;
    }

    eChartApi({
      exportAsImage: (wantedImageType: ImageType) => {
        setImageType(wantedImageType);
        exportAsImage();
      },
    });
  }, [exportAsImage, eChartApi]);

  const options = mergeDeep(
    {
      textStyle: {
        fontFamily: "poppins",
        fontWeight: 400,
      },
      tooltip: {},
      legend: {
        textStyle: {
          color: theme.palette.text.secondary,
        },
      },
      color: ["#626c91", "#3fb1e3", "#6be6c1", "#96dee8", "#a0a7e6", "#c4ebad"],
    } as EChartsOption,
    props.option,
  );

  return (
    <ReactEChartsCore
      ref={ref}
      echarts={echarts}
      option={options}
      opts={{ locale: "DE", renderer: imageType }}
      style={{ flex: 1 }}
    />
  );
}
