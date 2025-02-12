/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { useFileDownload } from "@eshg/lib-portal/api/files/download";
import { FormAddMoreButton } from "@eshg/lib-portal/components/form/FormAddMoreButton";
import { FileType } from "@eshg/lib-portal/components/formFields/file/FileType";
import { ApiFileType } from "@eshg/lib-procedures-api";
import { ApiOmsFile } from "@eshg/official-medical-service-api";
import { Delete, FileDownloadOutlined } from "@mui/icons-material";
import { Stack } from "@mui/joy";
import { useFormikContext } from "formik";
import { isDefined } from "remeda";

import { useOmsFileApi } from "@/lib/businessModules/officialMedicalService/api/clients";
import { AddDocumentFormValues } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/AddDocumentForm";
import { DocumentFormValues } from "@/lib/businessModules/officialMedicalService/components/procedures/details/documents/DocumentForm";
import { FileCard } from "@/lib/shared/components/FileCard";
import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { useConfirmationDialog } from "@/lib/shared/hooks/useConfirmationDialog";
import { useToggle } from "@/lib/shared/hooks/useToggle";

interface FilesSectionProps {
  name: string;
  canAdd: boolean;
  withInitialField: boolean;
  addLabel?: string;
  files?: ApiOmsFile[];
}

export function FilesSection(props: Readonly<FilesSectionProps>) {
  const [active, toggleActive] = useToggle(props.withInitialField);
  const { openCancelDialog } = useConfirmationDialog();

  const { setFieldValue, setFieldTouched, values } = useFormikContext<
    AddDocumentFormValues | DocumentFormValues
  >();

  const omsFileApi = useOmsFileApi();

  const { download } = useFileDownload((fileId: string) =>
    omsFileApi.getDownloadFileRaw({ fileId }),
  );

  return (
    <Stack gap={2} data-testid="files">
      <Stack gap={1}>
        {props.canAdd &&
          isDefined(values.files) &&
          values.files.length >= 1 &&
          values.files.map((file, index) => (
            <FileCard
              key={`${file.name}.${index}`}
              name={file.name}
              type={file.type.split("/").pop()?.toUpperCase() as ApiFileType}
              creationDate={new Date(file.lastModified)}
              size={file.size}
              actions={[
                {
                  onClick: () => {
                    openCancelDialog({
                      onConfirm: async () => {
                        const newArr = isDefined(values.files)
                          ? values.files.filter((i) => i !== file)
                          : [];
                        if (newArr.length === 0) {
                          await setFieldTouched("files", false, false);
                          toggleActive();
                        }
                        await setFieldValue("files", newArr, false);
                      },
                      confirmLabel: "Löschen",
                      title: "Datei wirklich löschen?",
                      description:
                        "Möchten Sie die Datei wirklich löschen? Die Aktion kann nicht rückgängig gemacht werden.",
                    });
                  },
                  indicator: <Delete color="danger" />,
                  color: "primary",
                  name: "Löschen",
                },
              ]}
            />
          ))}
        {isDefined(props.files) &&
          props.files.map((file) => (
            <FileCard
              key={file.id}
              name={file.name}
              type={file.fileType as ApiFileType}
              creationDate={file.creationDate}
              size={file.size}
              actions={[
                {
                  onClick: () => download(file.id),
                  indicator: <FileDownloadOutlined />,
                  color: "primary",
                  name: "Herunterladen",
                },
                // ToDo: @saschl what about preview?
                // {
                //   onClick: () => preview(file.id),
                //   indicator: <DeleteOutlined />,
                //   color: "warning",
                //   name: "Preview",
                // },);
              ]}
            />
          ))}
      </Stack>
      {props.canAdd && (
        <>
          {active && (
            // ToDo: Bug in FileField validation? filetype validation runs via drag and drop only
            <FileField
              label="Datei hochladen (PDF, JPG oder PNG)"
              name="files"
              placeholder="Auswählen"
              accept={[FileType.Pdf, FileType.Jpeg, FileType.Png]}
              onChange={async (value) => {
                await setFieldTouched("files", true, false);
                await setFieldValue(
                  props.name,
                  [...values.files!, value],
                  false,
                );
                toggleActive();
              }}
            />
          )}
          <FormAddMoreButton
            onClick={() => {
              toggleActive();
            }}
          >
            {props.addLabel}
          </FormAddMoreButton>
        </>
      )}
    </Stack>
  );
}
