export const isLocalhost = process.env.NODE_ENV === 'development'

export const getBaseUrl = () => {
    if(isLocalhost) return 'http://localhost:3000'
    return 'https://interior-coffee.vercel.app'
}