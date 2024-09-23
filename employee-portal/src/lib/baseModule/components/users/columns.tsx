/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiBaseFeature, ApiUser } from "@eshg/employee-portal-api/base";
import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { InternalLink } from "@eshg/lib-portal/components/navigation/InternalLink";
import { createColumnHelper } from "@tanstack/react-table";
import { isDefined } from "remeda";

import { useIsNewFeatureEnabled } from "@/lib/baseModule/api/queries/feature";
import { UserAvatar } from "@/lib/baseModule/components/users/UserAvatar";
import { routes as chatRoutes } from "@/lib/businessModules/chat/shared/routes";
import { fullName } from "@/lib/shared/components/users/userFormatter";
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
      fullName(a.original).localeCompare(fullName(b.original)),
    cell: (props) => props.getValue(),
    meta: {
      canNavigate: {
        parentRow: true,
      },
    },
  }),
  columnHelper.accessor("lastName", {
    header: "Name",
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
    cell: (props) =>
      isDefined(props.getValue()) ? (
        <InternalLink href={chatRoutes.userRoom(props.getValue()!)}>
          {props.getValue()}
        </InternalLink>
      ) : (
        <></>
      ),
  }),
];

export function useUserTableColumns() {
  const showChatUsername = useIsNewFeatureEnabled(ApiBaseFeature.ChatUsername);
  return showChatUsername
    ? userColumns
    : userColumns.filter((column) => column.header !== "Chat");
}
