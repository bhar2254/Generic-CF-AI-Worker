import { Ai } from './vendor/@cloudflare/ai.js';

class BSPage {
    constructor(title, options) {
        this.title = title
        this.innerContent = options.content || ''
        this.loadHeadFootCode()
    }
    setContent(text) {
        this.innerContent = text
    }
    printPage() {
        let retval = this.headCode
        retval += this.innerContent
        retval += this.footCode
        return retval
    }
    loadHeadFootCode() {
        this.headCode = `<!DOCTYPE html>
        <html lang="en" data-bs-theme="dark">
            <head>
                <meta charset="utf8" />
                <title>AI Playground | ${this.title}</title>
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <link rel="icon" type="image/x-icon" href="https://blaineharper.com/assets/favicon.ico">
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3/dist/css/bootstrap.min.css">
                <style>
                    body {
                      --bh-primary: hsla(208, 100%, 22%, 1);
                      --bh-secondary: #F7C564;
                    }
                    .btn {
                        font-weight: 700;
                        font-size:15px;
                        line-height:1.5;
                        font-family: Roboto, -apple-system, BlinkMacSystemFont, "San Francisco", "Helvetica Neue", Arial, Ubuntu, sans-serif;
                    }
                    .btn-primary {
                        --bs-btn-bg: var(--bh-primary);
                        --bs-btn-border-color: var(--bh-primary);
                        --bs-btn-hover-bg: var(--bh-secondary);
                        --bs-btn-hover-border-color: var(--bh-secondary);
                    }

                    @media only screen and (min-width: 992px) {
                      .hide-on-shrink {
                        display: block;
                      }
                      .navbar-right {
                        margin-left:80%;
                        position:absolute;
                      }
                    }
                    
                    @media only screen and (max-width: 992px) {
                      .hide-on-shrink {
                        display: none;
                      }
                    }
                    
                    img.loading {
                      background: transparent url("https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif") no-repeat scroll center center;
                    }
                </style>
            </head>
            <body>
                `
        
        this.footCode = `
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
            </body>
        </html>
        `
    }
}

var navbar = `
<nav class="navbar navbar-expand-lg bg-dark sticky-top shadow-lg">
	<div class="container-fluid">
		<button class="my-1 navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<a style="margin-left:10%; position:absolute;" class="navbar-brand hide-on-shrink" href="https://blaineharper.com">BlaineHarper.com</a>
			<ul class="navbar-nav mx-auto">
        <li class="nav-item">
          <a class="nav-link" href="https://blaineharper.com/about">About Me</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://blaineharper.com/contact">Contact</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://blaineharper.com/posts">Blog</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://ai.blaineharper.com">AI</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="https://passgen.blaineharper.com">Password Generator</a>
        </li>
			</ul>
		</div>
	</div>
</nav>`

