/**
 * Caption Parser & Intelligence Agent
 * Autonomously inspects Instagram captions generated and published by the external platform.
 * Extracts trigger keywords (e.g. 'Comment DRAG', 'Comment RAG', 'Drop CODE'),
 * embedded deliverable links, and call-to-actions.
 */

function extractTriggerKeyword(caption) {
    if (!caption || typeof caption !== 'string') return 'ACCESS';

    const clean = caption.trim();
    const stopWords = new Set([
        'BELOW', 'HERE', 'NOW', 'THIS', 'THE', 'AND', 'FOR', 'ME', 'TO', 'WITH', 
        'OR', 'SOMETHING', 'A', 'AN', 'IN', 'ON', 'AT', 'GET', 'MY', 'YOUR', 
        'ALL', 'IF', 'YOU', 'OUR', 'WE', 'LIKE', 'JUST', 'PLEASE', 'DOWN'
    ]);

    // 1. Keyword in quotes after trigger verb (e.g. comment 'AGENT', drop "RAG")
    const quotedMatch = clean.match(/(?:comment|dm|drop|reply|type|send)\s*(?:me|with|the\s*word)?\s*['"“‘]([a-zA-Z0-9_-]+)['"”’]/i);
    if (quotedMatch && quotedMatch[1]) {
        return quotedMatch[1].toUpperCase().trim();
    }

    // 2. Word right after trigger verb (e.g. comment DRAG below, comment drag or something, drop CODE)
    const verbMatch = clean.match(/(?:comment|dm|drop|reply|type|send)\s*(?:me|with|the\s*word)?\s+([a-zA-Z0-9_-]{2,20})\b/i);
    if (verbMatch && verbMatch[1]) {
        const candidate = verbMatch[1].toUpperCase().trim();
        if (!stopWords.has(candidate)) {
            return candidate;
        }
    }

    // 3. Quoted word anywhere in text
    const anyQuoted = clean.match(/['"“‘]([a-zA-Z0-9_-]{2,20})['"”’]/);
    if (anyQuoted && anyQuoted[1]) {
        const cand = anyQuoted[1].toUpperCase().trim();
        if (!stopWords.has(cand)) {
            return cand;
        }
    }

    // 4. Standalone all-caps word (3-12 chars) near call to action
    const allCapsWords = clean.match(/\b([A-Z0-9]{3,12})\b/g);
    if (allCapsWords) {
        for (const w of allCapsWords) {
            if (!stopWords.has(w) && !['HTTP', 'HTTPS', 'REEL', 'POST', 'INSTA'].includes(w)) {
                return w;
            }
        }
    }

    return 'ACCESS';
}

function extractDeliverableUrl(caption) {
    if (!caption || typeof caption !== 'string') return null;
    const urlMatch = caption.match(/https?:\/\/[^\s)\]]+/i);
    return urlMatch ? urlMatch[0] : null;
}

function extractLeadMagnetTitle(caption, fallbackTopic = 'Creator Resource') {
    if (!caption || typeof caption !== 'string') return fallbackTopic;
    const lines = caption.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
        let firstLine = lines[0].replace(/[#@][\w.-]+/g, '').replace(/[🚀🤖✨🔥👇📚💥]/g, '').trim();
        if (firstLine.length > 8 && firstLine.length < 80) {
            return firstLine;
        }
    }
    return fallbackTopic;
}

async function parseCaptionIntelligence(caption, providedKeyword = null, providedUrl = null) {
    const keyword = (providedKeyword || extractTriggerKeyword(caption)).toUpperCase().trim();
    const url = providedUrl || extractDeliverableUrl(caption) || 'https://instagram.com';
    const title = extractLeadMagnetTitle(caption, `Exclusive ${keyword} Guide`);

    return {
        keyword,
        deliverableUrl: url,
        title,
        hasExplicitKeyword: Boolean(providedKeyword),
        hasExplicitUrl: Boolean(providedUrl)
    };
}

module.exports = {
    extractTriggerKeyword,
    extractDeliverableUrl,
    extractLeadMagnetTitle,
    parseCaptionIntelligence
};
