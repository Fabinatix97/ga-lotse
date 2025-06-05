/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { FileDownload } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Stack } from "@mui/joy";
import Radio from "@mui/joy/Radio";
import { FormikErrors, FormikTouched } from "formik";

import { ApiContactCategory, ApiResponse } from "@eshg/base-api";
import {
  FileField,
  SchoolYearField,
  SearchContactField,
} from "@eshg/lib-employee-portal";
import {
  ButtonLink,
  EnumMap,
  FileType,
  InternalLinkButton,
  RadioGroupField,
  SetFieldValueHelper,
  useFileDownload,
} from "@eshg/lib-portal";
import { ApiLocationSelectionMode } from "@eshg/school-entry-api";

import { routes as baseRoutes } from "@/lib/baseModule/shared/routes";
import { useImportApi } from "@/lib/businessModules/schoolEntry/api/clients";
import { ImportDataValues } from "@/lib/businessModules/schoolEntry/features/procedures/importData/ImportDataSidebar";
import { ImportListType } from "@/lib/businessModules/schoolEntry/features/procedures/importData/importTypes";

interface ImportDataFieldsProps {
  listType: ImportListType;
  locationSelectionMode: ApiLocationSelectionMode;
  isDirectProcedureTypeAssignmentOnImport: boolean;
  setFieldValue: SetFieldValueHelper;
  setTouched: (
    touched: FormikTouched<ImportDataValues>,
    shouldValidate?: boolean,
  ) => Promise<void | FormikErrors<ImportDataValues>>;
}

interface DownloadListTemplateButtonProps {
  listType: ImportListType;
}

const DOWNLOAD_TEMPLATE_LINK_TEXT: EnumMap<ImportListType> = {
  [ImportListType.SchoolList]: "Beispiel-Datei für Schulliste herunterladen",
  [ImportListType.CitizenList]:
    "Beispiel-Datei für Bürgeramtsliste herunterladen",
  [ImportListType.PastProcedureList]: "Beispiel-Datei herunterladen",
};

function DownloadListTemplateButton(props: DownloadListTemplateButtonProps) {
  const linkText = DOWNLOAD_TEMPLATE_LINK_TEXT[props.listType];
  const importApi = useImportApi();
  let downloadFn: () => Promise<ApiResponse<Blob>>;
  switch (props.listType) {
    case ImportListType.SchoolList:
      downloadFn = () => importApi.getSchoolListTemplateRaw();
      break;
    case ImportListType.CitizenList:
      downloadFn = () => importApi.getCitizenListTemplateRaw();
      break;
    case ImportListType.PastProcedureList:
      downloadFn = () => importApi.getPastProcedureListTemplateRaw();
      break;
  }
  const templateFile = useFileDownload(downloadFn);

  return (
    <ButtonLink
      startDecorator={<FileDownload />}
      fontSize="sm"
      onClick={() => templateFile.download()}
    >
      {linkText}
    </ButtonLink>
  );
}

export function ImportDataFields(props: ImportDataFieldsProps) {
  function handleChangeListType(newValue: string) {
    void props.setTouched({});
    if (newValue === ImportListType.CitizenList) {
      void props.setFieldValue("schoolId", "");
    }
  }

  function handleClickPastProceduresButton() {
    void props.setFieldValue("listType", ImportListType.PastProcedureList);
    handleChangeListType(ImportListType.PastProcedureList);
  }

  const schoolYearRange =
    props.listType === ImportListType.PastProcedureList
      ? { numberOfYearsInFuture: 1, numberOfYearsInPast: 5 }
      : undefined;

  return (
    <Stack height="100%">
      <Stack gap={4} flexGrow={1}>
        {!props.isDirectProcedureTypeAssignmentOnImport &&
          props.listType !== ImportListType.PastProcedureList && (
            <RadioGroupField
              name="listType"
              orientation="horizontal"
              onChange={handleChangeListType}
            >
              <Radio value={ImportListType.SchoolList} label="Schulliste" />
              <Radio
                value={ImportListType.CitizenList}
                label="Bürgeramtsliste"
              />
            </RadioGroupField>
          )}
        {props.listType !== ImportListType.CitizenList && (
          <Stack gap={1}>
            <SearchContactField
              name="school"
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
              name="location"
              label="Wählen Sie ein Gesundheitsamt aus"
              category={ApiContactCategory.HealthDepartment}
            />
          )}
        <SchoolYearField
          name="schoolYear"
          label="Wählen Sie ein Schuljahr aus"
          required="Bitte ein Schuljahr auswählen."
          range={schoolYearRange}
        />
        <FileField
          name="file"
          label="Wählen Sie eine XLSX-Datei aus"
          accept={FileType.Xlsx}
          required="Bitte eine Datei auswählen."
        />
        <DownloadListTemplateButton listType={props.listType} />
      </Stack>
      {props.listType !== ImportListType.PastProcedureList && (
        <ButtonLink onClick={handleClickPastProceduresButton}>
          Abgeschlossene Untersuchungen importieren
        </ButtonLink>
      )}
    </Stack>
  );
}
