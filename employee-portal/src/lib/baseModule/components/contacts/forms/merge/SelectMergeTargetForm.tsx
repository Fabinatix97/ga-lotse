/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  MultiFormButtonBar,
  SidebarActions,
  SidebarContent,
  SidebarForm,
} from "@eshg/lib-employee-portal";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { Button, Card, IconButton, Stack, Tooltip, Typography } from "@mui/joy";
import { Formik } from "formik";
import { ReactNode } from "react";

import { routes } from "@/lib/baseModule/shared/routes";

interface EntityWithId {
  id: string;
}

interface SelectMergeTargetFormProps<T> {
  firstContact: T;
  secondContact: T;
  onClose: () => void;
  onSubmit: (selected: "first" | "second") => void;
  renderCard: (data: T) => ReactNode;
}

export function SelectMergeTargetForm<T extends EntityWithId>({
  firstContact,
  secondContact,
  onClose,
  onSubmit,
  renderCard,
}: SelectMergeTargetFormProps<T>) {
  return (
    <Formik
      initialValues={{ swapped: false }}
      onSubmit={(values: { swapped: boolean }) =>
        onSubmit(values.swapped ? "second" : "first")
      }
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <SidebarForm>
          <SidebarContent title={"Kontakt zusammenführen"}>
            <Stack gap={2} sx={{ height: "100%" }}>
              <Typography>
                Die Kontakte werden zusammengeführt. Dabei bleibt die
                Änderungshistorie von diesem Kontakt bestehen:
              </Typography>
              <ContactCard
                contact={values.swapped ? firstContact : secondContact}
                renderCard={renderCard}
              />
              <Typography sx={{ textWrap: "pretty" }}>
                Alle Referenzen auf den folgenden Kontakt werden{" "}
                <Typography component="strong" fontWeight="bold">
                  unwiderruflich
                </Typography>{" "}
                ersetzt, und dessen Änderungshistorie geht verloren:
              </Typography>
              <ContactCard
                contact={values.swapped ? secondContact : firstContact}
                renderCard={renderCard}
              />
              <Button
                variant={"plain"}
                size={"sm"}
                sx={{
                  alignSelf: "end",
                }}
                startDecorator={<SwapVertIcon />}
                onClick={() => setFieldValue("swapped", !values.swapped)}
              >
                Tauschen
              </Button>
              <Typography sx={{ marginBlockStart: "auto" }}>
                <Typography component="strong" fontWeight="bold">
                  Hinweis:{" "}
                </Typography>
                Vor dem Zusammenführen können Sie im nächsten Schritt noch
                Änderungen vornehmen.
              </Typography>
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitting={isSubmitting}
              submitLabel={"Weiter"}
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}

function ContactCard<T extends EntityWithId>({
  contact,
  renderCard,
}: {
  contact: T;
  renderCard: (data: T) => ReactNode;
}) {
  return (
    <Card color={"primary"}>
      <Stack
        direction={"row"}
        gap={1}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {renderCard(contact)}
        <Tooltip title={"In neuem Tab anzeigen"} placement={"left"}>
          <IconButton
            component={"a"}
            color={"primary"}
            size={"sm"}
            href={routes.contacts.details(contact.id)}
            target={"_blank"}
            sx={{
              alignSelf: "start",
            }}
          >
            <OpenInNewIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
}
