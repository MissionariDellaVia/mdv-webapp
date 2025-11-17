const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/assets/data/data.json');
const FIREBASE_URL = process.env.VUE_APP_FIREBASE_DATABASE_URL || 'https://mdv-webapp-default-rtdb.europe-west1.firebasedatabase.app';

async function migrateAttivitaData() {
    console.log('🚀 Starting attività migration to Firebase...\n');

    const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));

    const languages = ['it', 'en'];

    for (const lang of languages) {
        if (!data[lang] || !data[lang].attivita) {
            console.log(`⚠️  No attività data found for language: ${lang}`);
            continue;
        }

        const attivitaData = data[lang].attivita;

        console.log(`📦 Migrating ${lang} attività data...`);
        console.log(`   Groups: ${attivitaData.groups?.length || 0}`);

        const imagesToMigrate = [];
        if (attivitaData.groups) {
            attivitaData.groups.forEach(group => {
                if (group.sections) {
                    group.sections.forEach(section => {
                        if (section.image?.url) {
                            const imageUrl = section.image.url;
                            if (!imageUrl.startsWith('http')) {
                                imagesToMigrate.push({
                                    group: group.key,
                                    image: imageUrl
                                });
                            }
                        }
                    });
                }
            });
        }

        if (imagesToMigrate.length > 0) {
            console.log(`\n⚠️  Found ${imagesToMigrate.length} local images that need migration:`);
            imagesToMigrate.forEach(item => {
                console.log(`   - ${item.image} (in group: ${item.group})`);
            });
            console.log('\n📝 Action required:');
            console.log('   1. Upload these images via admin panel');
            console.log('   2. Update the image URLs in Firebase with the new API URLs');
        }

        const firebaseEndpoint = `${FIREBASE_URL}/pages/${lang}/attivita.json`;

        console.log(`\n🔗 Firebase endpoint: ${firebaseEndpoint}`);
        console.log('\n📋 Data to upload:');
        console.log(JSON.stringify(attivitaData, null, 2));

        console.log('\n✅ To complete migration:');
        console.log(`   curl -X PUT "${firebaseEndpoint}" \\`);
        console.log(`     -H "Content-Type: application/json" \\`);
        console.log(`     -d '${JSON.stringify(attivitaData)}'`);
        console.log('');
    }

    console.log('\n✨ Migration plan generated!');
    console.log('\n📌 Next steps:');
    console.log('   1. Upload local images via /admin panel');
    console.log('   2. Note the new image URLs from API');
    console.log('   3. Update the JSON above with new URLs');
    console.log('   4. Use curl command or admin panel to save to Firebase');
}

migrateAttivitaData().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
