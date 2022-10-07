export const utilityFunction = {
    getImgUrl: (pic) => {
        if(/(http(s?)):\/\//i.test(pic)) {
            return pic;
        }
        return require('@/assets/img/'+pic);
    }
}