/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactType, ApiUserRole } from "@eshg/employee-portal-api/base";
import { buildEnumOptions } from "@eshg/lib-portal/helpers/form";
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
import { useState } from "react";

import { UpdateContactSidebar } from "@/lib/baseModule/components/contacts/modals/UpdateContactSidebar";
import { Contact } from "@/lib/baseModule/components/contacts/types";
import { routes } from "@/lib/baseModule/shared/routes";
import { contactCategoryNames } from "@/lib/baseModule/shared/translations";
import { Pagination } from "@/lib/shared/components/pagination/Pagination";
import { DataTable } from "@/lib/shared/components/table/DataTable";
import { TablePage } from "@/lib/shared/components/table/TablePage";
import { TableSheet } from "@/lib/shared/components/table/TableSheet";
import { SearchFilter } from "@/lib/shared/components/tableFilters/SearchFilter";
import { SingleSelectFilter } from "@/lib/shared/components/tableFilters/SingleSelectFilter";
import {
  UseTableControl,
  useTableControl,
} from "@/lib/shared/hooks/searchParams/useTableControl";
import { useHasUserRoleCheck } from "@/lib/shared/hooks/useAccessControl";

import { contactTableColumns } from "./columns";
import { contactSearchParamNames } from "./constants";

export interface ContactsTableProps {
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

export function ContactsTable({
  elements,
  totalNumberOfElements,
  onCreate,
  onImport,
  loading,
}: ContactsTableProps) {
  const hasWritePerms = useHasUserRoleCheck(ApiUserRole.BaseContactsWrite);
  const tableControl = useTableControl({
    serverSideSorting: true,
    sortFieldName: "sortKey",
  });

  const [editSidebar, setEditSidebar] = useState<{
    open: boolean;
    contact?: Contact;
  }>({ open: false });

  return (
    <>
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
                relevanceSortFieldName={"RELEVANCE"}
              />
              <ContactTypeFilter tableControl={tableControl} />
              <SingleSelectFilter
                searchParamName={contactSearchParamNames.category}
                placeholder={"Objekttyp"}
                options={buildEnumOptions(contactCategoryNames)}
                tableControl={tableControl}
                sx={{
                  // width of longest option "Gesundheitsamt"
                  width: "19ch",
                }}
              />
            </Stack>
            {hasWritePerms && (
              <Stack direction={"row"} spacing={2}>
                <ImportContactButton onImport={onImport} />
                <CreateContactButton onCreate={onCreate} />
              </Stack>
            )}
          </Stack>
        }
      >
        <TableSheet
          loading={loading}
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
              onEdit: (contact) => setEditSidebar({ open: true, contact }),
            })}
            sorting={tableControl.tableSorting}
            rowNavRoute={(row) => routes.contacts.details(row.original.id)}
            focusColumnHeader="Name"
          />
        </TableSheet>
      </TablePage>

      {hasWritePerms && (
        <UpdateContactSidebar
          open={editSidebar.open}
          contact={editSidebar.contact}
          onClose={() => setEditSidebar({ open: false })}
        />
      )}
    </>
  );
}

function CreateContactButton(props: Pick<ContactsTableProps, "onCreate">) {
  return (
    <Dropdown>
      <MenuButton
        startDecorator={<AddIcon />}
        endDecorator={<UnfoldMoreIcon />}
        color={"primary"}
        variant={"solid"}
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
        color={"primary"}
        variant={"outlined"}
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

function ContactTypeFilter(props: { tableControl: UseTableControl }) {
  const params = useSearchParams();
  const value = params.get(contactSearchParamNames.type);

  return (
    <ToggleButtonGroup
      aria-label={"Typ Filtern"}
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
