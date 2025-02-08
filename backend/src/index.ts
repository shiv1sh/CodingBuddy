require("dotenv").config()
import Anthropic from "@anthropic-ai/sdk";


const anthropic = new Anthropic({
  // defaults to process.env["ANTHROPIC_API_KEY"]
});

async function makeAnthropicCall() {
    const msg = await anthropic.messages.create({
        model: "claude-3-Opus",
        max_tokens: 8192,
        temperature: 1, // the amount of randomeness in response (1 will give different form of response each time asked)
        messages: [{
            "role" : "user",
            "content" : "what is 2+2 ?"
        }]
    });
    console.log(msg);
}