export default function(db) {
    const devices = db.collection('devices');
    const bulk = devices.initializeUnorderedBulkOp();
    bulk.find({}).update({ $rename: { 'name': 'settings.name' }});
    return bulk.execute();
}
