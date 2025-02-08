require("dotenv").config()
import Anthropic from "@anthropic-ai/sdk";
import { getSystemPrompt } from "./prompts";


const anthropic = new Anthropic({
    // defaults to process.env["ANTHROPIC_API_KEY"]
});

async function makeAnthropicCall() {
    await anthropic.messages.stream({
        messages: [{
            role: 'user', content: "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos. \n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n"
        },{
            role: 'user', content: "Here is an artifact that contains all files of the project visible to you. \nConsider the contents of ALL files in the project.\n\n{{BASE_PROMPT}} \n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n .gitignore\n- package-lock.json\n .bolt/prompt"
        },{
            role:'user', content:"Create a todo app"
        }],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: getSystemPrompt()
    }).on('text', (text) => {
        console.log(text);
    });

}