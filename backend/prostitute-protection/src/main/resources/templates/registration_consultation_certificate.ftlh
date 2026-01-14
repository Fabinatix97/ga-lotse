<#import "common/base.ftlh" as base />
<#import "common/footer.ftlh" as footer />
<#import "common/letterhead.ftlh" as letterhead />
<#import "common/checkbox.ftlh" as checkbox />
<#import "common/date_and_signature_line.ftlh" as date_and_signature />

<#macro additionalStyle>
  .headline {
    font-size: 14pt;
    font-weight: 800;
    margin-top: 3mm;
    margin-bottom: 3mm;
  }

  .italic {
    font-style: italic;
    font-size: 10pt;
  }

  .checkbox-headline {
      margin-top: 10mm;
      margin-bottom: 4mm;
    }

  .checkbox-item {
    margin-bottom: 2mm;
  }
</#macro>

<@base.document title="$ 7 Informationsberatung" styles=[
additionalStyle,
footer.style
]>
  <@footer.content department=department />
  <@letterhead.content person=person department=department/>

  <div class="body">
    <div style="margin-top: 20mm">
      <div class="headline">Dokumentation über die Informationsberatung gemäß § 7</div>
      <div class="headline">Prostituiertenschutzgesetz (ProstSchG)</div>
    </div>

    <div style="margin-top: 15mm">
      Hiermit wird bescheinigt, dass o. g. Person am ${dateOfConsultation} gemäß
      § 7 Abs. 2 ProstSchG über die folgenden Inhaltspunkte informiert wurde:
    </div>
    <div class="checkbox-headline">
      Beratungsinhalte:
    </div>
    <div class="checkbox-item">
      <@checkbox.content checked=true /><span class="italic">Rechtslage nach Prostitutions- und Prostituiertenschutzgesetz</span>
    </div>
    <div class="checkbox-item">
      <@checkbox.content checked=true /><span class="italic">Absicherung im Krankheitsfall und soziale Absicherung im Beschäftigungsfall</span>
    </div>
    <div class="checkbox-item">
      <@checkbox.content checked=true /><span class="italic">gesundheitliche und soziale Beratungsangebote einschl. zur Schwangerschaft</span>
    </div>
    <div class="checkbox-item">
      <@checkbox.content checked=true /><span class="italic">Erreichbarkeit von Hilfen in Notsituationen</span>
    </div>
    <div class="checkbox-item">
      <@checkbox.content checked=true /><span class="italic">bestehende Steuerpflicht der aufgenommenen Tätigkeit</span>
    </div>

    <div class="checkbox-headline">
      Die Informationen wurden gemäß § 7 Abs. 3 ProstSchG übermittelt:
    </div>
    <div class="checkbox-item">
      <@checkbox.content checked=inLanguageOfConsultant /><span class="italic">in einer vom/von Berater/in beherrschten Sprache</span>
    </div>
    <div class="checkbox-item">
      <@checkbox.content checked=interpreterConsulted /><span class="italic">Mit einem Dolmetscher</span>
    </div>

    <div style="margin-top: 5mm">
      <@date_and_signature.content date=dateOfConsultation labelSignature="Unterschrift der/des Beratenden" />
    </div>
  </div>
</@base.document>
