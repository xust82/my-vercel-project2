const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/call-ai', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "请求中缺少 'prompt' 内容" });
    }

    const SILICON_FLOW_API_KEY = process.env.SILICON_KEY;
    const SILICON_FLOW_API_URL = "https://api.siliconflow.cn/v1/chat/completions";
    const MODEL_IDENTIFIER = "deepseek-ai/DeepSeek-R1";

    const apiResponse = await fetch(SILICON_FLOW_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${SILICON_FLOW_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: MODEL_IDENTIFIER,
            messages: [{ role: "user", content: prompt }],
        }),
    });

    if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        throw new Error(`外部 API 调用失败: ${errorBody}`);
    }

    const data = await apiResponse.json();
    res.json(data);
});

app.listen(port, () => {
    console.log(`服务器已启动! 请在浏览器中打开 http://localhost:${port}`);
});