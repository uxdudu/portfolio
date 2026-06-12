# Alinhamento de eventos entre GA4 e PostHog

## Objetivo

Enviar ao Google Analytics 4 os mesmos eventos de produto já capturados pelo
PostHog, mantendo nomes e propriedades equivalentes. O PostHog continua sendo
inicializado e usado como hoje.

## Abordagem

Criar um helper pequeno de analytics com duas responsabilidades:

1. Enviar eventos customizados ao PostHog e ao `gtag`.
2. Enviar pageviews ao GA4 quando a rota interna da SPA mudar.

Os componentes deixam de chamar `posthog.capture` diretamente e passam a usar
o helper compartilhado. Se GA4 ou PostHog não estiver disponível, o outro
continua funcionando.

## Eventos

Manter os nomes existentes:

- `theme_changed`
- `language_changed`
- `project_card_clicked`
- `cv_downloaded`
- `youtube_video_clicked`
- `social_link_clicked`
- `contact_form_submitted`
- `whatsapp_contact_clicked`
- `project_filter_applied`
- `case_study_opened`
- `image_lightbox_opened`

As propriedades atuais serão enviadas sem transformação para ambas as
plataformas.

## Pageviews

O script inicial do GA4 será configurado com `send_page_view: false`. A
aplicação enviará um pageview na carga inicial e em cada mudança de rota,
incluindo:

- `page_path`
- `page_location`
- `page_title`

Isso evita duplicação na primeira carga e cobre navegação via `pushState`.

## Falhas e privacidade

O helper não lança erro quando `window.gtag` estiver ausente ou bloqueado. Não
serão adicionados dados pessoais aos eventos.

## Testes

Adicionar testes estáticos que verifiquem:

- configuração do GA4 sem pageview automático;
- envio de pageviews pela aplicação;
- helper enviando o mesmo evento e propriedades às duas plataformas;
- ausência de chamadas diretas a `posthog.capture` nos componentes migrados.
