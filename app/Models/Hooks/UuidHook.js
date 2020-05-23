'use strict'

const { v4: uuidv4 } = require('uuid');

const UuidHook = exports = module.exports = {}

UuidHook.uuid = async modelInstance => {
    modelInstance.id = uuidv4();
}
// export async function method(modelInstance) {
//     modelInstance.id = uuidv4();
// }