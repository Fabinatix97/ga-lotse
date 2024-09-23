/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

import Compressor from "compressorjs";

import { env } from "@/env/client";

export interface ImageCompressorOptions {
  /***
   * The quality of the image after compression, a number between 0 and 1.
   *
   *  Leave empty to use the configured default value of 0.8, see NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY
   */
  quality?: number;
  /***
   * The max width or height of the image, whichever is larger.
   *  If the image is larger than this size, it will be resized to fit within this size, while maintaining the aspect ratio.
   *
   *  Leave empty to use the configured default value of 1920, see NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE.
   */
  maxSize?: number;
}

/***
 * Compresses and or scale down an image file.
 *  Only JPEG files are compressed. Other file types are only scaled down.
 *
 *  **Note:** The returned file MIME type and filename extension might differ from the original.
 *
 * @param file The image file to compress.
 * @param options The options for compressing the image.
 * @returns The compressed image or the original if compression did not reduce the file size.
 *  File MIME type and filename extension might differ.
 */
export async function compressImage(
  file: File,
  options: ImageCompressorOptions = {},
): Promise<File> {
  const defaults = getDefaults();
  options = {
    quality: options.quality ?? defaults.quality,
    maxSize: options.maxSize ?? defaults.maxSize,
  };

  // only compress jpeg files
  const shouldCompress = file.type === "image/jpeg";
  // if the file is not a jpeg, we still want to scale it down, so set the quality to 1
  const quality = shouldCompress ? options.quality : 1;

  const result = await asyncCompressor(file, {
    strict: true,
    quality,
    retainExif: true,
    maxWidth: options.maxSize,
    maxHeight: options.maxSize,
  });

  // the file might be larger after compression
  //  return the original
  if (result.size >= file.size) {
    return file;
  }

  if (!isFile(result)) {
    throw new Error("Compression did not return a File");
  }

  return new File([result], result.name, {
    type: result.type,
    // compressorjs changes the lastModified date, but we want to keep the original
    lastModified: file.lastModified,
  });
}

function asyncCompressor(
  file: File | Blob,
  options: Omit<Compressor.Options, "success" | "error">,
): Promise<File | Blob> {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      ...options,
      success: resolve,
      error: reject,
    });
  });
}

function getDefaults() {
  return {
    quality: Number(env.NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_QUALITY) || 0.8,
    maxSize: Number(env.NEXT_PUBLIC_IMAGE_COMPRESSION_DEFAULT_MAX_SIZE) || 1920,
  };
}

function isFile(value: object): value is File {
  return "name" in value;
}
