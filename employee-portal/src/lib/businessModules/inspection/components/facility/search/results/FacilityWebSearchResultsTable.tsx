/**
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button, Chip, Stack, Typography } from "@mui/joy";
import ChipDelete from "@mui/joy/ChipDelete";

import {
  ApiWebSearch,
  ApiWebSearchEntriesResponse,
  ApiWebSearchEntry,
  ApiWebSearchQuery,
} from "@eshg/inspection-api";
import {
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  UseTableControlResult,
  formatList,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { optionsFromRecord } from "@eshg/lib-portal/components/formFields/SelectOptions";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import {
  useDeleteWebSearchQuery,
  useSaveWebSearchQuery,
  useUpdateWebSearchEntry,
} from "@/lib/businessModules/inspection/api/mutations/webSearch";
import { useFacilityWebSearchImportSidebar } from "@/lib/businessModules/inspection/components/facility/search/FacilityWebSearchImportSidebar";
import {
  ignoredNames,
  webSearchStatusNames,
} from "@/lib/businessModules/inspection/shared/enums";
import { FacilityWebSearchFiltersSchema } from "@/lib/businessModules/inspection/shared/types";
import { SingleSelectFilter } from "@/lib/shared/components/tableFilters/SingleSelectFilter";
import { TextInputFilter } from "@/lib/shared/components/tableFilters/TextInputFilter";

import {
  createFacilitySearchResultColumns,
  createFacilitySearchResultSubRowColumns,
} from "./columns";

export function FacilityWebSearchResultsTable(
  props: Readonly<{
    webSearch: ApiWebSearch;
    filters: FacilityWebSearchFiltersSchema;
    data: ApiWebSearchEntriesResponse;
    loading: boolean;
  }>,
) {
  const { mutateAsync: updateWebSearchEntry } = useUpdateWebSearchEntry();
  const facilityWebSearchImportSidebar = useFacilityWebSearchImportSidebar();

  const tableControl = useTableControl({
    serverSideSorting: true,
  });

  const columns = createFacilitySearchResultColumns({
    changeIgnored,
    addFacility,
  });

  const subRowColumns = createFacilitySearchResultSubRowColumns();

  function addFacility(entry: ApiWebSearchEntry) {
    facilityWebSearchImportSidebar.open({
      webSearchEntry: entry,
    });
  }

  async function changeIgnored(entry: ApiWebSearchEntry, newValue: boolean) {
    await updateWebSearchEntry({
      entryId: entry.id,
      apiUpdateWebSearchEntryRequest: { ignored: newValue },
    });
    // optimistic update...
    //  the whole table will be reloaded by the query automatically after the mutation
    return newValue;
  }

  return (
    <>
      <TablePage
        fullHeight
        controls={
          <TableControls
            tableControl={tableControl}
            webSearchId={props.webSearch.id}
            filters={props.filters}
            savedQueries={props.webSearch.queries}
          />
        }
      >
        <TableSheet
          loading={props.loading}
          footer={
            <Pagination
              totalCount={props.data.totalElements}
              {...tableControl.paginationProps}
            />
          }
        >
          <DataTable
            data={props.data.entries}
            columns={columns}
            sorting={tableControl.tableSorting}
            subRowColumns={subRowColumns}
            striped
          />
        </TableSheet>
      </TablePage>
    </>
  );
}

function TableControls({
  tableControl,
  webSearchId,
  filters,
  savedQueries,
}: {
  tableControl: UseTableControlResult;
  webSearchId: string;
  filters: FacilityWebSearchFiltersSchema;
  savedQueries: ApiWebSearchQuery[];
}) {
  const snackbar = useSnackbar();
  const { mutateAsync: saveQuery } = useSaveWebSearchQuery();
  const { mutateAsync: deleteQuery } = useDeleteWebSearchQuery();

  async function handleSaveSearch() {
    const keywords = filters.keywords?.trim() ?? undefined;
    const facilityAddress = filters.address?.trim() ?? undefined;
    const facilityName = filters.name?.trim() ?? undefined;
    if (!keywords && !facilityAddress && !facilityName) {
      snackbar.notification("Bitte geben Sie erst Suchkriterien ein.");
      return;
    }
    const queryName = formatList([keywords, facilityAddress, facilityName]);
    await saveQuery({
      id: webSearchId,
      apiWebSearchSaveQueryRequest: {
        queryName,
        keywords,
        facilityAddress,
        facilityName,
      },
    });
  }

  async function handleDeleteSavedSearch(queryId: number) {
    await deleteQuery(
      { id: webSearchId, queryId },
      {
        onSuccess: () => {
          snackbar.confirmation("Gespeicherte Suche gelöscht.");
        },
      },
    );
  }

  function constructQueryURL(query: ApiWebSearchQuery) {
    const queryParams = new URLSearchParams();
    if (query.keywords) {
      queryParams.append("keywords", query.keywords);
    }
    if (query.facilityAddress) {
      queryParams.append("address", query.facilityAddress);
    }
    if (query.facilityName) {
      queryParams.append("name", query.facilityName);
    }
    return `/inspection/facility/search/${webSearchId}/results?${queryParams.toString()}`;
  }

  return (
    <Stack direction="column" gap={2}>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        <SingleSelectFilter
          searchParamName="status"
          placeholder="Status"
          options={optionsFromRecord(webSearchStatusNames)}
          tableControl={tableControl}
        />
        <TextInputFilter
          searchParamName="name"
          placeholder="Name"
          sx={{ flexGrow: 1 }}
          tableControl={tableControl}
        />
        <TextInputFilter
          searchParamName="address"
          placeholder="Adresse"
          sx={{ flexGrow: 1 }}
          tableControl={tableControl}
        />
        <TextInputFilter
          searchParamName="keywords"
          placeholder="Schlüsselwörter"
          sx={{ flexGrow: 1 }}
          tableControl={tableControl}
        />
        <SingleSelectFilter
          searchParamName="ignored"
          placeholder="Ignoriert?"
          options={optionsFromRecord(ignoredNames)}
          tableControl={tableControl}
        />
      </Stack>
      <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
        <Typography level="body-md">Gespeicherte Suchen:</Typography>
        {savedQueries.length > 0 ? (
          <>
            {savedQueries.map((query) => (
              <SavedSearchChip
                key={query.id}
                title={query.queryName}
                href={constructQueryURL(query)}
                onDelete={() => handleDeleteSavedSearch(query.id)}
              />
            ))}
          </>
        ) : (
          <Typography level="body-md">keine</Typography>
        )}
        <Stack direction="row" flexGrow={1} justifyContent="flex-end">
          <Button size="sm" variant="soft" onClick={handleSaveSearch}>
            <AddIcon />
            Suche speichern
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

function SavedSearchChip({
  title,
  href,
  onDelete,
}: {
  title: string;
  href: string;
  onDelete: () => void;
}) {
  return (
    <Chip
      color="primary"
      variant="soft"
      endDecorator={<ChipDelete onDelete={onDelete} />}
      slotProps={{ action: { component: "a", href: href } }}
    >
      {title}
    </Chip>
  );
}
