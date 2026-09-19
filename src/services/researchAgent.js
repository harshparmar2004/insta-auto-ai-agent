/**
 * Research & Content Generation Agent
 * Autonomously researches trending topics, drafts high-retention video scripts,
 * and formulates captions with conversion trigger keywords.
 */

const axios = require('axios');

const TRENDING_TOPICS = [
    {
        topic: 'Autonomous AI Agents Architecture',
        keyword: 'AGENT',
        lead_magnet_title: '2026 Autonomous AI Agent Architecture Blueprint',
        hook: 'Stop building basic chatbots! Here is the architecture behind real autonomous AI agents.',
        caption: "Stop building basic chatbots! 🤖\n\nHere is the exact architecture behind autonomous multi-agent systems in 2026.\n\nComment 'AGENT' below and I'll DM you the complete blueprint and implementation code! 🚀\n\n#aiagents #artificialintelligence #python #softwareengineer #coding"
    },
    {
        topic: 'Production RAG (Retrieval-Augmented Generation)',
        keyword: 'RAG',
        lead_magnet_title: 'Production RAG Implementation Guide & Code Templates',
        hook: 'Why 90% of RAG systems fail in production and how to fix them with hybrid search.',
        caption: "Why 90% of RAG pipelines fail in production 💥\n\nMost developers use naive vector search and get hallucinations. Here is how to fix it with hybrid search, re-ranking, and chunk optimization.\n\nComment 'RAG' below and I'll send you the full guide and GitHub repo! 📚\n\n#rag #llm #python #datascience #developer"
    },
    {
        topic: '10x Developer Automation Toolkit',
        keyword: 'TOOLKIT',
        lead_magnet_title: 'Top 10 AI Automation Tools for Modern Developers',
        hook: '10 free developer tools that saved me over 20 hours of coding this week.',
        caption: "10 free developer tools that will save you 20+ hours every week ⚡\n\nFrom automated code reviews to smart testing agents, these are game changers for 2026.\n\nComment 'TOOLKIT' and I'll DM you the complete list with direct access links! 🔥\n\n#developer #programming #codingtools #productivity #tech"
    }
];

async function conductResearch(customTopic = null, apiKey = null) {
    console.log(`[ResearchAgent] 🧠 Starting research on topic: ${customTopic || 'Auto-Trending'}...`);

    // If Gemini API Key is configured, run live LLM research
    const geminiKey = apiKey || process.env.GEMINI_API_KEY;
    if (geminiKey) {
        try {
            const prompt = `You are an elite Instagram growth strategist and technical content researcher.
Research a high-viral-potential topic related to: ${customTopic || 'AI Engineering & Developer Growth'}.
Return a JSON object with:
- "topic": Topic headline
- "keyword": A single, memorable, uppercase trigger word (max 10 letters, e.g. AGENT, RAG, SYSTEM)
- "lead_magnet_title": Title of a valuable companion document/PDF
- "hook": 5-second video hook
- "script": 45-second reel video script
- "caption": Instagram caption ending with "Comment '[KEYWORD]' below to get the full guide!" and 5 relevant hashtags.

Reply strictly in valid JSON format.`;

            const res = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
                {
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                },
                { timeout: 15000 }
            );

            const text = res.data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                const parsed = JSON.parse(text);
                console.log(`[ResearchAgent] ✅ Live Gemini Research complete: "${parsed.topic}" (Keyword: ${parsed.keyword})`);
                return parsed;
            }
        } catch (err) {
            console.warn(`[ResearchAgent] Gemini API fallback: ${err.message}. Using built-in blueprint.`);
        }
    }

    // High-converting built-in heuristic selection
    const selected = TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];
    console.log(`[ResearchAgent] ✅ Research blueprint selected: "${selected.topic}" (Keyword: ${selected.keyword})`);
    return selected;
}

module.exports = {
    conductResearch,
    TRENDING_TOPICS
};
