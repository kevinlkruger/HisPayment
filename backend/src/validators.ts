export function isValidName(name: string): boolean {
    // Check for special characters - only allow letters, spaces, hyphens, apostrophes
    const specialChars = /[%$#@&^*()!]/;
    return !specialChars.test(name) && name.trim().length > 0;
}

export function isValidEmail(email: string): boolean {
    // Must contain @ and at least one . after @
    const hasAt = email.includes('@');
    const parts = email.split('@');

    if (!hasAt || parts.length !== 2) return false;

    const domainPart = parts[1];
    const hasDot = domainPart.includes('.');

    return hasDot && email.trim().length > 0;
}