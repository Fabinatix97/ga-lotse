/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ApiInventoryItem } from "@eshg/employee-portal-api/base";
import { Alert } from "@eshg/lib-portal/components/Alert";
import { NumberField } from "@eshg/lib-portal/components/formFields/NumberField";
import { Grid, Stack, Typography } from "@mui/joy";
import { Formik } from "formik";

import { useCorrectInventoryItemCount } from "@/lib/baseModule/api/mutations/inventory";
import { useConfirmationDialog } from "@/lib/shared/components/confirmationDialog/ConfirmationDialogProvider";
import { MultiFormButtonBar } from "@/lib/shared/components/form/MultiFormButtonBar";
import { SidebarForm } from "@/lib/shared/components/form/SidebarForm";
import { SidebarActions } from "@/lib/shared/components/sidebar/SidebarActions";
import { SidebarContent } from "@/lib/shared/components/sidebar/SidebarContent";
import {
  SidebarWithFormRefProps,
  UseSidebarWithFormRefResult,
  useSidebarWithFormRef,
} from "@/lib/shared/hooks/useSidebarWithFormRef";

export function useInventoryCountCorrectionSidebar(): UseSidebarWithFormRefResult<InventoryCountCorrectionSidebarProps> {
  return useSidebarWithFormRef({
    component: InventoryCountCorrectionSidebar,
  });
}

function CountDifference({
  currentCount,
  newCount,
}: {
  currentCount: number;
  newCount: string;
}) {
  return (
    <Grid container spacing={1}>
      <Grid xxs={4}>
        <Typography level={"title-md"}>Aktueller Bestand</Typography>
      </Grid>
      <Grid xxs={8}>
        <Typography>{currentCount}</Typography>
      </Grid>
      <Grid xxs={4}>
        <Typography level={"title-md"}>Neuer Bestand</Typography>
      </Grid>
      <Grid xxs={8}>
        <Typography>{newCount}</Typography>
      </Grid>
    </Grid>
  );
}

interface InventoryCountCorrectionSidebarProps extends SidebarWithFormRefProps {
  item: ApiInventoryItem;
}

function InventoryCountCorrectionSidebar({
  onClose,
  item,
  formRef,
}: InventoryCountCorrectionSidebarProps) {
  const { openConfirmationDialog } = useConfirmationDialog();

  const correctInventoryCount = useCorrectInventoryItemCount(item.id);

  function handleSubmit(values: {
    id: string;
    version: number;
    newCount: string;
  }) {
    openConfirmationDialog({
      description: `Wollen Sie den aktuellen Bestand wirklich ändern?`,
      children: (
        <CountDifference currentCount={item.count} newCount={values.newCount} />
      ),
      onConfirm: () => {
        correctInventoryCount.mutate(
          {
            version: values.version,
            count: parseInt(values.newCount),
          },
          {
            onSuccess: () => onClose(true),
          },
        );
      },
    });
    return Promise.resolve();
  }

  return (
    <Formik
      initialValues={{
        id: item.id,
        version: item.version,
        newCount: item.count.toString(),
      }}
      onSubmit={handleSubmit}
    >
      {() => (
        <SidebarForm ref={formRef}>
          <SidebarContent title={"Inventur durchführen"}>
            <Stack spacing={2}>
              <Alert
                color={"warning"}
                title={"Achtung!"}
                message={
                  "Der Bestand des Inventars kann vom tatsächlichen Inhalt des Lagers abweichen. " +
                  "Buchungsaufträge werden direkt vom Bestand abgezogen, bevor diese abgeholt wurden."
                }
              />
              <NumberField
                name={"newCount"}
                label={"Neuer Bestand"}
                required={"Bitte den neuen Bestand angeben"}
              />
            </Stack>
          </SidebarContent>
          <SidebarActions>
            <MultiFormButtonBar
              submitLabel={"Durchführen"}
              submitting={false}
              onCancel={onClose}
            />
          </SidebarActions>
        </SidebarForm>
      )}
    </Formik>
  );
}
