/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { DataSourceSensitivity } from "@/lib/businessModules/statistics/api/models/dataSourceSensitivity";

import { Analysis } from "./evaluationDetailsViewTypes";
import { FlatAttribute } from "./flatAttribute";

export interface ReportDetailsView {
  id: string;
  seriesId: string;
  title: string;
  description?: string;
  numberInSeries?: string;
  start: Date;
  end: Date;
  createdAt: Date;
  createdBy: string;
  dataSource: {
    name: string;
    datasetAmount: number;
    attributeLabels: string[];
    sensitivity: DataSourceSensitivity;
  };
  analyses: Analysis[];
  attributes: FlatAttribute[];
  userId: string | undefined;
  tooMuchDataForExport: boolean;
}
