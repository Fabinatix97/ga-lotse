/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import CachedIcon from "@mui/icons-material/Cached";
import PersonIcon from "@mui/icons-material/PersonOutline";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import {
  Button,
  Dropdown,
  ListItemDecorator,
  Menu,
  MenuButton,
  MenuItem,
  Stack,
  ToggleButtonGroup,
} from "@mui/joy";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ApiContactType, ApiUserRole } from "@eshg/base-api";
import {
  CONTACT_CATEGORY_NAMES,
  Contact,
  DataTable,
  Pagination,
  TablePage,
  TableSheet,
  UseTableControlResult,
  mapRowSelectionToRowIds,
  useHasUserRoleCheck,
  useRowSelection,
  useTableControl,
} from "@eshg/lib-employee-portal";
import { buildEnumOptions, useSnackbar } from "@eshg/lib-portal";

import { ContactsTableTitle } from "@/lib/baseModule/components/contacts/ContactsTableTitle";
import { useMergeInstitutionContactSidebar } from "@/lib/baseModule/components/contacts/modals/MergeInstitutionContactSidebar";
import { useMergePersonContactSidebar } from "@/lib/baseModule/components/contacts/modals/MergePersonContactSidebar";
import { useUpdateContactSidebar } from "@/lib/baseModule/components/contacts/modals/UpdateContactSidebar";
import { routes } from "@/lib/baseModule/shared/routes";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";
import { SingleSelectFilter } from "@/lib/shared/components/tableFilters/SingleSelectFilter";

import { contactTableColumns } from "./columns";
import { contactSearchParamNames } from "./constants";

interface ContactsTableProps {
  elements: Contact[];
  totalNumberOfElements: number;
  onCreate: (
    type: "AddInstitutionContactRequest" | "AddPersonContactRequest",
  ) => void;
  onImport: (
    type: "AddInstitutionContactRequest" | "AddPersonContactRequest",
  ) => void;
  loading: boolean;
}

// Persists the selected contacts between pages and filtering,
// to allow merging contacts from different pages
function usePersistentSelectionCache({ elements }: { elements: Contact[] }) {
  const { rowSelection, rowSelectionProps } = useRowSelection<Contact>();

  const [selectedContacts, setSelectedContacts] = useState<
    Map<string, Contact>
  >(new Map());

  useEffect(() => {
    setSelectedContacts((previous) => {
      const contactIds = mapRowSelectionToRowIds(rowSelection);
      const newSelected = new Map();

      for (const contactId of contactIds) {
        newSelected.set(
          contactId,
          previous.get(contactId) ??
            elements.find((contact) => contact.id === contactId),
        );
      }

      return newSelected;
    });
  }, [elements, rowSelection]);

  return { selectedContacts, rowSelection, rowSelectionProps };
}

