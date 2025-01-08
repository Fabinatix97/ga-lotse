/**
 * Copyright 2025 cronn GmbH
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

      // Configure Chart for export
      /* eslint-disable */
      // @ts-ignore
      const seriesOld = instance.getOption().series;
      // @ts-ignore
      const isPieChart = seriesOld.find((it: any) => it.type === "pie");
      if (isPieChart) {
        // @ts-ignore
        const seriesNew = seriesOld.map((it: any) => ({
          ...it,
          top: 0,
        }));
        instance.setOption({
          legend: {
            show: false,
          },
          series: seriesNew,
        });
        instance.resize({
          height: 650,
          width: "auto",
        });
      } else {
        // Resize width first to cause the legend to adjust to a correct height
        instance.resize({
          width: 1000,
        });
        instance.setOption({
          legend: {
            type: "plain",
            top: "bottom",
          },
        });

        // The core problem is that legend and chart are drawn independent
        // of each other. Thus we need to reconfigure the chart for the export.
        // This requires us to access some private properties, which is why
        // this hacky part of code exists.
        // https://github.com/apache/echarts/issues/15654#issuecomment-2097407718
        // @ts-ignore
        const legend = instance._componentsViews.find(
          (entry: any) => entry.type === "legend.plain",
        );
        const legendHeight = legend?._backgroundEl.shape.height as number;
        instance.setOption({
          grid: {
            top: 32,
            bottom: legendHeight + 48,
          },
        });
        instance.resize({
          height: 750 + legendHeight,
        });
      }
      /* eslint-enable */
      downloadLink.href = instance.getDataURL();
      downloadLink.download = "Diagramm";
      downloadLink.click();

      // Configure chart back for normal use
      instance.setOption({
        legend: {
          show: true,
          type: "scroll",
          top: 8,
          right: 0,
        },
        grid: {
          top: 64,
          bottom: 48,
        },
        series: seriesOld,
      });
      instance.resize({
        height: "auto",
        width: "auto",
      });
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
        type: "scroll",
        top: 8,
        right: 0,
        textStyle: {
          color: theme.palette.text.secondary,
        },
      },
      grid: {
        top: 64,
        bottom: 48,
      },
      color: [
        "#226FB0",
        "#DC69AA",
        "#626C91",
        "#07A2A4",
        "#95706D",
        "#588DD5",
        "#C14089",
        "#9A7FD1",
        "#00815E",
        "#C05050",
        "#0073E6",
        "#897400",
        "#924AB8",
        "#D43F49",
        "#1876A6",
        "#59678C",
        "#054FB9",
        "#5A53D8",
        "#A33282",
        "#6F5553",
        "#0F7F39",
        "#B03620",
        "#015E1A",
        "#8906A0",
      ],
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
