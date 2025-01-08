/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { TimeSpan } from "@/lib/shared/components/formFields/TimeSpanField";

export interface AddReportFormModel {
  name: string;
  description: string;
  timeSpan: TimeSpan;
}
