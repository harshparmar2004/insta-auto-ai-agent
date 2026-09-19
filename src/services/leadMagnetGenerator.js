/**
 * Lead Magnet Generator
 * Creates deliverable companion guides, code templates, or resource links
 * that followers receive when they comment on the post.
 */

const { v4: uuidv4 } = require('uuid');

async function generateLeadMagnet(researchData, baseUrl = 'http://localhost:3000') {
    const slug = (researchData.keyword || 'guide').toLowerCase() + '-' + uuidv4().slice(0, 8);
    const deliverableUrl = `${baseUrl}/resources/${slug}`;

    console.log(`[LeadMagnet] 📄 Generated deliverable guide for "${researchData.lead_magnet_title}": ${deliverableUrl}`);

    return {
        slug,
        title: researchData.lead_magnet_title,
        deliverableUrl,
        format: 'interactive_guide',
        createdAt: new Date().toISOString()
    };
}

module.exports = {
    generateLeadMagnet
};
