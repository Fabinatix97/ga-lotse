/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { ApiInboxProgressEntryType } from "@eshg/employee-portal-api/businessProcedures";
import { InputField } from "@eshg/lib-portal/components/formFields/InputField";
import { SelectField } from "@eshg/lib-portal/components/formFields/SelectField";
import {
  buildEnumOptions,
  createFieldNameMapper,
} from "@eshg/lib-portal/helpers/form";
import {
  NestedFormProps,
  OptionalFieldValue,
} from "@eshg/lib-portal/types/form";
import { EnumMap } from "@eshg/lib-portal/types/helpers";
import { Grid, Stack, Typography } from "@mui/joy";
import { useFormikContext } from "formik";

import { TextareaField } from "@/lib/shared/components/formFields/TextareaField";
import {
  FileField,
  FileFieldProps,
} from "@/lib/shared/components/formFields/file/FileField";
import { FileType } from "@/lib/shared/components/formFields/file/FileType";
import { validateFile } from "@/lib/shared/helpers/validators";

import { CreateInboxProcedureValues } from "./CreateInboxProcedureForm";

export const EMPTY_INBOX_PROGRESS_ENTRY_VALUES: InboxProgressEntryValues = {
  type: "",
  subject: "",
  messageText: "",
  file: null,
};

export interface InboxProgressEntryValues {
  type: OptionalFieldValue<ApiInboxProgressEntryType>;
  subject: string;
  messageText: string;
  file: File | null;
}

const INBOX_PROGRESS_ENTRY_TYPES: EnumMap<ApiInboxProgressEntryType> = {
  [ApiInboxProgressEntryType.Email]: "E-Mail",
  [ApiInboxProgressEntryType.Letter]: "Brief",
  [ApiInboxProgressEntryType.PhoneCall]: "Telefonanruf",
};

export function acceptedFileTypes(
  type: OptionalFieldValue<ApiInboxProgressEntryType>,
): FileType[] {
  switch (type) {
    case "EMAIL":
      return [FileType.Eml];
    case "LETTER":
      return [FileType.Pdf];
    default:
      return [];
  }
}

export function acceptedFileExtensions(
  type: OptionalFieldValue<ApiInboxProgressEntryType>,
): string[] {
  switch (type) {
    case "EMAIL":
      return FileType.Eml.extensions;
    case "LETTER":
      return FileType.Pdf.extensions;
    default:
      return [];
  }
}

function additionalFileFieldProps(
  type: OptionalFieldValue<ApiInboxProgressEntryType>,
): Omit<FileFieldProps, "name" | "validate"> {
  switch (type) {
    case "EMAIL":
      return {
        label: ".eml Datei",
        required: "Bitte Email Datei auswählen.",
        accept: acceptedFileTypes("EMAIL"),
      };
    case "LETTER":
      return {
        label: ".pdf Datei",
        required: "Bitte pdf Datei auswählen.",
        accept: acceptedFileTypes("LETTER"),
      };
    default:
      return { label: "Datei" };
  }
}

export const PROGRESS_ENTRY_TYPES_WITH_FILE_UPLOAD: OptionalFieldValue<ApiInboxProgressEntryType>[] =
  [ApiInboxProgressEntryType.Email, ApiInboxProgressEntryType.Letter];

export const PROGRESS_ENTRY_TYPES_WITH_SUBJECT_AND_MESSAGE: OptionalFieldValue<ApiInboxProgressEntryType>[] =
  [ApiInboxProgressEntryType.PhoneCall, ApiInboxProgressEntryType.Letter];

export function InboxProgressEntryForm(props: NestedFormProps) {
  const fieldName = createFieldNameMapper(props.name);
  const { values } = useFormikContext<CreateInboxProcedureValues>();
  const progressEntryType = values.inboxProgressEntry.type;

  return (
    <>
      <Grid xs={12}>
        <Typography level="title-md">Posteingangsverlaufeintrag</Typography>
      </Grid>
      <Grid xs={6}>
        <Stack direction="column" gap={2}>
          <SelectField
            name={fieldName("type")}
            label="Typ"
            options={buildEnumOptions<ApiInboxProgressEntryType>(
              INBOX_PROGRESS_ENTRY_TYPES,
            )}
            required="Bitte einen Typ auswählen."
          />
          {PROGRESS_ENTRY_TYPES_WITH_FILE_UPLOAD.includes(
            progressEntryType,
          ) && (
            <FileField
              name={fieldName("file")}
              validate={validateFile(acceptedFileExtensions(progressEntryType))}
              {...additionalFileFieldProps(progressEntryType)}
            />
          )}
          {PROGRESS_ENTRY_TYPES_WITH_SUBJECT_AND_MESSAGE.includes(
            progressEntryType,
          ) && (
            <>
              <InputField name={fieldName("subject")} label="Betreff" />
              <TextareaField
                name={fieldName("messageText")}
                label="Nachricht"
              />
            </>
          )}
        </Stack>
      </Grid>
    </>
  );
}
