/**
 * Copyright 2026 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FileDownloadOutlined } from "@mui/icons-material";
import { Button, Chip } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { ColumnSort, createColumnHelper } from "@tanstack/react-table";

import { ApiUserRole } from "@eshg/base-api";
import {
  ButtonBar,
  DataTable,
  Pagination,
  PersonSearchForm,
  PersonSearchParams,
  TablePage,
  TableSheet,
  TogglePersonSearchButton,
  useHasUserRoleCheck,
  usePersonSearch,
  useTableControl,
} from "@eshg/lib-employee-portal";
import {
  PERSON_FIELD_NAME,
  UnstyledTabList,
  UnstyledTabPanel,
  UnstyledTabs,
  formatDate,
  formatDateTime,
  isNonEmptyArray,
  useFileDownload,
  useNavigation,
} from "@eshg/lib-portal";
import {
  ApiProcedureStatus,
  ApiProstituteProtectionProcedureType,
  ExportGdprDataToXlsxRequest,
} from "@eshg/prostitute-protection-api";

import { usePersonSearchOptions } from "../../api/queries/person";
import { routes } from "../../config/routes";
import { useProstituteProtectionApiClients } from "../../contexts/ProstituteProtectionApi";
import { useDecryptedPersons } from "../../contexts/decryptedPersons/DecryptedPersonsStoreProvider";
import {
  PROCEDURE_STATUS_COLORS,
  PROCEDURE_STATUS_VALUES,
  PROCEDURE_TYPE_VALUES,
} from "../../shared/constants";

interface PersonSearchResult {
  id: string;
  firstName: string;
  lastName: string;
  alias?: string;
  dateOfBirth: Date;
  procedureType: ApiProstituteProtectionProcedureType;
  appointmentStart?: Date;
  status: ApiProcedureStatus;
}

const initialSorting: ColumnSort = {
  id: "appointmentStart",
  desc: false,
};

const columnHelper = createColumnHelper<PersonSearchResult>();

function getProceduresColumns() {
  return [
    columnHelper.accessor("firstName", {
      header: PERSON_FIELD_NAME.firstName,
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("lastName", {
      header: PERSON_FIELD_NAME.lastName,
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("alias", {
      header: "Alias",
      cell: ({ getValue }) => getValue(),
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("dateOfBirth", {
      header: PERSON_FIELD_NAME.dateOfBirth,
      cell: ({ getValue }) => formatDate(getValue()),
      enableSorting: true,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("procedureType", {
      header: "Beratungstyp",
      cell: ({ getValue }) => PROCEDURE_TYPE_VALUES[getValue()],
      enableSorting: false,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("appointmentStart", {
      header: "Termin",
      cell: ({ getValue }) => formatDateTime(getValue()),
      enableSorting: true,
      meta: { width: 200, canNavigate: { parentRow: true } },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <Chip color={PROCEDURE_STATUS_COLORS[getValue()]}>
          {PROCEDURE_STATUS_VALUES[getValue()]}
        </Chip>
      ),
      enableSorting: false,
      meta: { width: 160, canNavigate: { parentRow: true } },
    }),
  ];
}

export function ProstituteProtectionPersonSearchTable() {
  const { formValues, ...personSearch } = usePersonSearch();
  const { addDecryptedPerson } = useDecryptedPersons();
  const { tryNavigate } = useNavigation();

  const tableControl = useTableControl({
    serverSideSorting: true,
    initialSorting,
    sortFieldName: "sortBy",
    sortDirectionName: "sortOrder",
  });

  const personSearchOptions = usePersonSearchOptions({
    search: {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      dateOfBirth: new Date(formValues.dateOfBirth),
    },
    page: tableControl.paginationProps,
    sorting: tableControl.tableSorting,
  });

  const { data, refetch: getPersons } = useQuery(personSearchOptions);
  const hasProstituteProtectionLeaderRole = useHasUserRoleCheck(
    ApiUserRole.ProstituteProtectionLeader,
  );

  return (
    <UnstyledTabs<PanelName> initialValue="personSearch">
      {({ currentValue, internalTabListFunction }) => (
        <TablePage
          data-testid="person-search-table"
          aria-label="Personensuche"
          controls={
            <ButtonBar
              left={
                <UnstyledTabList<PanelName>
                  tabListItems={[
                    {
                      component: (
                        <TogglePersonSearchButton
                          {...personSearch.buttonProps}
                          expanded={currentValue === "personSearch"}
                        />
                      ),
                      value: "personSearch",
                    },
                  ]}
                  internalTabListFunction={internalTabListFunction}
                />
              }
              right={[
                hasProstituteProtectionLeaderRole && (
                  <ExportGDPRDataButton
                    key="exportGDPRData"
                    disabled={!isNonEmptyArray(data?.elements)}
                    searchParams={personSearch.searchParams}
                  />
                ),
              ]}
              alignItems="flex-end"
              invertDomOrder
            />
          }
          search={
            currentValue === "personSearch" && (
              <UnstyledTabPanel<PanelName> value="personSearch">
                <PersonSearchForm
                  {...personSearch.formProps}
                  autoFocus
                  onChange={async (v) => {
                    personSearch.setValues(v);
                    await getPersons();
                  }}
                />
              </UnstyledTabPanel>
            )
          }
          fullHeight
        >
          <TableSheet
            loading={false}
            footer={
              <Pagination
                totalCount={data?.totalNumberOfElements ?? 0}
                {...tableControl.paginationProps}
              />
            }
          >
            <DataTable
              data={data?.elements ?? []}
              columns={getProceduresColumns()}
              rowNavigation={{
                onClick: (row) => () => {
                  addDecryptedPerson(row.original);
                  tryNavigate(routes.procedures.byId(row.original.id).details);
                },
                focusColumnAccessorKey: "appointmentStart",
              }}
            />
          </TableSheet>
        </TablePage>
      )}
    </UnstyledTabs>
  );
}

export function ExportGDPRDataButton({
  disabled,
  searchParams,
}: {
  disabled?: boolean;
  searchParams?: PersonSearchParams;
}) {
  const { prostituteProtectionApi } = useProstituteProtectionApiClients();
  const { download } = useFileDownload((values: ExportGdprDataToXlsxRequest) =>
    prostituteProtectionApi.exportGdprDataToXlsxRaw(values),
  );

  return (
    <Button
      size="md"
      variant="outlined"
      startDecorator={<FileDownloadOutlined />}
      disabled={disabled}
      onClick={async () => {
        if (
          searchParams?.searchFirstName &&
          searchParams.searchLastName &&
          searchParams.searchDateOfBirth
        ) {
          await download({
            apiProstituteProtectionProcedurePersonSearchParameters: {
              firstName: searchParams.searchFirstName,
              lastName: searchParams.searchLastName,
              dateOfBirth: new Date(searchParams.searchDateOfBirth),
            },
          });
        }
      }}
    >
      Daten exportieren
    </Button>
  );
}

type PanelName = "personSearch";
