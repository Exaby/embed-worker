addEventListener('fetch', event => {
event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
const url = new URL(request.url)
const embedUrl = url.searchParams.get('url')
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
if (contentType.startsWith('image/')) {
const html = `

<head>
  <title>${contentType} | ${status} | ${embedUrl}</title>
  <meta charset="utf-8">
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
} else if (contentType.startsWith('video/')) {
const html = `

<head>
  <title>${contentType} | ${status} | ${embedUrl}</title>
  <meta charset="utf-8">
  <meta name="robots" content="noindex">
  <meta name="theme-color" content="${color}">
  <meta property="og:video" content="${embedUrl}">
  <meta property="og:video:width" content="1280">
  <meta property="og:video:height" content="720">
  <meta property="twitter:card" content="summary_large_image">
  <link rel="stylesheet" href="https://cdn.spco.xyz/video/c/TopLevelVideoDocument.css" />
  <link rel="stylesheet" href="https://cdn.spco.xyz/video/c/BottomLevelVideoDocument.css" />
  <script type="text/javascript" src="https://cdn.spco.xyz/video/j/TopLevelVideoDocument.js"></script>
</head>

<body>
  <video src="${embedUrl}"  height="100%%" autoplay controls>
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
