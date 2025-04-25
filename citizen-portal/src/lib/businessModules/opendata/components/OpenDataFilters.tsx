/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  CloseOutlined,
  DateRangeOutlined,
  FileCopyOutlined,
  SearchOutlined,
  TopicOutlined,
} from "@mui/icons-material";
import { Chip, ChipDelete, Input, Select, Stack, Typography } from "@mui/joy";
import { Fragment, startTransition, useId, useState } from "react";
import { isDefined } from "remeda";
import { useDebouncedCallback } from "use-debounce";

import { ButtonLink } from "@eshg/lib-portal/components/buttons/ButtonLink";
import {
  SelectOptions,
  optionsFromRecord,
} from "@eshg/lib-portal/components/formFields/SelectOptions";
import { YearInput } from "@eshg/lib-portal/components/inputs/YearInput";
import { isNonEmptyString } from "@eshg/lib-portal/helpers/guards";
import { ApiBusinessModule } from "@eshg/opendata-api";

import {
  SEARCH_PARAMS,
  parseYear,
} from "@/lib/businessModules/opendata/components/helpers";
import { useOpenDataFilterValues } from "@/lib/businessModules/opendata/components/useOpenDataFilterValues";
import { fileTypeNames } from "@/lib/businessModules/opendata/shared/constants";
import { useTranslation } from "@/lib/i18n/client";
import { byBreakpoint } from "@/lib/shared/breakpoints";
import { ContentSheet } from "@/lib/shared/components/layout/contentSheet";
import {
  SearchParamReplacement,
  useReplaceSearchParams,
} from "@/lib/shared/hooks/searchParams/useReplaceSearchParams";

interface OpenDataFilterProps {
  isMobile: boolean;
}

