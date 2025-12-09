const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

function sanitizeHTML(dirty) {
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: ['b','i','em','strong','p','ul','ol','li','a','br','span'],
        ALLOWED_ATTR: { a: ['href','title','target'] },
        ALLOW_DATA_ATTR: false,
        FORBID_ATTR: ['style'],
    })
}

module.exports = sanitizeHTML;