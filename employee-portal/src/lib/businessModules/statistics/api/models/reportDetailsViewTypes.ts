/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

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
  createdBy?: string;
  dataSource: {
    name: string;
    datasetAmount: number;
    attributeLabels: string[];
  };
  analyses: Analysis[];
  attributes: FlatAttribute[];
  userId: string;
}
