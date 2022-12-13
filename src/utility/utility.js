export const utilityFunction = {
    getImgUrl: (pic) => {
        if(/(http(s?)):\/\//i.test(pic)) {
            return pic;
        }
        return require('@/assets/img/'+pic);
    },
    toCamelCase: (str) => {
        console.log(str)
        return str.replace(/-([a-z])/g, (m, p1) => p1.toUpperCase())
    }
}