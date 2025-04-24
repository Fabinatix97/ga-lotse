/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import {
  ButtonBar,
  DrawerProps,
  SidebarActions,
  SidebarContent,
  useSidebar,
} from "@eshg/lib-employee-portal";
import { Button, Divider, List, ListItem, Stack, Typography } from "@mui/joy";

import { useGetAnonymizationFailedDetails } from "@/lib/businessModules/statistics/api/queries/useGetAnonymizationFailedDetails";
import { DataSource } from "@/lib/businessModules/statistics/components/evaluations/SidebarSummary";
import { SlimInfoIconTooltipButton } from "@/lib/shared/components/buttons/IconTooltipButton";

export function useAnonymizationFailedSidebar() {
  return useSidebar({
    component: AnonymizationFailedSidebar,
  });
}

interface AnonymizationFailedSidebarProps extends DrawerProps {
  id: string;
  isReport?: boolean;
}

function AnonymizationFailedSidebar(props: AnonymizationFailedSidebarProps) {
  const details = useGetAnonymizationFailedDetails(props.id, props.isReport);
  return (
    <>
      <SidebarContent title="Anonymisierung fehlgeschlagen">
        <Stack gap={3}>
          <Typography level="body-md">
            Die Anonymisierung{" "}
            {props.isReport ? "des Reports" : "der Auswertung"} war nicht
            erfolgreich. Dies geschieht, wenn die Anzahl der Datenpunkte zu
            gering bzw. die Anzahl der ausgewählten Attribute zu hoch ist.
          </Typography>
          {!props.isReport && (
            <Typography level="body-md">
              Sie können eine neue Auswertung anlegen und über eine angepasste
              Auswahl von Attributen die Anonymisierung gewährleisten.
            </Typography>
          )}
          <Divider />
          <Typography level="h3" component="h2">
            Konfiguration der Auswertung
          </Typography>
          <DataSource dataSourceName={details.dataSourceName} />
          <AttributeList
            label="Quasi-Identifier"
            info="Allgemein bekannte Informationen, die in Kombination dazu geeignet sind, einen Datenpunkt zu reidentifizieren. Eine hohe Zahl an Quasi-Identifiern erschwert die Anonymisierung stark, da viele Kombinationsmöglichkeiten existieren."
            attributes={details.quasiIdentifier}
          />
          <AttributeList
            label="Sensible Attribute"
            info="Geheime Information, die durch die Anonymisierung vor Reidentifikation geschützt werden soll."
            attributes={details.sensitiveAttributes}
          />
          <AttributeList
            label="Nicht-sensible Attribute"
            info="Attribute, die weder reidentifizierend wirken, noch sensibel sind. Sie beeinflussen den Anonymisierungsprozess nicht und sind daher nicht die Ursache dafür, dass diese Anonymisierung fehlgeschlagen ist."
            attributes={details.insensitiveAttributes}
          />
        </Stack>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <Button
              variant="solid"
              color="primary"
              onClick={() => props.onClose()}
            >
              Schließen
            </Button>
          }
        />
      </SidebarActions>
    </>
  );
}

function AttributeList(props: {
  label: string;
  info: string;
  attributes: string[];
}) {
  if (props.attributes.length === 0) {
    return <></>;
  }

  return (
    <Stack gap={0.5}>
      <Stack flexDirection="row">
        <Typography level="title-md">{props.label}</Typography>
        <SlimInfoIconTooltipButton infoText={props.info} title={props.label} />
      </Stack>
      <List marker="disc">
        {props.attributes.map((it) => (
          <ListItem key={it}>
            <Typography level="title-sm">{it}</Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
