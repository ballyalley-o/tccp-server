export const slugify = (text: string): string => {
    const textRegex = /^[A-Za-z0-9\s]$/g
    if (!text || text.length <= 0 || textRegex.test(text)) return 'Unable to slugify: Invalid text provided'

    const slugged = text.trim().toLowerCase().replace(/\s+/, ' ').replace(/\s/, '-')
    return slugged
}