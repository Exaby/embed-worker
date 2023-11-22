addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const embedUrl = url.searchParams.get('url')
  let poster;
  if (url.searchParams.get('img') && url.searchParams.get('img') != "") {
    // Enable poster image for video
     poster = url.searchParams.get('img')
  }

  if (!embedUrl) {
    return new Response('Error: No URL provided', {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  // Send a request to the URL and get the response
  const response = await fetch(embedUrl)

  // Get the content type and status of the response
  const contentType = response.headers.get('Content-Type')
  const status = response.status
  const color = "#40006a";

  // Check the content type and return an appropriate response
  if (contentType.startsWith('image/') || ((contentType.startsWith('application/octet-stream') || contentType.startsWith('text/')) && (embedUrl.endsWith('.webp') || embedUrl.endsWith('.png') || embedUrl.endsWith('.jpg') || embedUrl.endsWith('.jpeg') || embedUrl.endsWith('.gif') || embedUrl.endsWith('.bmp') || embedUrl.endsWith('.tiff') || embedUrl.endsWith('.svg')))) {
    const html = `
  <head>
    <title>${contentType} | ${status} | ${embedUrl}</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width; height=device-height;"></meta>
    <meta name="robots" content="noindex">
    <meta name="theme-color" content="${color}">
    <meta property="og:image" content="${embedUrl}">
    <meta property="twitter:card" content="summary_large_image">
    <link rel="stylesheet" href="https://cdn.spco.xyz/embed/image.css" />
    <link rel="stylesheet" href="https://cdn.spco.xyz/video/c/BottomLevelVideoDocument.css" />
  </head>
  
  <body>
    <div class="c">
    <img class="im" src="${embedUrl}">
    </div>
  </body>
  
  </html>
  `
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } else if (contentType.startsWith('video/') || contentType.startsWith('audio/') || ((contentType.startsWith('application/octet-stream') || contentType.startsWith('text/')) && (embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') || embedUrl.endsWith('.m4a') || embedUrl.endsWith('.mp3') || embedUrl.endsWith('.ogg') || embedUrl.endsWith('.wav')))) {
    const html = `
  
  <head>
    <title>${contentType} | ${status} | ${embedUrl}</title>
    <meta charset="utf-8">
    <meta name="robots" content="noindex">
    <meta name="theme-color" content="${color}">
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width; height=device-height;"></meta>
    <link rel="shortcut icon" href="https://cdn.spco.xyz/assets/img/home/favicon.png"></link>
    <link rel="stylesheet" href="https://cdn.spco.xyz/embed/image.css"/>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta property="og:type" content="video.other" />
    <meta property="og:video:url" content="${embedUrl}" />
    <meta property="og:video:width" content="1280" />
    <meta property="og:video:height" content="720" />
  </head>
  
  <body>
  ` + (poster ? `<video class="video" controls poster="${poster}">` : `<video class="video" controls>`) + `
    <source src="${embedUrl}" type="${contentType}">
    Your browser does not support the video tag.
    </video>
  </body>
  </html>
  `
    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } else {
    return new Response(`Error: Unsupported content type "${contentType}"`, {
      status: 400,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
