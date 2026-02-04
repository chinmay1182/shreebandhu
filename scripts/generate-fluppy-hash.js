/**
 * Generate Bcrypt Hash for New Admin Password: "Fluppy"
 */

const bcrypt = require('bcryptjs');

async function hashPassword() {
    const password = 'Fluppy';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    console.log('\n==============================================');
    console.log('New Admin Password Hash');
    console.log('==============================================\n');
    console.log('Password:', password);
    console.log('\nBcrypt Hash:');
    console.log(hash);
    console.log('\n==============================================');
    console.log('SQL Update Command:');
    console.log('==============================================\n');
    console.log(`UPDATE admins SET password = '${hash}' WHERE username = 'admin';`);
    console.log('\n==============================================\n');
}

hashPassword();
