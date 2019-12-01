export const HOST = process.env.NODE_ENV === 'production' ? 'https://ml-video-trim.netlify.com' : 'http://localhost:5000'
//export const HOST = 'http://52.78.179.78:5000'
//export const getSrcUrl = (url) => process.env.NODE_ENV === 'production' ? `${HOST}${url}` : url;
export const getSrcUrl = (url) => `${HOST}${url}`;
