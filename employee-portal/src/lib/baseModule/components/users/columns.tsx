/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUser } from "@eshg/base-api";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { InternalLinkIconButton } from "@eshg/lib-portal/components/navigation/InternalLinkIconButton";
import { formatUserName } from "@eshg/lib-portal/formatters/person";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import { createColumnHelper } from "@tanstack/react-table";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { UserAvatar } from "@/lib/baseModule/components/users/UserAvatar";
import { routes as chatRoutes } from "@/lib/businessModules/chat/shared/routes";
import { sortUsersByName } from "@/lib/shared/helpers/users";

const columnHelper = createColumnHelper<ApiUser>();
const userColumns = [
  columnHelper.display({
    id: "avatar",
    header: "",
    cell: (props) => <UserAvatar size={"sm"} user={props.row.original} />,
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
      ) : (
        <></>
      );
    },
    meta: {
      width: "9ch",
      cellStyle: "button",
    },
  }),
];

export function useUserTableColumns() {
  const showChatUsername = useIsNewFeatureEnabled(ApiBaseFeature.ChatUsername);
  return showChatUsername
    ? userColumns
    : userColumns.filter((column) => column.header !== "Chat");
}
