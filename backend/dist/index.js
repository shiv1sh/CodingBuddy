"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const prompts_1 = require("./prompts");
const express_1 = __importDefault(require("express"));
const node_1 = require("./default_pompts/node");
const react_1 = require("./default_pompts/react");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const anthropic = new sdk_1.default({
// defaults to process.env["ANTHROPIC_API_KEY"]
});
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Control came here");
    const prompt = req.body.prompt;
    const response = yield anthropic.messages.create({
        messages: [{
                role: 'user', content: prompt
            },],
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 200,
        system: "Return either react or node based on what do you think this project should be. Only return a single word either 'node' or 'react. Do not return any thing extra'"
    });
    const answer = response.content[0].text; // react or node
    if (answer == "react") {
        res.json({
            prompts: [prompts_1.BASE_PROMPT, react_1.basePrompt]
        });
        return;
    }
    else if (answer === "node") {
        res.json({
            prompt: [node_1.basePrompt]
        });
        return;
    }
    res.json({
        message: "Please give a detailed Prompt"
    });
}));
app.listen(3000, () => {
    console.log("Server started at port 3000");
});
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
