# AccessibleWeb Widget — Shopify

Add the [AccessibleWeb Widget](https://github.com/ifrederico/accessible-web-widget) to a Shopify storefront as a theme snippet.

## Install

1. In your Shopify admin, go to **Online Store > Themes**, click **… > Edit code** on your theme.
2. Under **Snippets**, click **Add a new snippet** and name it `accessible-web-widget`.
3. Paste in the contents of [`accessible-web-widget.liquid`](accessible-web-widget.liquid) and save.
4. Open **layout/theme.liquid** and add this line just before the closing `</body>` tag:

   ```liquid
   {% render 'accessible-web-widget' %}
   ```

## Configure

Pass optional parameters to the render tag:

```liquid
{% render 'accessible-web-widget', position: 'bottom-left', size: 48, lang: 'fr' %}
```

| Parameter  | Values                                                            | Default        |
| ---------- | ----------------------------------------------------------------- | -------------- |
| `position` | `bottom-right`, `bottom-left`, `top-right`, `top-left`            | `bottom-right` |
| `size`     | Button size in pixels                                             | `44`           |
| `lang`     | Language code (`en`, `es`, `pt-BR`, …)                            | auto-detect    |

## Note on a full Shopify app

This snippet requires a one-time theme edit. For a distributable, no-code install, the widget would ship as a Shopify app with a **theme app extension** (an app embed block toggled from the theme editor). That requires a Shopify Partner account and app review; the snippet above is the lightweight path for merchants who control their own theme.
