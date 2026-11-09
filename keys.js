// file: keys.js
const GEMINI_KEYS = [
    { key: "AQ.Ab8RN6KUHQQhb4FgG3AWfPJvFE30QWYxqppPEyRTGKfFi9aGHQ", disabledUntil: 0 },
    { key: "AQ.Ab8RN6JzocfDNEXx4zvvE3S8y_3z-Gvcx5L3cJrAj9D9RxGphQ", disabledUntil: 0 },
    { key: "AQ.Ab8RN6IKSBPS3xjI-2Ym7U3j9oaquKwJS-8-ZMq_7FejpkOOlA", disabledUntil: 0 },
    { key: "AQ.Ab8RN6IT1LB6R2Zuqv6RHDMN75nWO-HOCau8BWXq6Z229ex3Pw", disabledUntil: 0 },
    { key: "AQ.Ab8RN6KSUIDYfSLWRV2Z0JqRSIm1PunuTOpJHDTYHj4GG4QBnA", disabledUntil: 0 },
    { key: "AQ.Ab8RN6LLT_EZakYKA631-zK3MYRXjVPDJ4ALJ4UeHEkSU0GmCw", disabledUntil: 0 },
    { key: "AQ.Ab8RN6L6wKjkqgdDBqtdf9rmI8MnFwWQhI-V7m1rbib1HdWI0g", disabledUntil: 0 },
    { key: "AQ.Ab8RN6KpJ9dpCRVHSQaD3gjbJcY5cPI2zTc3dHAZLFGCp_EuJg", disabledUntil: 0 },
    { key: "AQ.Ab8RN6L3x_Bu0GHjza1SQmGvjz2THGkjmiPp-JhH28bImkqgTg", disabledUntil: 0 },
    { key: "AQ.Ab8RN6LwXS9uJux0xZ5wV5hsF-m2iaYRgy70889S6eanMgJ01g", disabledUntil: 0 }
];

let currentKeyIndex = 0;

function getNextGeminiEndpoint() {
    const now = Date.now();
    let checkedCount = 0;
    
    while (checkedCount < GEMINI_KEYS.length) {
        if (now >= GEMINI_KEYS[currentKeyIndex].disabledUntil) {
            const activeKey = GEMINI_KEYS[currentKeyIndex].key;
            return {
                endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`,
                index: currentKeyIndex
            };
        }
        currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
        checkedCount++;
    }

    GEMINI_KEYS[currentKeyIndex].disabledUntil = 0;
    return {
        endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEYS[currentKeyIndex].key}`,
        index: currentKeyIndex
    };
}

function markCurrentKeyAsRateLimited() {
    const cooldownTime = 60 * 1000;
    GEMINI_KEYS[currentKeyIndex].disabledUntil = Date.now() + cooldownTime;
    currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
}
