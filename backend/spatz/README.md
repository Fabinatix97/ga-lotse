# SPATZ (Sidecar Proxy and Tunnel Zeugs) for secure communication within ESHG

### Basis of this code

Ideas of SPATZ are based
on ["Reactor Netty TCP Proxy Example"](https://github.com/Bernardo-MG/reactor-netty-tcp-proxy-example),
a small Reactor
Netty proxy server to serve as an example, published under MIT license.

*Kudos to Bernardo Mart&iacute;nez Garrido!*

### Idea of SPATZ

SPATZ should be used as a sidecar container in addition to application
containers (base- and business-modules).
Running both, the application container and SPATZ in a Kubernetes pod, allows us
to capture outgoing HTTP-traffic from one module to another module and
ensure that the communication between both is tunneled with mTLS security:

`[module A] ---HTTP---> [SPATZ A] ===mTLS===> [SPATZ B] ---HTTP---> [module B]`

Additional features in SPATZ:

* creation and renewal of self-signed certificates to be used for mTLS
* registration of its own self-signed client-certificate in the Local Service
  Directory
* retrieval of client-certificates from the service directory and update of its
  trust-store
* routing of traffic via relay-server if necessary


### DNS

## configuration:

Records can be configured with
the [spring-property](src/main/resources/application.properties) `eshg.spatz.dns.zone.records`
or at runtime with methods `addRecords` and `removeRecords`
in [DnsResolver](src/main/java/de/eshg/spatz/dns/DnsResolver.java).

## example tests:

Overridden answer:

```shell
nslookup -port=1053 foo.ga-lotse localhost
```

Forwarded answer:

```shell
nslookup -port=1053 frankfurt.de localhost
```
