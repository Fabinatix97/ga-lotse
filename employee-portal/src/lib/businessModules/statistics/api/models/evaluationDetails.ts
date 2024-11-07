/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export interface EvaluationDetails {
  businessModule: string;
  attributeLabels: string[];
  analyses: {
    name: string;
    diagramTitles: string[];
  }[];
}
