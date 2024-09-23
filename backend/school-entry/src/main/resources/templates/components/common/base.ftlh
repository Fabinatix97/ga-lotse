<#macro document title styles>

    <!DOCTYPE html>
    <html lang="de">
    <head>
        <title>${title}</title>
        <style>
            @page {
                size: A4 portrait;
                margin: 15mm 0 15mm 0;

                @bottom-left {
                    content: element(--var-footerRunning);
                    font-family: sans-serif;
                    font-size: 7pt;
                    vertical-align: top;
                    padding-left: 15mm
                }

                @bottom-right {
                    content: "Seite " counter(page) " von " counter(pages);
                    font-family: sans-serif;
                    font-size: 7pt;
                    padding-right: 1cm;
                    vertical-align: top;
                }
            }

            html {
                font-size: 8pt;
            }

            body {
                font-family: sans-serif;
                font-weight: 400;
                line-height: 1.5rem;
                height: 100%;
                box-sizing: border-box;
                margin: 0 1cm 0 15mm;
            }

            <#list styles as style>
               <@style />
            </#list>
        </style>
    </head>
    <body>
    <#nested />
    </body>
    </html>
</#macro>

