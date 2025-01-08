/**
 * Copyright 2025 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

"use client";

import { FormPlus } from "@eshg/lib-portal/components/form/FormPlus";
import { FileLike } from "@eshg/lib-portal/components/formFields/file/validators";
import { formatFileSize } from "@eshg/lib-portal/helpers/file";
import { FormLabel, Slider, Stack, Typography } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { Formik } from "formik";
import { useEffect, useState } from "react";

import { FileField } from "@/lib/shared/components/formFields/file/FileField";
import { MainContentLayout } from "@/lib/shared/components/layout/MainContentLayout";
import { StickyToolbarLayout } from "@/lib/shared/components/layout/StickyToolbarLayout";
import { Toolbar } from "@/lib/shared/components/layout/Toolbar";
import { compressImage } from "@/lib/shared/helpers/imageCompressor";

export default function PlaygroundImageCompressorPage() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number | undefined>(undefined);
  const [maxSize, setMaxSize] = useState<number | undefined>(undefined);

  const { data: compressedFile, isFetching } = useQuery({
    queryKey: getQueryKey(originalFile, quality, maxSize),
    queryFn: async () => {
      if (!originalFile) {
        return;
      }

      return compressImage(originalFile, {
        // leave empty to use the default values defined in .env
        quality, // NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY
        maxSize, // NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE
      });
    },
    enabled: !!originalFile,
  });

  const originalFileUrl = useObjectUrl(originalFile);
  const compressedFileUrl = useObjectUrl(compressedFile);

  function handleFormChange(_: { file: null }) {
    // do nothing, FileField needs special handling
  }

  function handleFileChange(file: FileLike | null) {
    setOriginalFile(file as File | null);
  }

  function handleQualityChange(_event: Event, newValue: number | number[]) {
    setQuality(newValue as number);
  }

  function handleMaxSizeChange(_event: Event, newValue: number | number[]) {
    setMaxSize(newValue as number);
  }

  return (
    <StickyToolbarLayout toolbar={<Toolbar title="Image Compression" />}>
      <MainContentLayout>
        <Stack gap={4}>
          <Formik initialValues={{ file: null }} onSubmit={handleFormChange}>
            <FormPlus style={{ display: "contents" }}>
              <FileField label="File" name="file" onChange={handleFileChange} />
            </FormPlus>
          </Formik>
          <Stack>
            <FormLabel>Quality: {quality ?? "default"}</FormLabel>
            <Slider
              aria-label="Quality"
              defaultValue={0.8}
              step={0.025}
              marks
              min={0}
              max={1}
              value={quality}
              onChange={handleQualityChange}
            />
          </Stack>
          <Stack>
            <FormLabel>Max Size: {maxSize ?? "default"}</FormLabel>
            <Slider
              aria-label="Max Size"
              defaultValue={1920}
              step={10}
              min={1}
              max={4096}
              value={maxSize}
              onChange={handleMaxSizeChange}
            />
          </Stack>
          {originalFile && (
            <Stack direction="row" gap={2}>
              <Stack gap={2}>
                <Typography level="h2">Original</Typography>
                <Typography>
                  {`Size: ${formatFileSize(originalFile.size)} (${originalFile.size} bytes)`}
                </Typography>
                {originalFileUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- using <Image /> would be overkill here
                  <img
                    src={originalFileUrl}
                    alt="Original"
                    style={{ width: "100%" }}
                  />
                )}
              </Stack>
              <Stack gap={2}>
                <Typography level="h2">Compressed</Typography>
                {isFetching && <Typography>Compressing...</Typography>}
                {compressedFile && (
                  <Typography>
                    {`Size: ${formatFileSize(compressedFile.size)} (${compressedFile.size} bytes)`}
                  </Typography>
                )}
                {compressedFileUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- using <Image /> would be overkill here
                  <img
                    src={compressedFileUrl}
                    alt="Compressed"
                    style={{ width: "100%" }}
                  />
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </MainContentLayout>
    </StickyToolbarLayout>
  );
}

function getQueryKey(
  originalFile: File | null,
  quality: number | undefined,
  maxSize: number | undefined,
) {
  return [
    "playground",
    "compressedFile",
    {
      originalFile,
      quality,
      maxSize,
    },
  ];
}

function useObjectUrl(file: File | null | undefined) {
  const [objUrl, setObjUrl] = useState<string>("");

  useEffect(() => {
    if (!file) {
      return;
    }

    const res = URL.createObjectURL(file);
    setObjUrl(res);

    return () => {
      URL.revokeObjectURL(res);
    };
  }, [file]);

  return objUrl;
}
