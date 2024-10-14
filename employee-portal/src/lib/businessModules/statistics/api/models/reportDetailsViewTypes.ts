/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FlatAttribute } from "./flatAttribute";
import { Evaluation } from "./statisticDetailsViewTypes";

export interface SeriesInfo {
  index: number;
  length: number;
}
export interface ReportDetailsView {
  id: string;
  seriesId: string;
  title: string;
  description?: string;
  series?: SeriesInfo;
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy?: string;
  dataSource: {
    name: string;
    datasetAmount: number;
    attributeLabels: string[];
  };
  evaluations: Evaluation[];
  attributes: FlatAttribute[];
  userId: string;
}
