/* Supporting functions for tests */

module.exports = function() {
    const support = {
        asyncForEach: async function(array, callback) {
            for (let index = 0; index < array.length; index++) {
                await callback(array[index], index, array);
            }
        },
        addElementsTextToArray: async function(elements) {
            let arr = [];
            await this.asyncForEach(elements, async (element) => {
                return await element.getText().then(text => {
                    return arr.push(text)
                });
            });
            return arr;
        }
    };
    return {
        support: support
    }
}
