/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { MainContentLayout } from "@eshg/lib-employee-portal";
import { useSnackbar } from "@eshg/lib-portal/components/snackbar/SnackbarProvider";

import { ConfiguratorForm } from "@/lib/configurator/components/shared/ConfiguratorForm";
import { FileUploadValue } from "@/lib/configurator/components/shared/RenderField";

export default function ConfiguratorPage() {
  const snackbar = useSnackbar();
  return (
    <MainContentLayout>
      <ConfiguratorForm
        sheets={[
          {
            title: "Sheet title",
            description: "Sheet description",
            sections: [
              {
                title: "Section title",
                description: "Section description",
                content: {
                  type: "field",
                  rows: [
                    {
                      fields: [
                        {
                          type: "text",
                          label: "Text field label",
                          name: "text_name",
                          required: "Bitte ausfüllen",
                        },
                        {
                          type: "text",
                          label: "Text field label 2",
                          name: "text_name2",
                          required: "Bitte ausfüllen",
                        },
                      ],
                    },
                    {
                      fields: [
                        {
                          type: "number",
                          label: "Number field",
                          name: "number_name",
                        },
                      ],
                    },
                    {
                      fields: [
                        {
                          type: "checkbox",
                          label: "Checkbox field",
                          name: "checkbox_name",
                          readonly: true,
                        },
                      ],
                    },
                    {
                      fields: [
                        {
                          type: "radio",
                          label: "Radio field",
                          name: "radio_name",
                          readonly: true,
                          required: "Has to be selected",
                          options: [
                            {
                              value: "VALUE_1",
                              infoLabel: "Some extra info",
                              label: "Label 1",
                            },
                            {
                              value: "VALUE_2",
                              infoLabel: "Some extra info",
                              label: "Label 2",
                            },
                            {
                              value: "VALUE_3",
                              infoLabel: "Some extra info",
                              label: "Label 3",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      fields: [
                        {
                          type: "upload",
                          name: "upload_name",
                          label: "File upload",
                        },
                      ],
                    },
                    {
                      fields: [
                        {
                          type: "upload",
                          name: "upload_name2",
                          label: "File upload 2",
                        },
                      ],
                    },
                    {
                      fields: [
                        {
                          type: "openinghours",
                          name: "opening_hours",
                        },
                      ],
                    },
                  ],
                },
              },
              {
                title: "Section title 2",
                description: "Lorem Ipsum etc",
                content: {
                  type: "text",
                  title: "subsection title",
                  entries: [
                    {
                      label: "Label",
                      content: "Content",
                    },
                    {
                      label: "Label 2",
                      content: "Content 2",
                    },
                  ],
                },
              },
              {
                title: "Section 3",
                description: "Section 3 description",
                content: {
                  type: "choose",
                  name: "choose_name",
                  options: [
                    {
                      label: "Label 1",
                      value: "VALUE_1",
                      readonly: false,
                      sections: [
                        {
                          content: {
                            type: "text",
                            title: "Wambo",
                            entries: [
                              {
                                label: "Label 1",
                                content: "Content 1",
                              },
                            ],
                          },
                        },
                      ],
                    },
                    {
                      label: "Label 2",
                      value: "VALUE_2",
                      readonly: false,
                      sections: [
                        {
                          content: {
                            type: "field",
                            rows: [
                              {
                                fields: [
                                  {
                                    type: "text",
                                    label: "Text field label",
                                    name: "text_name3",
                                  },
                                ],
                              },
                            ],
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        ]}
        initialValues={{
          text_name: "",
          text_name2: "",
          text_name3: "",
          choose_name: "VALUE_2",
          upload_name: null,
          upload_name2: {
            type: "CSV",
            name: "Some random file name",
            creationDate: new Date(),
            size: 234423,
          } satisfies FileUploadValue,
          opening_hours: {
            rows: [{ weekday: "", timeWindow: "" }],
            additionalInfo: "",
          },
          number_name: 32,
          select_name: "VALUE_1",
          checkbox_name: true,
          radio_name: "VALUE_2",
        }}
        onSubmit={(model) => {
          // eslint-disable-next-line no-console
          console.log("Model: ", model);
          snackbar.confirmation("Die Änderungen wurden gespeichert.");
          return Promise.resolve();
        }}
        deleteFile={(fileName) => {
          // eslint-disable-next-line no-console
          console.log("Delete: ", fileName);
        }}
        downloadFile={(fileName) => {
          // eslint-disable-next-line no-console
          console.log("Download: ", fileName);
        }}
        status="complete"
      />
    </MainContentLayout>
  );
}
