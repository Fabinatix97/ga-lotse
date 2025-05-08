/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import { Add, Delete } from "@mui/icons-material";
import { Option, Select, Stack } from "@mui/joy";
import { useState } from "react";

import { InputField } from "@eshg/lib-portal/components/formFields/InputField";

import { ActionsMenu } from "../../../../components/buttons/ActionsMenu";
import { FormDialog } from "../../../../components/form/FormDialog";
import { useConfirmationDialog } from "../../../../hooks/useConfirmationDialog";

interface TemplateNameFormModel {
  templateName: string;
}

export interface FilterTemplate {
  id: string;
  name: string;
}

export interface FilterTemplatesProps {
  templates: FilterTemplate[];
  saveTemplate: (model: TemplateNameFormModel) => Promise<string>;
  deleteTemplate: (templateId: string) => void;
  hasActiveFilters: boolean;
  onFilterTemplateIdChanged: (filterTemplateId: string | null) => void;
  selectedFilterTemplateId: string | null;
}

export function FilterTemplates(props: FilterTemplatesProps) {
  const [open, setOpen] = useState(false);
  const { openConfirmationDialog } = useConfirmationDialog();

  async function onSubmit(model: TemplateNameFormModel) {
    const id = await props.saveTemplate(model);
    setOpen(false);
    props.onFilterTemplateIdChanged(id);
  }

  function deleteTemplate() {
    openConfirmationDialog({
      color: "danger",
      title: "Vorlage löschen?",
      description: `Die Vorlage „${props.templates.find((it) => it.id === props.selectedFilterTemplateId)!.name}” wird dann unwiderruflich gelöscht.`,
      cancelLabel: "Abbrechen",
      confirmLabel: "Löschen",
      onConfirm: () => {
        props.deleteTemplate(props.selectedFilterTemplateId!);
        props.onFilterTemplateIdChanged(null);
      },
    });
  }

  return (
    <>
      <FormDialog
        open={open}
        initialValues={{ templateName: "" }}
        confirmLabel="Speichern"
        cancelLabel="Abbrechen"
        color="primary"
        title="Filter-Vorlage speichern"
        description="Wählen Sie einen eindeutigen Namen für die Filter-Vorlage."
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
      >
        <InputField
          label="Name der Filter-Vorlage"
          name="templateName"
          required="Bitte Namen angeben"
        />
      </FormDialog>
      <Stack direction="row" gap={0.5} data-testid="filter-templates">
        <Select
          sx={{ flex: 1 }}
          placeholder="Filter-Vorlagen"
          aria-label="Filter-Vorlagen"
          value={props.selectedFilterTemplateId}
          onChange={(_, newValue: string | null) => {
            if (newValue !== null) {
              props.onFilterTemplateIdChanged(newValue);
            }
          }}
        >
          {props.templates.map((it) => (
            <Option key={it.id} value={it.id}>
              {it.name}
            </Option>
          ))}
        </Select>
        <ActionsMenu
          actionItems={[
            {
              label: "Ausgewählte Vorlage löschen",
              onClick: deleteTemplate,
              startDecorator: <Delete />,
              disabled: props.selectedFilterTemplateId === null,
            },
            {
              label: "Aktive Filter als Vorlage speichern",
              onClick: () => setOpen(true),
              startDecorator: <Add />,
              disabled: !props.hasActiveFilters,
            },
          ]}
        />
      </Stack>
    </>
  );
}