export function ContactsTable({
  elements,
  totalNumberOfElements,
  onCreate,
  onImport,
  loading,
}: ContactsTableProps) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseContactsWrite);
  const snackbar = useSnackbar();

  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
  });

  const institutionMergeSidebar = useMergeInstitutionContactSidebar();
  const personMergeSidebar = useMergePersonContactSidebar();
  const updateSidebar = useUpdateContactSidebar();

  const { selectedContacts, rowSelection, rowSelectionProps } =
    usePersistentSelectionCache({
      elements,
    });

  function handleMerge(contactIds: string[]) {
    const [first, second, ...rest] = contactIds;

    if (first === undefined || second === undefined || rest.length > 0) {
      snackbar.error("Sie können nur zwei Kontakte zusammenführen.");
      return;
    }

    const firstContact = selectedContacts.get(first)!;
    const secondContact = selectedContacts.get(second)!;

    if (
      firstContact.type === "PersonContact" &&
      secondContact.type === "PersonContact"
    ) {
      personMergeSidebar.open({
        firstContact: firstContact,
        secondContact: secondContact,
      });
    } else if (
      firstContact.type === "InstitutionContact" &&
      secondContact.type === "InstitutionContact"
    ) {
      institutionMergeSidebar.open({
        firstContact: firstContact,
        secondContact: secondContact,
      });
    } else {
      snackbar.error(
        "Sie können eine Person nicht mit einer Institution zusammenführen.",
      );
    }
  }

  return (
    <TablePage
      data-testid="contacts-table"
      fullHeight
      controls={
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={2}
          justifyContent="space-between"
        >
          <Stack direction="row" gap={2}>
            <SearchFilter
              label="Suche"
              searchParamName={contactSearchParamNames.name}
              tableControl={tableControl}
              relevanceSortFieldName="RELEVANCE"
            />
            <ContactTypeFilter tableControl={tableControl} />
            <SingleSelectFilter
              searchParamName={contactSearchParamNames.categories}
              placeholder="Objekttyp"
              options={buildEnumOptions(CONTACT_CATEGORY_NAMES)}
              tableControl={tableControl}
              sx={{
                // width of longest option "Kindertagesstätte"
                width: "20ch",
              }}
            />
          </Stack>
          {hasWritePerms && (
            <Stack direction="row" spacing={2}>
              <ImportContactButton onImport={onImport} />
              <CreateContactButton onCreate={onCreate} />
            </Stack>
          )}
        </Stack>
      }
    >
      <TableSheet
        loading={loading}
        title={
          hasWritePerms && (
            <ContactsTableTitle
              rowSelection={rowSelection}
              onMerge={handleMerge}
            />
          )
        }
        footer={
          <Pagination
            totalCount={totalNumberOfElements}
            {...tableControl.paginationProps}
          />
        }
      >
        <DataTable
          data={elements}
          columns={contactTableColumns({
            hasWritePerms,
            onEdit: (contact) => updateSidebar.open({ contact }),
          })}
          sorting={tableControl.tableSorting}
          rowNavigation={{
            route: (row) => routes.contacts.details(row.original.id),
            focusColumnAccessorKey: "name",
          }}
          rowSelectionProps={rowSelectionProps}
        />
      </TableSheet>
    </TablePage>
  );
}

function CreateContactButton(props: Pick<ContactsTableProps, "onCreate">) {
  return (
    <Dropdown>
      <MenuButton
        startDecorator={<AddIcon />}
        endDecorator={<UnfoldMoreIcon />}
        color="primary"
        variant="solid"
      >
        Neuen Kontakt anlegen
      </MenuButton>
      <Menu sx={{ width: "15rem" }}>
        <MenuItem onClick={() => props.onCreate("AddPersonContactRequest")}>
          <ListItemDecorator>
            <PersonIcon />
          </ListItemDecorator>
          Person
        </MenuItem>
        <MenuItem
          onClick={() => props.onCreate("AddInstitutionContactRequest")}
        >
          <ListItemDecorator>
            <BusinessIcon />
          </ListItemDecorator>
          Institution
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

function ImportContactButton(props: Pick<ContactsTableProps, "onImport">) {
  return (
    <Dropdown>
      <MenuButton
        startDecorator={<CachedIcon />}
        color="primary"
        variant="outlined"
      >
        Kontakt Importieren
      </MenuButton>
      <Menu sx={{ width: "13rem" }}>
        <MenuItem onClick={() => props.onImport("AddPersonContactRequest")}>
          <ListItemDecorator>
            <PersonIcon />
          </ListItemDecorator>
          Person
        </MenuItem>
        <MenuItem
          onClick={() => props.onImport("AddInstitutionContactRequest")}
        >
          <ListItemDecorator>
            <BusinessIcon />
          </ListItemDecorator>
          Institution
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

function ContactTypeFilter(props: { tableControl: UseTableControlResult }) {
  const params = useSearchParams();
  const value = params.get(contactSearchParamNames.type);

  return (
    <ToggleButtonGroup
      aria-label="Typ Filtern"
      value={value}
      onChange={(_, newValue) => {
        props.tableControl.setFilter(
          [
            {
              name: contactSearchParamNames.type,
              value: newValue ?? undefined,
            },
          ],
          true,
        );
      }}
    >
      <Button value={ApiContactType.Person}>Person</Button>
      <Button value={ApiContactType.Institution}>Institution</Button>
    </ToggleButtonGroup>
  );
}
