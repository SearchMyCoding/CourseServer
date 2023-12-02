export function IsValidURI(uri : string) : boolean{
    const URIFormatChecker : RegExp = /^(https|http):\/\/[^\s$.?#].*$/g;
    return URIFormatChecker.test(uri);
}

export function IsValidRating(rating : number) : boolean{
    return rating >= 0 && rating <= 100;
}

export function convertValidURI(uri : string) : string{
    return /^(https|http):\/\//.test(uri) ? uri : 'https://' + uri;
}

export function convertFormat(link : string | null, img_link : string | null){
    const validURI = !!link ? convertValidURI(link) : null;
    const validIMG_URI = !!img_link ? convertValidURI(img_link) : null;
    return [validURI, validIMG_URI];
}