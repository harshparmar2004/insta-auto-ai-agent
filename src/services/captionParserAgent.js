/**
 * Caption Parser & Intelligence Agent
 * Autonomously inspects Instagram captions generated and published by the external platform.
 * Extracts trigger keywords, embedded deliverable links, and call-to-actions.
 */

function extractTriggerKeyword(caption) {
    if (!caption || typeof caption !== 'string') return 'ACCESS';

    const clean = caption.trim();

    // Pattern 1: Explicit quotes after comment/dm/reply/type/drop
    // e.g. Comment 'AGENT' below, drop "CODE", DM 'SYSTEM'
    const quotedMatch = clean.match(/(?:comment|dm|drop|reply|type|send)\s*(?:me|with|the\s*word)?\s*['"“‘]([a-zA-Z0-9_-]+)['"”’]/i);
    if (quotedMatch && quotedMatch[1]) {
        return quotedMatch[1].toUpperCase().trim();
    }

    // Pattern 2: All-caps word right after trigger verb
    // e.g. Comment DESIGN below, Drop CODE in comments
    const capsMatch = clean.match(/(?:comment|dm|drop|reply|type)\s+([A-Z0-9]{2,15})\b/);
    if (capsMatch && capsMatch[1]) {
        const word = capsMatch[1].toUpperCase().trim();
        // Ignore common stop words
        const stopWords = ['BELOW', 'HERE', 'NOW', 'THIS', 'THE', 'AND', 'FOR', 'ME', 'TO', 'WITH'];
        if (!stopWords.includes(word)) {
            return word;
        }
    }

    // Pattern 3: Any quoted uppercase word in the caption
    const anyQuoted = clean.match(/['"“‘]([A-Z0-9]{2,15})['"”’]/);
    if (anyQuoted && anyQuoted[1]) {
        return anyQuoted[1].toUpperCase().trim();
    }

    // Fallback default trigger keyword
    return 'ACCESS';
}

function extractDeliverableUrl(caption) {
    if (!caption || typeof caption !== 'string') return null;
    const urlMatch = caption.match(/https?:\/\/[^\s)\]]+/i);
    return urlMatch ? urlMatch[0] : null;
}

function extractLeadMagnetTitle(caption, fallbackTopic = 'Creator Resource') {
    if (!caption || typeof caption !== 'string') return fallbackTopic;
    // Extract first line or hook
    const lines = caption.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0) {
        let firstLine = lines[0].replace(/[#@][\w.-]+/g, '').replace(/[🚀🤖✨🔥👇📚💥]/g, '').trim();
        if (firstLine.length > 10 && firstLine.length < 80) {
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
