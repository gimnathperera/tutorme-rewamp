<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html>
      <head>
        <title>XML Sitemap - TuitionLanka</title>
        <style>
          body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 24px; background: #f8fafc; color: #1e293b; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          p.meta { color: #64748b; font-size: 14px; margin-top: 0; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
          th { text-align: left; background: #2563eb; color: #fff; padding: 10px 14px; font-size: 13px; }
          td { padding: 10px 14px; border-top: 1px solid #e2e8f0; font-size: 13px; vertical-align: top; }
          tr:nth-child(even) td { background: #f8fafc; }
          a { color: #2563eb; text-decoration: none; word-break: break-all; }
          a:hover { text-decoration: underline; }
          .priority { font-variant-numeric: tabular-nums; }
        </style>
      </head>
      <body>
        <h1>XML Sitemap</h1>
        <p class="meta">
          <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs — generated for search engines. This is just a readable view; crawlers read the underlying XML data directly.
        </p>
        <table>
          <tr>
            <th>URL</th>
            <th>Last Modified</th>
            <th>Priority</th>
          </tr>
          <xsl:for-each select="sitemap:urlset/sitemap:url">
            <tr>
              <td>
                <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
              </td>
              <td><xsl:value-of select="sitemap:lastmod"/></td>
              <td class="priority"><xsl:value-of select="sitemap:priority"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
