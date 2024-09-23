/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ApiAuditLogSource,
  ApiAuditLogSourceFromJSON,
} from "@eshg/employee-portal-api/auditlog";
import { ApiUser } from "@eshg/employee-portal-api/base";
import { formatDate } from "@eshg/lib-portal/formatters/dateTime";
import { FeedOutlined } from "@mui/icons-material";
import { List, ListItem, Sheet, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useRef } from "react";

import { useGrantAuditLogAccess } from "@/lib/auditlog/mutations/auditlog";
import { useGetGetValidAuditLogGrantees } from "@/lib/auditlog/queries/auditlog";
import {
  ErrorHints,
  UserAutoCompleteField,
} from "@/lib/baseModule/components/auditlog/authorize/UserAutoCompleteField";
import { routes } from "@/lib/baseModule/shared/routes";
import { auditLogSourceNames } from "@/lib/shared/components/auditlog/constants";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { DetailsCell } from "@/lib/shared/components/detailsSection/DetailsCell";
import { DetailsColumn } from "@/lib/shared/components/detailsSection/DetailsColumn";
import { DetailsRow } from "@/lib/shared/components/detailsSection/DetailsRow";
import { FormButtonBar } from "@/lib/shared/components/form/FormButtonBar";
import {
  SidebarForm,
  SidebarFormHandle,
} from "@/lib/shared/components/form/SidebarForm";
import { useBuildRoutePreservingSearchParams } from "@/lib/shared/components/procedures/hooks/useBuildRoutePreservingSearchParams";
import { Sidebar } from "@/lib/shared/components/sidebar/Sidebar";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import { fullName } from "@/lib/shared/components/users/userFormatter";

interface AuditlogAuthorizeSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AuditLogAuthorizeSidebar({
  open,
  onClose,
}: Readonly<AuditlogAuthorizeSidebarProps>) {
  const { source: sourceParam, date: dateParam } = useParams();
  const source = ApiAuditLogSourceFromJSON(sourceParam);
  const date = new Date(dateParam as string);

  const { users } = useGetGetValidAuditLogGrantees(source, date).data;

  const router = useRouter();
  const buildRoutePreservingSearchParams =
    useBuildRoutePreservingSearchParams();

  const { openConfirmationDialog } = useConfirmationDialog();

  const grantAuditLogAccess = useGrantAuditLogAccess();

  const userSelection = useRef([] as ApiUser[]);

  async function handleAuthorizeConfirmationDialog() {
    await grantAuditLogAccess
      .mutateAsync(
        {
          source: source,
          date: date,
          idsOfGrantedUser: new Set(
            userSelection.current.map((user) => user.userId),
          ),
        },
        {
          onSuccess: () =>
            router.push(
              buildRoutePreservingSearchParams(routes.auditlog.authorize.index),
            ),
        },
      )
      .catch();
  }

  const formRef = useRef<SidebarFormHandle>(null);

  function handleCloseSidebar() {
    onClose();
    formRef.current?.resetForm();
  }

  return (
    <Sidebar open={open} onClose={handleCloseSidebar}>
      <Formik
        validate={(values) => {
          if (values.users.length < 1) {
            return { validForm: "false" };
          }
        }}
        initialValues={{ validForm: "", users: [] as ApiUser[] }}
        onSubmit={({ users }) => {
          userSelection.current = users;

          openConfirmationDialog({
            title: "Log File wirklich freigeben?",
            defaultDescriptionEnabled: false,
            children: (
              <AuditLogAuthorizeConfirmationDescription
                source={source}
                date={formatDate(date)}
                users={users}
              />
            ),
            confirmLabel: "Freigeben",
            onConfirm: handleAuthorizeConfirmationDialog,
          });
        }}
      >
        {({ errors, setFieldValue, values }) => (
          <SidebarForm ref={formRef}>
            <SidebarContent title={"Freigabeoptionen"}>
              <DetailsColumn>
                <AuditLogSheet date={date} source={sourceParam} />
                <Stack gap={2}>
                  <Typography level="title-md" sx={{ mt: 4 }}>
                    Log File freigeben
                  </Typography>
                  <Typography level="body-md">
                    Sie können die File nur für User mit der Rolle
                    &quot;Betriebsrat&quot; freigeben.
                  </Typography>
                  <UserAutoCompleteField
                    setFieldValue={setFieldValue}
                    options={users}
                    values={values.users}
                  />
                </Stack>
              </DetailsColumn>
              <ErrorHints erroneous={errors.validForm === "false"} />
            </SidebarContent>
            <SidebarActions>
              <FormButtonBar
                submitLabel={"Freigeben"}
                submitting={false}
                onCancel={handleCloseSidebar}
              />
            </SidebarActions>
          </SidebarForm>
        )}
      </Formik>
    </Sidebar>
  );
}

function AuditLogSheet({
  date,
  source,
}: {
  source: string | string[] | undefined;
  date: Date;
}) {
  return (
    <Sheet variant="soft">
      <DetailsRow alignItems="center" columnGap={4} rowGap={2}>
        <FeedOutlined />
        <DetailsCell
          name={"createdAt"}
          label={"Erstellungsdatum"}
          value={formatDate(date)}
        />
        <DetailsCell
          name={"source"}
          label={"Modul"}
          value={auditLogSourceNames[ApiAuditLogSourceFromJSON(source)]}
        />
      </DetailsRow>
    </Sheet>
  );
}

interface LogFileAuthorizeDescriptionProps {
  source: ApiAuditLogSource;
  date: string;
  users: ApiUser[];
}

function AuditLogAuthorizeConfirmationDescription({
  source,
  date,
  users,
}: LogFileAuthorizeDescriptionProps) {
  return (
    <>
      <Typography level="body-sm">
        Sie sind im Begriff, die Log File vom{" "}
        <Typography sx={{ fontWeight: "bold" }}>{date}</Typography> aus dem
        Modul{" "}
        <Typography sx={{ fontWeight: "bold" }}>
          {auditLogSourceNames[source]}
        </Typography>{" "}
        für folgende Personen freizugeben. Die Freigabe endet automatisch nach
        24 Stunden.
      </Typography>
      <List sx={{ listStyleType: "disc", ml: 2, p: 0 }}>
        {users.map((user) => (
          <ListItem sx={{ display: "list-item" }} key={user.userId}>
            <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
              {fullName(user)}
            </Typography>
          </ListItem>
        ))}
      </List>
    </>
  );
}
