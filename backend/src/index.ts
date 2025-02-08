require("dotenv").config()
import Anthropic from "@anthropic-ai/sdk";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import express from "express";
import { TextBlock } from "@anthropic-ai/sdk/resources";
import { basePrompt as node_basePrompt} from "./default_pompts/node";
import { basePrompt as react_basePrompt} from "./default_pompts/react";

const app = express();
app.use(express.json());
const anthropic = new Anthropic({
    // defaults to process.env["ANTHROPIC_API_KEY"]
});
app.post("/template",async (req,res)=>{
    const prompt = req.body.prompt;
    const response = await anthropic.messages.create({
        messages: [{
            role: 'user', content: prompt
        },],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        system: "Return either react or node based on what do you think this project should be. Only return a single word either 'node' or 'react. Do not return any thing extra'"
    })
    
    const answer = (response.content[0] as TextBlock).text; // react or node
    if(answer=="react"){
        res.json({
            prompts: [BASE_PROMPT,`Here is an artifact that contains all files of the project visible to you. \nConsider the contents of ALL files in the project.\n\n${react_basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n .gitignore\n- package-lock.json\n `],
            uiPrompt:react_basePrompt
        })
        return;
    }else if(answer==="node"){
       res.json({
        prompt:[`Here is an artifact that contains all files of the project visible to you. \nConsider the contents of ALL files in the project.\n\n${node_basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n .gitignore\n- package-lock.json\n`],
        uiPrompt:node_basePrompt
       })
       return;
    }
    res.json({
        message:"Please give a detailed Prompt"
    })
})
app.listen(3000,()=>{
    console.log("Server started at port 3000");
})
// async function makeAnthropicCall() {
//     await anthropic.messages.stream({
//         messages: [{
//             role: 'user', content: BASE_PROMPT
//         },{
//             role: 'user', content: "Here is an artifact that contains all files of the project visible to you. \nConsider the contents of ALL files in the project.\n\n{{BASE_PROMPT}} \n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n .gitignore\n- package-lock.json\n .bolt/prompt"
//         },{
//             role:'user', content:"Create a todo app"
//         }],
//         model: 'claude-3-5-sonnet-20241022',
//         max_tokens: 1024,
//         system: getSystemPrompt()
//     }).on('text', (text) => {
//         console.log(text);
//     });

// }