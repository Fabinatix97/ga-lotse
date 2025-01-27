/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { ApiManualProgressEntry } from "@eshg/employee-portal-api/businessProcedures";
import { formatDateTime } from "@eshg/lib-portal/formatters/dateTime";
import {
  Button,
  Chip,
  Divider,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import { isDefined } from "remeda";

import { OverlayBoundary } from "@/lib/shared/components/boundaries/OverlayBoundary";
import { ButtonBar } from "@/lib/shared/components/buttons/ButtonBar";
import { useProgressEntriesConfig } from "@/lib/shared/components/procedures/progress-entries/ProgressEntriesContext";
import { useGetMetaDataHistory } from "@/lib/shared/components/procedures/progress-entries/queries/fileApi";
import { useGetManualProgressEntryHistory } from "@/lib/shared/components/procedures/progress-entries/queries/progressEntryApi";
import { HistoryItem } from "@/lib/shared/components/procedures/progress-entries/types";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";

export function DetailsHistory({
  entry,
  onBack,
}: {
  entry: ApiManualProgressEntry;
  onBack: () => void;
}) {
  const fileId =
    isDefined(entry.fileReference) &&
    !entry.fileReference.deleted &&
    entry.fileReference.type != "GenericFileReference"
      ? entry.fileReference?.fileId
      : undefined;

  return (
    <>
      <SidebarContent title="Änderungshistorie">
        <Tabs defaultValue={0}>
          <TabList tabFlex="auto">
            <Tab
              disabled={!isDefined(fileId)}
              sx={{
                "&.Mui-disabled": {
                  color: (theme) => theme.palette.text.primary,
                },
              }}
            >
              Bemerkung
            </Tab>
            {isDefined(fileId) && <Tab>Dateibeschreibung</Tab>}
          </TabList>
          <TabPanel value={0} sx={{ backgroundColor: "white" }}>
            <OverlayBoundary>
              <NoteHistory entry={entry} />
            </OverlayBoundary>
          </TabPanel>
          {isDefined(fileId) && (
            <TabPanel value={1} sx={{ backgroundColor: "white" }}>
              <OverlayBoundary>
                <FileDescriptionHistory fileId={fileId} />
              </OverlayBoundary>
            </TabPanel>
          )}
        </Tabs>
      </SidebarContent>
      <SidebarActions>
        <ButtonBar
          right={
            <Button color="neutral" variant="soft" onClick={onBack}>
              Zurück
            </Button>
          }
        ></ButtonBar>
      </SidebarActions>
    </>
  );
}

function NoteHistory({ entry }: { entry: ApiManualProgressEntry }) {
  const { progressEntryApi, progressEntryApiQueryKey } =
    useProgressEntriesConfig();
  const history = useGetManualProgressEntryHistory(
    progressEntryApi,
    progressEntryApiQueryKey,
    entry.progressEntryId,
  ).data;
  return <History items={history} />;
}

function FileDescriptionHistory({ fileId }: { fileId: string }) {
  const { fileApi, fileApiQueryKey } = useProgressEntriesConfig();
  const history = useGetMetaDataHistory(fileApi, fileApiQueryKey, fileId).data;
  return <History items={history} />;
}

function History({ items }: { items: HistoryItem[] | undefined }) {
  if (!isDefined(items)) return <></>;
  const currentState = items[0];
  const previousStates = items.slice(1);
  return (
    <>
      {isDefined(currentState) && (
        <>
          <Chip variant="solid" color="success">
            Aktueller Stand
          </Chip>
          <Stack
            gap={0.25}
            marginTop={2}
            marginBottom={3}
            data-testid="currentVersion"
          >
            <Typography level="body-sm" textColor="text.secondary">
              {formatDateTime(currentState.changedAt)}
            </Typography>
            <Typography level="title-md">
              {isDefined(currentState.text) ? currentState.text : "-"}
            </Typography>
          </Stack>
        </>
      )}
      <Divider />
      {previousStates.length > 0 && (
        <>
          <Typography level="title-md" marginY={2}>
            Historie
          </Typography>
          {previousStates.map((item) => (
            <Stack
              key={`${formatDateTime(item.changedAt)}-${item.text}`}
              gap={0.25}
              marginBottom={2}
              data-testid="historyEntry"
            >
              <Typography level="body-sm" textColor="text.secondary">
                {formatDateTime(item.changedAt)}
              </Typography>
              <Typography level="body-md">
                {isDefined(item.text) ? item.text : "-"}
              </Typography>
            </Stack>
          ))}
        </>
      )}
    </>
  );
}
