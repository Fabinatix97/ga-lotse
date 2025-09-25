/*
 * Copyright 2025 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

package de.eshg.centralrepository.service;

import static org.apache.commons.io.IOUtils.closeQuietly;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.core.io.Resource;
import org.springframework.lang.NonNull;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.support.DefaultTransactionDefinition;

/**
 * A {@link Resource} for database blobs, suitable for being returned in controller responses.
 *
 * <p>This extension of an {@link InputStreamSource} reads the bytes from the blob in its own
 * readonly transaction (therefore the {@link PlatformTransactionManager} must be provided as a
 * dependency in the constructor) and closes the transaction automatically when the InputStream has
 * been read fully, or an error occurred. This makes it possible to return this {@code Resource} in
 * a controller response asynchronously even when the transaction manager has already closed the
 * transaction bound to the controller request.
 */
class BlobInputStreamResource extends InputStreamResource {
  private final long contentLength;

  BlobInputStreamResource(PlatformTransactionManager transactionManager, Blob blob) {
    super(new BlobInputStreamSource(transactionManager, blob));
    try {
      this.contentLength = blob.length();
    } catch (SQLException e) {
      throw new RuntimeException("could not determine blob content length", e);
    }
  }

  /**
   * overridden to return the known content length; otherwise the default implementation would
   * consume the inputStream entirely.
   */
  @Override
  public long contentLength() {
    return contentLength;
  }
}

class BlobInputStreamSource implements InputStreamSource {
  private final PlatformTransactionManager transactionManager;
  private final Blob blob;
  private final AtomicBoolean reading = new AtomicBoolean(false);

  BlobInputStreamSource(PlatformTransactionManager transactionManager, Blob blob) {
    this.transactionManager = transactionManager;
    this.blob = blob;
  }

  @Override
  @NonNull
  public InputStream getInputStream() throws IOException {
    if (!reading.compareAndSet(false, true)) {
      throw new IOException("already reading");
    }
    TransactionStatus tx = transactionManager.getTransaction(newReadOnlyTransaction());
    InputStream blobStream = getBlobStream();
    return new InputStream() {
      @Override
      public int read() throws IOException {
        int result;
        try {
          result = blobStream.read();
        } catch (IOException e) {
          closeQuietly(blobStream);
          transactionManager.rollback(tx);
          throw e;
        }
        if (result == -1) {
          closeQuietly(blobStream);
          transactionManager.commit(tx);
        }
        return result;
      }

      @Override
      public int read(@NonNull byte[] b, int off, int len) throws IOException {
        int result;
        try {
          result = blobStream.read(b, off, len);
        } catch (IOException e) {
          closeQuietly(blobStream);
          transactionManager.rollback(tx);
          throw e;
        }
        if (result == -1) {
          closeQuietly(blobStream);
          transactionManager.commit(tx);
        }
        return result;
      }

      @Override
      public void close() {
        transactionManager.commit(tx);
      }
    };
  }

  private InputStream getBlobStream() {
    try {
      return blob.getBinaryStream();
    } catch (SQLException e) {
      throw new RuntimeException(e);
    }
  }

  private static TransactionDefinition newReadOnlyTransaction() {
    DefaultTransactionDefinition transactionDefinition = new DefaultTransactionDefinition();
    transactionDefinition.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    transactionDefinition.setReadOnly(true);
    return transactionDefinition;
  }
}
