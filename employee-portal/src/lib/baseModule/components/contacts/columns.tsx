/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import EditIcon from "@mui/icons-material/EditOutlined";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PersonIcon from "@mui/icons-material/PersonOutlineOutlined";
import InstitutionIcon from "@mui/icons-material/VillaOutlined";
import { Stack } from "@mui/joy";
import { createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import {
  ActionsMenu,
  CONTACT_CATEGORY_NAMES,
  Contact,
  isInstitutionContact,
} from "@eshg/lib-employee-portal";

import {
  fullContactName,
  getContactAddressLine,
} from "@/lib/baseModule/components/contacts/helpers";
import { routes } from "@/lib/baseModule/shared/routes";

const columnHelper = createColumnHelper<Contact>();

export function contactTableColumns({
  hasWritePerms,
  onEdit,
}: {
  hasWritePerms: boolean;
  onEdit: (contact: Contact) => void;
}) {
  return [
    columnHelper.accessor("type", {
      header: "",
      enableSorting: false,
      cell: (props) => <ContactType type={props.getValue()} />,
      meta: {
        width: 40,
        canNavigate: {
          parentRow: true,
        },
        headerLabel: "Typ",
        cellStyle: "icon",
      },
    }),
    columnHelper.accessor("name", {
      header: "Name",
      cell: (props) => fullContactName(props.row.original),
      meta: {
        width: 250,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("category", {
      header: "Objekttyp",
      cell: (props) =>
        isInstitutionContact(props.row.original) &&
        isDefined(props.row.original.category)
          ? CONTACT_CATEGORY_NAMES[props.row.original.category]
          : undefined,
      meta: {
        width: 250,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("phoneNumbers", {
      header: "Telefonnr.",
      enableSorting: false,
      cell: (props) => props.getValue()?.at(0),
      meta: {
        width: 250,
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.accessor("contactAddress", {
      header: "Adresse",
      enableSorting: false,
      cell: (props) => getContactAddressLine(props.getValue()),
      meta: {
        canNavigate: {
          parentRow: true,
        },
      },
    }),
    columnHelper.display({
      header: "Aktionen",
      id: "navigationControl",
      cell: (props) => (
        <ActionsMenu
          actionItems={[
            {
              label: "Anzeigen",
              startDecorator: <FullscreenIcon />,
              onClick: routes.contacts.details(props.row.original.id),
            },
            ...(hasWritePerms
              ? [
                  {
                    label: "Bearbeiten",
                    startDecorator: <EditIcon />,
                    onClick: () => onEdit(props.row.original),
                  },
                ]
              : []),
          ]}
        />
      ),
      meta: {
        width: 96,
        cellStyle: "button",
      },
    }),
  ];
}

function ContactType({ type }: { type: string }) {
  return (
    <Stack justifyContent={"center"}>
      {type === "PersonContact" ? (
        <PersonIcon
          size={"sm"}
          aria-hidden={false}
          titleAccess={"Person"}
          aria-label={"Person"}
        />
      ) : (
        <InstitutionIcon
          size={"sm"}
          aria-hidden={false}
          titleAccess={"Institution"}
          aria-label={"Institution"}
        />
      )}
    </Stack>
  );
}
