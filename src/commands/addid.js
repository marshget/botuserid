const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'addid',
    description: 'Add an ID to the Lua file.',
    options: [
        {
            name: 'id',
            type: 3, // STRING
            description: 'The ID to add.',
            required: true,
        },
    ],
    async execute(interaction) {
        const newId = interaction.options.getString('id').trim();
        const filePath = path.join(__dirname, '../../data.lua');

        // Baca file data.lua (buat file jika belum ada)
        let luaContent = '';
        if (fs.existsSync(filePath)) {
            luaContent = fs.readFileSync(filePath, 'utf8');
        } else {
            luaContent = 'return {}'; // Format awal jika file kosong
        }

        // Ambil angka yang ada di file
        const matches = luaContent.match(/return\s*{([^}]*)}/);
        const existingIds = matches && matches[1]
            ? matches[1].split(',').map(id => id.trim()).filter(id => id !== '')
            : [];

        // Cek jika ID sudah ada
        if (existingIds.includes(newId)) {
            return interaction.reply(`ID \`${newId}\` sudah ada di file.`);
        }

        // Tambahkan ID baru
        existingIds.push(newId);

        // Format ulang file
        const newLuaContent = `return { ${existingIds.join(', ')} }`;

        // Simpan kembali file
        fs.writeFileSync(filePath, newLuaContent);

        // Balas ke user
        await interaction.reply(`ID \`${newId}\` berhasil ditambahkan!`);
    },
};
