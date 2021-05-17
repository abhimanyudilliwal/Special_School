const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

module.exports = {
    encryptPassword: async (password) => {
        try {
            let hash = await bcrypt.hashSync(password, salt);
            return hash
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    checkPassword: async (password, hash) => {
        try {
            let isValid = await bcrypt.compareSync(password, hash);
            if (!isValid) return false;
            return isValid;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}
