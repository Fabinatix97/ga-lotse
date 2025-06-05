/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";

import {
  FilterTemplate,
  FilterTemplatesProps,
  FilterValue,
} from "@eshg/lib-employee-portal";

import { UseAddFilterTemplate } from "@/lib/businessModules/statistics/api/mutations/useAddFilterTemplate";

export interface UseFilterTemplateProps {
  filterTemplates: FilterTemplate[];
  onActiveFilterValuesChanged: (activeFilterValues: FilterValue[]) => void;
  addFilterTemplate: (
    useAddFilterTemplate: UseAddFilterTemplate,
  ) => Promise<string>;
  deleteFilterTemplate: (filterTemplateId: string) => void;
  getFilterTemplateFilters: (
    filterTemplateId: string,
  ) => Promise<FilterValue[]>;
  setOnActiveFilterValuesChangedCallback: (
    callback: (activeFilterValues: FilterValue[]) => void,
  ) => void;
}

export function useFilterTemplate({
  filterTemplates,
  onActiveFilterValuesChanged,
  addFilterTemplate,
  deleteFilterTemplate,
  getFilterTemplateFilters,
  setOnActiveFilterValuesChangedCallback,
}: UseFilterTemplateProps): FilterTemplatesProps {
  const [currentFilterTemplateId, setCurrentFilterTemplateId] = useState<
    string | null
  >(null);
  const [activeFilters, setActiveFilters] = useState<FilterValue[]>([]);

  function onFilterTemplateIdChanged(filterTemplateId: string | null) {
    setCurrentFilterTemplateId(filterTemplateId);

    if (filterTemplateId) {
      void getFilterTemplateFilters(filterTemplateId).then((filterValues) => {
        setActiveFilters(filterValues);
        onActiveFilterValuesChanged(filterValues);
      });
    }
  }

  function onActiveFilterValuesChangedCallback(filterValues: FilterValue[]) {
    setCurrentFilterTemplateId(null);
    setActiveFilters(filterValues);
  }

  useEffect(() => {
    setOnActiveFilterValuesChangedCallback(onActiveFilterValuesChangedCallback);
  }, [setOnActiveFilterValuesChangedCallback]);

  return {
    deleteTemplate: deleteFilterTemplate,
    selectedFilterTemplateId: currentFilterTemplateId,
    saveTemplate: (model) =>
      addFilterTemplate({
        name: model.templateName,
        filters: activeFilters,
      }),
    templates: filterTemplates,
    hasActiveFilters: activeFilters.length > 0,
    onFilterTemplateIdChanged: onFilterTemplateIdChanged,
  };
}
