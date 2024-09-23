/*
 * Copyright 2024 SCOOP Software GmbH, cronn GmbH
 * SPDX-License-Identifier: Apache-2.0
 */

package de.eshg.spatz.server;

import io.netty.handler.codec.http.websocketx.WebSocketCloseStatus;
import org.reactivestreams.Publisher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import reactor.core.publisher.Mono;
import reactor.netty.http.websocket.WebsocketInbound;
import reactor.netty.http.websocket.WebsocketOutbound;

public class WebsocketProxyHandler {
  private static final Logger logger = LoggerFactory.getLogger(WebsocketProxyHandler.class);

  /**
   * connect two websockets by simply copying their contents (in1 to out2; in2 to out1)
   *
   * <p>
   *
   * <pre>
   *  [  in1 ] ===> [ out2 ]
   *  [ out1 ] <=== [  in2 ]
   *  </pre>
   */
  public Publisher<Void> handle(
      WebsocketInbound in1, WebsocketOutbound out1, WebsocketInbound in2, WebsocketOutbound out2) {
    logger.debug("handling {}", out1);
    return Mono.firstWithSignal(
        out1.send(in2.aggregateFrames().receive().retain()).neverComplete(),
        out2.send(in1.aggregateFrames().receive().retain()).neverComplete(),
        in2.receiveCloseStatus()
            .flatMap(
                c -> {
                  if (WebSocketCloseStatus.isValidStatusCode(c.code())) {
                    return out1.sendClose(c.code(), c.reasonText());
                  } else {
                    return out1.sendClose(
                        WebSocketCloseStatus.PROTOCOL_ERROR.code(),
                        "received close code " + c.code() + ", which is not RFC-6455 conform");
                  }
                }),
        in1.receiveCloseStatus()
            .flatMap(
                c -> {
                  if (WebSocketCloseStatus.isValidStatusCode(c.code())) {
                    return out2.sendClose(c.code(), c.reasonText());
                  } else {
                    return out2.sendClose(
                        WebSocketCloseStatus.PROTOCOL_ERROR.code(),
                        "received close code " + c.code() + ", which is not RFC-6455 conform");
                  }
                }));
  }
}
