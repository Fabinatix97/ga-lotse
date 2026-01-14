/**
 * Copyright 2026 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { CloseOutlined, WarningAmberOutlined } from "@mui/icons-material";
import { Checkbox } from "@mui/joy";
import { useField } from "formik";

import { theme } from "@/lib/baseModule/theme/theme";
import { CLFormElement } from "@/lib/businessModules/inspection/components/inspection/execution/checklist/form/helpers";

export function ChecklistIncidentToggle({
  name,
  element,
  readOnly,
}: {
  name: string;
  element: CLFormElement;
  readOnly?: boolean;
}) {
  const [field] = useField<boolean>({ name: name, type: "checkbox" });

  return (
    <Checkbox
      name={field.name}
      color={element.incident ? "danger" : "neutral"}
      sx={{ alignSelf: "flex-start" }}
      size="sm"
      checkedIcon={<CloseOutlined />}
      uncheckedIcon={<WarningAmberOutlined />}
      label="Vorkommnis"
      checked={field.checked}
      readOnly={readOnly}
      slotProps={{
        root: ({ checked }) => {
          return {
            sx: {
              border: checked ? "1px transparent" : "1px solid",
              borderColor: "neutral.300",
              borderRadius: "16px",
              padding: "3px 8px",
              backgroundColor: checked
                ? theme.palette.danger[500]
                : theme.palette.neutral,
              color: checked ? "white" : theme.palette.text,
              height: "100%",
            },
          };
        },
        checkbox: () => ({ sx: { border: "none" } }),
      }}
      onChange={!readOnly ? field.onChange : undefined}
    />
  );
}
