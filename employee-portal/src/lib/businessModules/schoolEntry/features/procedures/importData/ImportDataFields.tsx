/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiContactCategory } from "@eshg/employee-portal-api/base";
import { ApiLocationSelectionMode } from "@eshg/employee-portal-api/schoolEntry";
import { DownloadLink } from "@eshg/lib-portal/api/files/DownloadLink";
import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { InternalLinkButton } from "@eshg/lib-portal/components/navigation/InternalLinkButton";
import { SetFieldValueHelper } from "@eshg/lib-portal/types/form";
import { FileDownload } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Stack } from "@mui/joy";
import Radio from "@mui/joy/Radio";

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";
import { useSchoolEntryApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { ImportListType } from "@/lib/businessModules/schoolEntry/features/procedures/importData/importTypes";
import { SchoolYearField } from "@/lib/businessModules/schoolEntry/features/procedures/shared/schoolYear";
import { RadioGroupField } from "@/lib/shared/components/formFields/RadioGroupField";
import { SearchContactField } from "@/lib/shared/components/formFields/SearchContactField";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";

interface ImportDataFieldsProps {
  listType: ImportListType;
  requireSchoolYear: boolean;
  locationSelectionMode: ApiLocationSelectionMode;
  setFieldValue: SetFieldValueHelper;
}

interface DownloadListTemplateButtonProps {
  listType: ImportListType;
}

function DownloadListTemplateButton(props: DownloadListTemplateButtonProps) {
  const templateName =
    props.listType === ImportListType.CitizenList
      ? "Bürgeramtsliste"
      : "Schulliste";
  const schoolEntryApi = useSchoolEntryApi();
  const templateFile = useFileDownload(
    props.listType === ImportListType.CitizenList
      ? () => schoolEntryApi.getCitizenListTemplateRaw()
      : () => schoolEntryApi.getSchoolListTemplateRaw(),
  );

  return (
    <DownloadLink
      downloadContainerRef={templateFile.downloadContainerRef}
      startDecorator={<FileDownload />}
      fontSize="sm"
      onDownload={() => templateFile.download()}
    >
      Beispiel-Datei für {templateName} herunterladen
    </DownloadLink>
  );
}

export function ImportDataFields(props: ImportDataFieldsProps) {
  function handleChangeListType(newValue: string) {
    if (newValue === ImportListType.CitizenList) {
      void props.setFieldValue("schoolId", "");
    }
  }

  return (
    <Stack gap={4}>
      <RadioGroupField
        name="listType"
        orientation="horizontal"
        onChange={handleChangeListType}
      >
        <Radio value={ImportListType.SchoolList} label="Schulliste" />
        <Radio value={ImportListType.CitizenList} label="Bürgeramtsliste" />
      </RadioGroupField>
      {props.listType === ImportListType.SchoolList && (
        <Stack gap={1}>
          <SearchContactField
            name="schoolId"
            label="Wählen Sie eine Schule aus"
            category={ApiContactCategory.School}
          />
          <InternalLinkButton
            href={baseRoutes.contacts.index}
            size="sm"
            variant="plain"
            startDecorator={<AddIcon />}
            sx={{ alignSelf: "flex-start" }}
          >
            Neue Schule anlegen
          </InternalLinkButton>
        </Stack>
      )}
      {props.listType === ImportListType.SchoolList &&
        props.locationSelectionMode ===
          ApiLocationSelectionMode.HealthDepartment && (
          <SearchContactField
            name="locationId"
            label="Wählen Sie ein Gesundheitsamt aus"
            category={ApiContactCategory.HealthDepartment}
          />
        )}
      {props.requireSchoolYear && (
        <SchoolYearField
          name="schoolYear"
          label="Wählen Sie ein Schuljahr aus"
          required="Bitte ein Schuljahr auswählen."
        />
      )}
      <FileField
        name="file"
        label="Wählen Sie eine XLSX-Datei aus"
        accept={FileType.Xlsx}
        required="Bitte eine Datei auswählen."
      />
      <DownloadListTemplateButton listType={props.listType} />
    </Stack>
  );
}
