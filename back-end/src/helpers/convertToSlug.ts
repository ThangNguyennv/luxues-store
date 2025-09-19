import unidecode from 'unidecode'

export const convertToSlug = (text: string): string => {
    const unidecodeText = unidecode(text.trim())
    
    const slug: string = unidecodeText.replace(/\s+/g, '-')
    return slug
}

export const convertToFullName = (text: string): string => {
    const unidecodeText = unidecode(text.trim())
    
    const fullName: string = unidecodeText.replace(/\s+/g, '-')
    return fullName
}