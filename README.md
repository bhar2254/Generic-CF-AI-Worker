# Cloudflare Worker: AI Playground

This Cloudflare Worker is an AI-powered playground that integrates Cloudflare's AI API to generate content such as text-based responses (e.g., jokes, stories) and text-to-image outputs. It provides a simple web interface that allows users to submit prompts and get responses from AI models. The worker can be easily deployed directly from the Cloudflare Dashboard.

## Features

- **AI Integration**: Uses Cloudflare's AI API to generate content based on user input.
- **Text Generation**: Generate text responses from an AI model (e.g., jokes, text completions).
- **Text to Image**: Generate images from text prompts.
- **Responsive Interface**: The web interface is mobile-friendly, built with Bootstrap 5.
- **Embed Page**: Generate AI content via an embeddable form that can be integrated into other websites or applications.
- **Customizable**: Easily change the content, styling, and AI models through the Worker script.

## File Overview

- **BSPage class**: Handles the generation of HTML content with customizable titles and page content.
- **Navbar**: A sticky, responsive navigation bar that links to different sections of the site (About, Contact, Blog, etc.).
- **Routing Logic**: 
  - `/`: Displays the main form where users can input prompts and select the AI model.
  - `/embed`: Provides an embeddable form to interact with the AI.
  - `/response`: Displays the generated AI response based on the user's input.

## How It Works

1. **Access the Interface**: Users can access the main page (`/`) or the embedded page (`/embed`) where they can submit a prompt and select an AI model (text generation or text-to-image).
2. **Submit a Prompt**: Upon submitting the form, a request is sent to the `/response` endpoint with the prompt and selected model.
3. **Generate AI Response**: The Worker interacts with Cloudflare's AI API to generate a response based on the user's input.
4. **Display Response**: The generated result is displayed on a new page, along with an option to go back to the form and generate more content.

## Deploying the Worker via Cloudflare Dashboard

### Step 1: Access Cloudflare Dashboard
- Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
- Select the **Workers** section from your account’s dashboard.

### Step 2: Create a New Worker
- Click on **Create a Worker**.
- You'll be directed to the Worker editor.

### Step 3: Add the Worker Script
- In the editor, copy and paste the provided Cloudflare Worker script (the one you have).
- This script includes the logic for handling AI requests, generating HTML responses, and managing routing.

### Step 4: Configure the Worker Environment
- You may need to configure the Worker’s environment by linking it with Cloudflare's AI service. This can usually be done by specifying environment variables or ensuring the worker has access to Cloudflare's AI API. If you haven’t already, create an API key or environment configuration for your AI requests.
- Make sure the script is configured to use the correct AI model (e.g., `@cf/meta/llama-3-8b-instruct`).

### Step 5: Save and Deploy
- Once the script is added, click on **Save and Deploy**.
- Your Worker is now live and accessible at the URL assigned by Cloudflare.

### Step 6: Access the Worker
- After deployment, you can access the Worker through the provided URL. The main page will be available at the root path (`/`), and you can also access the embed page (`/embed`) for embedding the AI form into other sites.

## Customizing the Page

You can customize the page content, styling, and AI interaction in the following ways:

- **Title and Content**: The `BSPage` class can be modified to change the title and content of the page dynamically. The content is set via the `innerContent` property.
- **CSS Styles**: The page uses custom CSS for styling elements like buttons, background colors, and text areas. Modify the CSS inside the `loadHeadFootCode()` function to fit your design preferences.
- **AI Model**: The worker is set to use Cloudflare's `@cf/meta/llama-3-8b-instruct` AI model for text generation. You can change the model name in the script if you prefer to use a different model.

## Error Handling

- **HTTPS Requirement**: All requests must be made over HTTPS. If a request is made using HTTP, the Worker will return a 400 Bad Request error.
- **Invalid Action**: If an invalid action (e.g., an unsupported AI model) is selected, the Worker will return an error message indicating that the action is invalid.

## Example AI Responses

- **Text Generation**: 
  - Prompt: "Tell me a joke."
  - AI Response: "Why did the computer go to the doctor? Because it had a virus!"

- **Text-to-Image**: 
  - Prompt: "Generate an image of a sunset over the ocean."
  - AI Response: (Displays the generated image based on the description provided).

## Dependencies

- **Bootstrap 5**: Used for responsive layout and UI components.
- **Cloudflare AI**: Used for generating AI-based text and images.

## License

This project is licensed under the **GNU General Public License v3.0**. You can freely modify and distribute the code, provided that any derivative works are also licensed under the same terms.

For more details, see the [LICENSE file](LICENSE).

---

For more details, visit the [Cloudflare Workers Docs](https://developers.cloudflare.com/workers).
