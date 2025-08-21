/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { createColumnHelper } from "@tanstack/react-table";

import { ApiUser, ApiUserRole } from "@eshg/base-api";
import { useHasUserRoleCheck } from "@eshg/lib-employee-portal";
import {
  ExternalLink,
  InternalLinkIconButton,
  formatUserName,
} from "@eshg/lib-portal";

import { UserAvatar } from "@/lib/baseModule/components/users/UserAvatar";
import { routes as chatRoutes } from "@/lib/businessModules/chat/shared/routes";
import { sortUsersByName } from "@/lib/shared/helpers/users";

const columnHelper = createColumnHelper<ApiUser>();
const userColumns = [
  columnHelper.display({
    id: "avatar",
    header: "",
    cell: (props) => <UserAvatar size="sm" user={props.row.original} />,
    meta: {
      width: 48,
      canNavigate: {
        parentRow: true,
      },
      cellStyle: "icon",
      headerLabel: "Avatar",
    },
  }),
  columnHelper.accessor("firstName", {
    header: "Vorname",
    sortingFn: (a, b) =>
      formatUserName(a.original).localeCompare(formatUserName(b.original)),
    cell: (props) => props.getValue(),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("lastName", {
    header: "Nachname",
    sortingFn: (a, b) => sortUsersByName(a.original, b.original),
    cell: (props) => props.getValue(),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("email", {
    header: "E-Mail-Adresse",
    cell: (props) =>
      props.getValue() && (
        <ExternalLink href={`mailto:${props.getValue()}`}>
          {props.getValue()}
        </ExternalLink>
      ),
  }),
  columnHelper.accessor("phoneNumber", {
    header: "Telefonnummer",
    cell: (props) => props.getValue(),
    meta: {
      width: "25ch",
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("externalChatUsername", {
    header: "Chat",
    cell: (props) => {
      const value = props.getValue();
      return value ? (
        <InternalLinkIconButton
          aria-label="Direktnachricht"
          href={chatRoutes.userRoom(value)}
          color="primary"
          size="sm"
          variant="plain"
        >
          <ChatOutlinedIcon />
        </InternalLinkIconButton>
      ) : null;
    },
    meta: {
      width: "9ch",
      cellStyle: "button",
    },
  }),
];

export function useUserTableColumns() {
  return useHasUserRoleCheck(ApiUserRole.ChatUser)
    ? userColumns
    : userColumns.filter((column) => column.header !== "Chat");
}
