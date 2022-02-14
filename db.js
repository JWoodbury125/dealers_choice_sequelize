const Sequelize = require('sequelize')
const db = new Sequelize( process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_db')

const Team = db.define('team', {
    name: {
        type: Sequelize.STRING,
        allowsNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
})
const Division = db.define('division', {
    name: {
        type: Sequelize.STRING,
        allowsNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    }
})
Team.belongsTo(Division)
Division.hasMany(Team)

module.exports = {db, Team, Division}