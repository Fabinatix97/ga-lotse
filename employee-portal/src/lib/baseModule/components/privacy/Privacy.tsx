/**
 * Copyright 2024 cronn GmbH
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { ExternalLink } from "@eshg/lib-portal/components/navigation/ExternalLink";
import { List, ListItem, Stack, Typography } from "@mui/joy";
import { PropsWithChildren } from "react";

import {
  NoWrap,
  StaticTextDocumentPanel,
} from "@/lib/baseModule/components/StaticTextDocumentPanel";

function Section({
  id,
  title,
  children,
}: PropsWithChildren<{ id: string; title: string }>) {
  return (
    <Stack
      component={"section"}
      aria-labelledby={id}
      alignItems={"start"}
      gap={1}
    >
      <Typography level={"h2"} id={id}>
        {title}
      </Typography>
      {children}
    </Stack>
  );
}

export function Privacy() {
  return (
    <StaticTextDocumentPanel>
      <Typography>
        Diese Datenschutzerklärung gilt für die Webseite{" "}
        <NoWrap>„frankfurt.ga-lotse.de“</NoWrap> (bzw.{" "}
        <NoWrap>„https://frankfurt.ga-lotse.de“</NoWrap> sowie dazu zugehörige
        Subdomains) des Gesundheitsamts der Stadt Frankfurt am Main. Dieses
        Informationsportal bietet Informationen zu besonderen Ereignissen und
        wird ausschließlich zum dem Zwecke genutzt.
      </Typography>

      <Section
        id={"section-1"}
        title={
          "1. Name und Kontaktdaten des für die Verarbeitung Verantwortlichen sowie des behördlichen Datenschutzbeauftragten"
        }
      >
        <Typography>
          Diese Datenschutz-Information gilt für die Datenverarbeitung durch:
          <br />
          <br />
          Verantwortlicher:
          <br />
          <br />
          Verantwortlich für die Website{" "}
          <NoWrap>„frankfurt.ga-lotse.de“</NoWrap> ist das Gesundheitsamt
          Frankfurt am Main:
          <br />
          <br />
          Gesundheitsamt Frankfurt am Main
          <br />
          Breite Gasse 28
          <br />
          60313 Frankfurt am Main
          <br />
          E-Mail:{" "}
          <ExternalLink
            href={"mailto:datenschutz.gesundheitsamt@stadt-frankfurt.de"}
          >
            datenschutz.gesundheitsamt@stadt-frankfurt.de
          </ExternalLink>
          <br />
          <br />
          Behördlicher Datenschutzbeauftragter:
          <br />
          <br />
          Referat Datenschutz und IT-Sicherheit
          <br />
          Sandgasse 6, 60311 Frankfurt am Main
        </Typography>
      </Section>

      <Section
        id={"section-2"}
        title={
          "2. Erhebung und Speicherung personenbezogener Daten sowie Art und Zweck von deren Verwendung"
        }
      >
        <Typography>
          2.1 Beim Besuch der Website
          <br />
          <br />
          Beim Aufrufen unserer Website <NoWrap>
            „frankfurt.ga-lotse.de“
          </NoWrap>{" "}
          werden durch den auf Ihrem Endgerät zum Einsatz kommenden Browser
          automatisch Informationen an den Server unserer Website gesendet.
          Diese Informationen werden temporär in einem sog. Logfile gespeichert.
          Folgende Informationen werden dabei ohne Ihr Zutun erfasst und bis zur
          automatisierten Löschung gespeichert:
        </Typography>

        <List marker={"disc"}>
          <ListItem>
            <Typography>IP-Adresse des anfragenden Rechners</Typography>
          </ListItem>
          <ListItem>
            <Typography>Datum und Uhrzeit des Zugriffs</Typography>
          </ListItem>
          <ListItem>
            <Typography>Name und URL der abgerufenen Datei</Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Website, von der aus der Zugriff erfolgt (Referrer-URL)
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              verwendeter Browser und ggf. das Betriebssystem Ihres Rechners
              sowie der Name Ihres Access-Providers
            </Typography>
          </ListItem>
        </List>

        <Typography>
          Die genannten Daten werden durch uns zu folgenden Zwecken verarbeitet:
        </Typography>

        <List marker={"disc"}>
          <ListItem>
            <Typography>
              Gewährleistung eines reibungslosen Verbindungsaufbaus der Website
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Gewährleistung einer komfortablen Nutzung unserer Website
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              Auswertung der Systemsicherheit und -stabilität
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>Rückverfolgung etwaiger DoS Attacken</Typography>
          </ListItem>
          <ListItem>
            <Typography>sowie zu weiteren administrativen Zwecken</Typography>
          </ListItem>
        </List>

        <Typography level={"title-md"}>
          2.2 Beim Verwenden des QR-Codes
        </Typography>
        <Typography>
          Falls Ihnen für den Zugang zum Online-Portal ein individualisierter
          QR-Code gegeben wurde, hat dieser den Zweck, Informationen oder
          Nachrichten speziell für Sie zur Verfügung zu stellen, beispielsweise
          als betroffener eines gesundheitsrelevanten Ereignisses. Nach
          Einscannen des Codes wird man direkt auf die entsprechende
          Informationsseite weitergeleitet. Im System wird dabei protokolliert,
          zu welchem Zeitpunkt der QR-Code verwendet wurde, jedoch ohne weitere
          Angaben wie IP-Adresse oder Namen o.ä.
          <br />
          <br />
          Die Rechtsgrundlage für die Datenverarbeitung ist{" "}
          <NoWrap>Art. 6 Abs. 1 S. 1 lit. f DS-GVO</NoWrap>. Unser berechtigtes
          Interesse folgt aus oben aufgelisteten Zwecken zur Datenerhebung. In
          keinem Fall verwenden wir die erhobenen Daten zu dem Zweck,
          Rückschlüsse auf Ihre Person zu ziehen.
          <br />
          <br />
          Darüber hinaus setzen wir beim Besuch unserer Website Cookies ein.
          Nähere Erläuterungen dazu erhalten Sie unter den Ziff. 4 dieser
          Datenschutzerklärung.
          <br />
          <br />
        </Typography>
      </Section>

      <Section
        id={"sharing-with-third-parties"}
        title={"3. Weitergabe von Daten"}
      >
        <Typography>
          Es findet keine Weitergabe von Daten an Dritte statt.
        </Typography>
      </Section>

      <Section id={"cookies"} title={"4. Cookies"}>
        <Typography>
          Wir setzen auf unserer Seite Cookies ein. Hierbei handelt es sich um
          kleine Dateien, die Ihr Browser automatisch erstellt und die auf Ihrem
          Endgerät (Laptop, Tablet, Smartphone o.ä.) gespeichert werden, wenn
          Sie unsere Seite besuchen. Cookies richten auf Ihrem Endgerät keinen
          Schaden an, enthalten keine Viren, Trojaner oder sonstige
          Schadsoftware.
          <br />
          <br />
          In dem Cookie werden Informationen abgelegt, die sich jeweils im
          Zusammenhang mit dem spezifisch eingesetzten Endgerät ergeben. Dies
          bedeutet jedoch nicht, dass wir dadurch unmittelbar Kenntnis von Ihrer
          Identität erhalten.
          <br />
          <br />
          Der Einsatz von Cookies dient einerseits dazu, die Nutzung unseres
          Angebots für Sie angenehmer zu gestalten. So setzen wir sogenannte
          Session-Cookies ein, um zu erkennen, dass Sie einzelne Seiten unserer
          Website bereits besucht haben. Diese werden nach Verlassen unserer
          Seite automatisch gelöscht.
          <br />
          <br />
          Darüber hinaus setzen wir ebenfalls zur Optimierung der
          Benutzerfreundlichkeit temporäre Cookies ein, die für einen bestimmten
          festgelegten Zeitraum auf Ihrem Endgerät gespeichert werden. Besuchen
          Sie unsere Seite erneut, um unsere Dienste in Anspruch zu nehmen, wird
          automatisch erkannt, dass Sie bereits bei uns waren und welche
          Eingaben und Einstellungen sie getätigt haben, um diese nicht noch
          einmal eingeben zu müssen.
          <br />
          <br />
          Die durch Cookies verarbeiteten Daten sind für die genannten Zwecke
          zur Wahrung unserer berechtigten Interessen erforderlich.
          <br />
          <br />
          Die meisten Browser akzeptieren Cookies automatisch. Sie können Ihren
          Browser jedoch so konfigurieren, dass keine Cookies auf Ihrem Computer
          gespeichert werden oder stets ein Hinweis erscheint, bevor ein neuer
          Cookie angelegt wird. Die vollständige Deaktivierung von Cookies kann
          jedoch dazu führen, dass Sie nicht alle Funktionen unserer Website
          nutzen können.
        </Typography>
      </Section>

      <Section id={"analytic-tools"} title={"5. Analyse-Tools"}>
        <Typography>Es werden keine Analyse-Tools verwendet.</Typography>
      </Section>

      <Section id={"social-media-plugins"} title={"6. Social Media Plug-ins"}>
        <Typography>
          Es werden keine Social Media Plug-Ins verwendet.
        </Typography>
      </Section>

      <Section id={"rights-of-affected"} title={"7. Betroffenenrechte"}>
        <Typography>Sie haben das Recht:</Typography>
        <List marker={"disc"}>
          <ListItem>
            <Typography>
              gemäß <NoWrap>Art. 15 DS-GVO</NoWrap> Auskunft über Ihre von uns
              verarbeiteten personenbezogenen Daten zu verlangen. Insbesondere
              können Sie Auskunft über die Verarbeitungszwecke, die Kategorie
              der personenbezogenen Daten, die Kategorien von Empfängern,
              gegenüber denen Ihre Daten offengelegt wurden oder werden, die
              geplante Speicherdauer, das Bestehen eines Rechts auf
              Berichtigung, Löschung, Einschränkung der Verarbeitung oder
              Widerspruch, das Bestehen eines Beschwerderechts, die Herkunft
              ihrer Daten, sofern diese nicht bei uns erhoben wurden sowie über
              das Bestehen einer automatisierten Entscheidungsfindung
              einschließlich Profiling und ggf. aussagekräftigen Informationen
              zu deren Einzelheiten verlangen.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              gemäß <NoWrap>Art. 16 DS-GVO</NoWrap> unverzüglich die
              Berichtigung unrichtiger oder Vervollständigung Ihrer bei uns
              gespeicherten personenbezogenen Daten zu verlangen.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              gemäß <NoWrap>Art. 17 DS-GVO</NoWrap> die Löschung Ihrer bei uns
              gespeicherten personenbezogenen Daten zu verlangen, soweit nicht
              die Verarbeitung zur Ausübung des Rechts auf freie
              Meinungsäußerung und Information, zur Erfüllung einer rechtlichen
              Verpflichtung, aus Gründen des öffentlichen Interesses oder zur
              Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
              erforderlich ist.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              gemäß <NoWrap>Art. 18 DS-GVO</NoWrap> die Einschränkung der
              Verarbeitung Ihrer personenbezogenen Daten zu verlangen, soweit
              die Richtigkeit der Daten von Ihnen bestritten wird, die
              Verarbeitung unrechtmäßig ist, Sie aber deren Löschung ablehnen
              und wir die Daten nicht mehr benötigen, Sie jedoch diese zur
              Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen
              benötigen oder Sie gemäß <NoWrap>Art. 21 DS-GVO</NoWrap>{" "}
              Widerspruch gegen die Verarbeitung eingelegt haben.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              gemäß <NoWrap>Art. 20 DS-GVO</NoWrap> Ihre personenbezogenen
              Daten, die Sie uns bereitgestellt haben, in einem strukturierten,
              gängigen und maschinenlesebaren Format zu erhalten oder die
              Übermittlung an einen anderen Verantwortlichen zu verlangen.
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              gemäß <NoWrap>Art. 7 Abs. 3 DS-GVO</NoWrap> Ihre einmal erteilte
              Einwilligung jederzeit gegenüber uns zu widerrufen. Dies hat zur
              Folge, dass wir die Datenverarbeitung, die auf dieser Einwilligung
              beruhte, für die Zukunft nicht mehr fortführen dürfen und
            </Typography>
          </ListItem>
          <ListItem>
            <Typography>
              gemäß <NoWrap>Art. 77 DS-GVO</NoWrap> sich bei der zuständigen
              Aufsichtsbehörde zu beschweren. Die zuständige Aufsichtsbehörde
              ist: Der Hessische Datenschutzbeauftragte, Postfach 3163, 65021
              Wiesbaden, Telefon: 0611/1408 - 0,
              poststelle@datenschutz-hessen.de.
            </Typography>
          </ListItem>
        </List>
      </Section>

      <Section id={"right-to-refute"} title={"8. Widerspruchsrecht"}>
        <Typography>
          Sofern Ihre personenbezogenen Daten auf Grundlage von berechtigten
          Interessen gemäß <NoWrap>Art. 6 Abs. 1 S. 1 lit. f DS-GVO</NoWrap>{" "}
          verarbeitet werden, haben Sie das Recht, gemäß{" "}
          <NoWrap>Art. 21 DS-GVO</NoWrap> Widerspruch gegen die Verarbeitung
          Ihrer personenbezogenen Daten einzulegen, soweit dafür Gründe
          vorliegen, die sich aus Ihrer besonderen Situation ergeben. Möchten
          Sie von Ihrem Widerrufs- oder Widerspruchsrecht Gebrauch machen,
          genügt eine E-Mail an
          <NoWrap>datenschutz.gesundheitsamt@stadt-frankfurt.de</NoWrap>&nbsp;.
        </Typography>
      </Section>

      <Section id={"data-safety"} title={"9. Datensicherheit"}>
        <Typography>
          Wir bedienen uns geeigneter technischer und organisatorischer
          Sicherheitsmaßnahmen, um Ihre Daten gegen zufällige oder vorsätzliche
          Manipulationen, teilweisen oder vollständigen Verlust, Zerstörung oder
          gegen den unbefugten Zugriff Dritter zu schützen. Unsere
          Sicherheitsmaßnahmen werden nach dem jeweiligen Stand der Technik
          gemäß <NoWrap>Art. 32 DS-GVO</NoWrap> fortlaufend angepasst.
        </Typography>
      </Section>

      <Section id={"request-proceeding"} title={"10. Auftragsverarbeitung"}>
        <Typography>
          Es findet keine Auftragsverarbeitung der erhobenen Daten statt.
        </Typography>
      </Section>

      <Section
        id={"recency-and-updates"}
        title={"11. Aktualität und Änderung dieser Datenschutzerklärung"}
      >
        <Typography>
          Diese Datenschutzerklärung ist aktuell gültig und hat den Stand
          September 2024.
        </Typography>
      </Section>
    </StaticTextDocumentPanel>
  );
}
