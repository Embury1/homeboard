export default function (db) {
    return db.createCollection('products', {
        viewOn: 'vendors',
        pipeline: [
            {
                "$unwind": "$products"
            },
            {
                "$group": {
                    "_id": "$products.name",
                    "tags": {
                        "$push": {
                            "vendor": "$name",
                            "barcode": {
                                "$concat": [
                                    "$prefix",
                                    "$products.serial"
                                ]
                            }
                        }
                    }
                }
            }
        ]
    });
}

// [
//     {
//         "name": "products",
//         "type": "view",
//         "options": {
//             "viewOn": "vendors",
//             "pipeline": [
//                 {
//                     "$unwind": "$products"
//                 },
//                 {
//                     "$group": {
//                         "_id": "$products.name",
//                         "tags": {
//                             "$push": {
//                                 "vendor": "$name",
//                                 "barcode": {
//                                     "$concat": [
//                                         "$prefix",
//                                         "$products.serial"
//                                     ]
//                                 }
//                             }
//                         }
//                     }
//                 }
//             ]
//         },
//         "info": {
//             "readOnly": true
//         }
//     }
// ]