export function OpenDataFilters({ isMobile }: OpenDataFilterProps) {
  const { t } = useTranslation(["opendata/overview"]);
  const WrapperComponent = isMobile ? ContentSheet : Fragment;

  const searchInputId = useId();
  const topicInputId = useId();

  const replaceSearchParams = useReplaceSearchParams();
  const sourceOptions = useSourceOptions();
  const filterValues = useOpenDataFilterValues();

  const hasSearchFilter = isNonEmptyString(filterValues.search);
  const hasTopicFilter = isDefined(filterValues.topic);
  const hasYearFilter = isNonEmptyString(filterValues.year);
  const hasFileTypeFilter = isNonEmptyString(filterValues.fileType);
  const hasActiveFilters =
    hasSearchFilter || hasTopicFilter || hasYearFilter || hasFileTypeFilter;

  const [search, setSearch] = useState<string>(filterValues.search ?? "");
  const [year, setYear] = useState<string>(filterValues.year ?? "");

  function updateFilterValue(replacement: SearchParamReplacement[]) {
    replaceSearchParams([
      ...replacement,
      { name: SEARCH_PARAMS.pageNumber, value: null },
    ]);
  }

  function resetSearchFilter() {
    updateFilterValue([{ name: SEARCH_PARAMS.search, value: null }]);
    setSearch("");
  }
  function resetTopicsFilter() {
    updateFilterValue([{ name: SEARCH_PARAMS.topic, value: null }]);
  }
  function resetYearFilter() {
    if (filterValues.year) {
      updateFilterValue([{ name: SEARCH_PARAMS.year, value: null }]);
    }
    setYear("");
  }
  function resetFileTypeFilter() {
    updateFilterValue([{ name: SEARCH_PARAMS.fileType, value: null }]);
  }
  function resetAllFilters() {
    if (!hasActiveFilters) {
      return;
    }

    setSearch("");
    setYear("");

    updateFilterValue(
      Object.values(SEARCH_PARAMS).map((param) => ({
        name: param,
        value: null,
      })),
    );
  }

  const onChangeSearch = useDebouncedCallback(
    (newValue: string) => {
      updateFilterValue([{ name: SEARCH_PARAMS.search, value: newValue }]);
    },
    250,
    { trailing: true },
  );
  const onChangeYear = useDebouncedCallback(
    (newValue: string | undefined) => {
      updateFilterValue([{ name: SEARCH_PARAMS.year, value: newValue }]);
    },
    250,
    { trailing: true },
  );
  function onChangeFileType(newValue: string | null) {
    updateFilterValue([{ name: SEARCH_PARAMS.fileType, value: newValue }]);
  }
  function onChangeTopic(newValue: string[]) {
    updateFilterValue([{ name: SEARCH_PARAMS.topic, value: newValue }]);
  }

  return (
    <>
      <WrapperComponent>
        <Stack
          gap={2}
          direction={byBreakpoint({ mobile: "column", desktop: "row" })}
          sx={{ "> *": { flex: "1" } }}
        >
          <Stack gap={1}>
            <Typography
              level="title-lg"
              component="label"
              htmlFor={searchInputId}
            >
              {t("filterSection.search")}
            </Typography>
            <Input
              type="search"
              slotProps={{
                input: {
                  role: "searchbox",
                },
              }}
              value={search}
              placeholder={t("filterSection.search")}
              startDecorator={<SearchOutlined />}
              sx={{ height: "40px" }}
              id={searchInputId}
              onChange={(event) => {
                setSearch(event.target.value);
                onChangeSearch(event.target.value);
              }}
            />
          </Stack>
          <Stack gap={1}>
            <Typography
              level="title-lg"
              component="label"
              htmlFor={topicInputId}
            >
              {t("filterSection.topic")}
            </Typography>
            <Select
              multiple
              aria-label={t("filterSection.selectTopic")}
              placeholder={t("filterSection.selectTopic")}
              startDecorator={<TopicOutlined />}
              value={filterValues.topic ?? []}
              sx={{ minHeight: "40px" }}
              id={topicInputId}
              renderValue={(modules) => (
                <Stack direction="row" gap={0.5} flexWrap="wrap">
                  {modules.map(({ label, value }) => (
                    <Chip key={value} color="primary">
                      {label}
                    </Chip>
                  ))}
                </Stack>
              )}
              onChange={(event, value) => {
                if (event !== null) {
                  onChangeTopic(value);
                }
              }}
            >
              <SelectOptions options={sourceOptions} />
            </Select>
          </Stack>
        </Stack>
      </WrapperComponent>
      <WrapperComponent>
        <Stack
          gap={2}
          direction={byBreakpoint({ mobile: "column", desktop: "row" })}
          sx={{ "> *": { flex: "1" } }}
        >
          <YearInput
            value={year}
            inputMode="numeric"
            aria-label={t("filterSection.yearPlaceholder")}
            placeholder={t("filterSection.yearPlaceholder")}
            startDecorator={<DateRangeOutlined />}
            sx={{ height: "40px" }}
            onChange={(event) => {
              event.target.focus();
              setYear(event.target.value);

              const filterValue = parseYear(event.target.value);
              onChangeYear(filterValue);
            }}
            onBlur={(event) => {
              const filterValue = parseYear(event.target.value);
              if (!isDefined(filterValue)) {
                resetYearFilter();
                event.target.value = "";
              }
            }}
          />
          <Select
            aria-label={t("filterSection.fileType")}
            placeholder={t("filterSection.fileType")}
            startDecorator={<FileCopyOutlined />}
            value={filterValues.fileType ?? null}
            sx={{ height: "40px" }}
            onChange={(event, value) => {
              if (event !== null) {
                onChangeFileType(value);
              }
            }}
          >
            <SelectOptions options={optionsFromRecord(fileTypeNames)} />
          </Select>
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={2}>
          <Stack
            direction="row"
            flexWrap="wrap"
            rowGap={2}
            columnGap={byBreakpoint({ mobile: 3, desktop: 2 })}
            sx={{
              ":not(:empty)": {
                flexBasis: byBreakpoint({ mobile: "100%", desktop: "auto" }),
              },
              minHeight: "28px",
            }}
          >
            {hasSearchFilter && (
              <ActiveFilter
                filterName={t("filterSection.search")}
                resetFilterValue={resetSearchFilter}
              />
            )}
            {hasTopicFilter && (
              <ActiveFilter
                filterName={t("filterSection.topic")}
                resetFilterValue={resetTopicsFilter}
              />
            )}
            {hasYearFilter && (
              <ActiveFilter
                filterName={t("filterSection.year")}
                resetFilterValue={resetYearFilter}
              />
            )}
            {hasFileTypeFilter && (
              <ActiveFilter
                filterName={t("filterSection.fileType")}
                resetFilterValue={resetFileTypeFilter}
              />
            )}
          </Stack>
          <ButtonLink
            underline="always"
            onClick={resetAllFilters}
            startDecorator={<CloseOutlined />}
            sx={{ fontWeight: 600, marginLeft: "auto" }}
          >
            {t("filterSection.resetAllFilters")}
          </ButtonLink>
        </Stack>
      </WrapperComponent>
    </>
  );
}

function useSourceOptions() {
  const { t } = useTranslation(["opendata/shared"]);

  return Object.values(ApiBusinessModule).map((businessModule) => ({
    value: businessModule,
    label: t(`sources.${businessModule}`),
  }));
}

function ActiveFilter({
  filterName,
  resetFilterValue,
}: {
  filterName: string;
  resetFilterValue: () => void;
}) {
  const { t } = useTranslation(["opendata/overview"]);
  return (
    <Chip
      color="primary"
      size="lg"
      sx={{ gap: 0.75 }}
      endDecorator={
        <ChipDelete
          aria-label={t("filterSection.removeFilter")}
          onDelete={() =>
            startTransition(() => {
              resetFilterValue();
            })
          }
        />
      }
    >
      {filterName}
    </Chip>
  );
}