export default {
  async fetch(request, env) {
    const url = request.url;
    function getParameterByName(name) {
      name = name.replace(/[\[\]]/g, "\\$&");
      name = name.replace(/\//g, "/");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
      if (!results)
        return null;
      else if (!results[2])
        return "";
      else if (results[2]) {
        results[2] = results[2].replace(/\//g, "/");
      }
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    function rawHtmlResponse(html) {
      return new Response(html, {
        headers: {
          "content-type": "text/html;charset=UTF-8"
        }
      });
    }
    async function BadRequestException(reason) {
      this.status = 400;
      this.statusText = "Bad Request";
      this.reason = reason;
    }
    const { host, protocol, pathname } = new URL(request.url);
    if ("https:" !== protocol || "https" !== request.headers.get("x-forwarded-proto")) {
      throw new BadRequestException("Please use a HTTPS connection.");
    }

    switch (pathname) {
      case "/": {
        let bodyContent = `
          <div class="text-muted">This form uses Cloudflare's AI API via Workers to generate artificial content. To build your own, or learn more about, Cloudflare Workers and AI visit <a href="https://developers.cloudflare.com/workers-ai/">Cloudflare Docs</a>.</div>
          <hr>
          <form id="page_form" method="GET" class="col-11 text-center" action="/response">
            <div class="row mb-3">
              <div class="col-9 mx-auto">
                <label class="mb-1" for="prompt">Prompt</label>
                <textarea rows='4' class="form-control mb-1 bg-secondary" name="prompt" value="" placeholder="" type="text"></textarea>
                <label class="mb-1" for="action">AI Model</label>
                <select id="page_form_action" class="form-control mb-1 bg-secondary" name="action">
                  <option value="text">Text Generation</option>
                  <option value="image">Text to Image</option>
                </select>
                </div>
            </div>
            <button class="py-2 btn btn-primary" type="submit">Generate</button>
          </form>`

        let currentPage = new BSPage('Index',{content:`
          ${navbar}
          <body style="background-color: var(--bh-primary);"> 
            <div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 90vh;">
              <div class="container my-5">
                <div class="row">
                  <div class="col-lg-8 col-xs-12 mx-auto">
                    <div class="text-white rounded" style="background-color:hsl(238deg, 6%, 14%);">
                      <div class='container p-3'>
                        ${bodyContent}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        `})

        return rawHtmlResponse(currentPage.printPage())
      }
      case "/embed": {
        let queryAction = getParameterByName("action") || 'text'
        let bodyContent = `
          <form id="page_form" method="GET" class="col-11 text-center" action="/response">
            <div class="row mb-3">
              <div class="col-9 mx-auto">
                <div class="row my-2">
                  <label for="prompt">Prompt</label>
                  <textarea rows='4' class="form-control mb-1 bg-secondary" name="prompt" value="" placeholder="" type="text"></textarea>
                </div>
                <div class="row my-2">
                  <label for="action">AI Model</label>
                  <select id="page_form_action" class="form-control mb-1 bg-secondary" name="action">
                    <option value="text">Text Generation</option>
                    <option value="image">Text to Image</option>
                  </select>
                  </div>
                </div>
            </div>
            <button class="py-2 btn btn-primary" type="submit">Generate</button>
          </form>`

        let currentPage = new BSPage('Index',{content:`
          <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center">
            ${bodyContent}
            <div class="btn btn-group">
              <button id="back" class="my-3 py-2 btn btn-secondary" onclick="location.href='/'">Back</button>
            </div>
          </div>
        `})

        return rawHtmlResponse(currentPage.printPage())
      }
      case "/response": {
        let queryAction = getParameterByName("action") || 'text'
        let bodyContent = ''

        switch(queryAction) {
          case "image": {
            let queryPrompt = getParameterByName("prompt") || 'cyberpunk cat';
            bodyContent = `
            <div class="container">
              <div class="col-6 mx-auto">
                <img id="aiImage" class="img-fluid loading" src="/image?prompt=${queryPrompt}">
              </div>
            </div>`
            break;
          }
          case "text": {
            let queryPrompt = getParameterByName("prompt") || 'Tell me a joke, please?';
            const ai = new Ai(env.AI);
            const response = await ai.run(
              "@cf/meta/llama-2-7b-chat-int8",
              {
                prompt: queryPrompt
              }
            );
            bodyContent = response.response
            break;
          }
          default: {
            bodyContent = 'Invalid Action Provided!'
          }
        }

        let currentPage = new BSPage('Index',{content:`
          <div class="d-flex flex-column min-vh-98 justify-content-center align-items-center">
            ${bodyContent}
            <div class="btn btn-group">
              <button id="back" class="my-3 py-2 btn btn-secondary" onclick="location.href='/'">Back</button>
            </div>
          </div>
        `})

        return rawHtmlResponse(currentPage.printPage())
      }
      case "/image": {        
        let queryPrompt = getParameterByName("prompt") || 'cyberpunk cat';
        const ai = new Ai(env.AI);
    
        const inputs = {
          prompt: queryPrompt
        };

        const response = await ai.run(
          '@cf/stabilityai/stable-diffusion-xl-base-1.0',
          inputs
        );

        return new Response(response, {
          headers: {
            'content-type': 'image/png'
          }
        });
      }
      case "/text": {        
        let queryPrompt = getParameterByName("prompt") || 'Tell me something funny?';
        const ai = new Ai(env.AI);
        const response = await ai.run(
          "@cf/meta/llama-2-7b-chat-int8",
          {
            prompt: queryPrompt
          }
        );

        return new Response(JSON.stringify(response));
      }
      default: {
        return new Response(JSON.stringify({"status": 404}));
      }
    };
  }
};
