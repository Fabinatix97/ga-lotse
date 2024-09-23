/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { SaveDiagramStepFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateDiagramSidebar/SaveDiagramStep/saveDiagramStepFormModel";
import { SetFiltersStepFormModel } from "@/lib/businessModules/statistics/components/statistics/details/CreateDiagramSidebar/SetFiltersStep/setFiltersStepFormModel";

export type CreateDiagramFormModel = SetFiltersStepFormModel &
  SaveDiagramStepFormModel;
