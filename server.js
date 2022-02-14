const { db, Team, Division } = require('./db') 
const express = require('express')
const app = express()
const methodOverride = require('method-override')

app.use(express.urlencoded({ extended:false }))

app.use(methodOverride('_method'))

app.delete('/teams/:teamId', async (req, res, next) => {
    try {
        const team = await Team.findByPk(req.params.teamId)
        const teamDivId = team.dataValues.divisionId
        await team.destroy()
        res.redirect(`/teams/${teamDivId}`)
    }
    catch(ex){
        next(ex)
    }
})

app.post('/teams/:divisionId', async (req, res, next) => {
    try{
        const team = await Team.create(req.body)
        res.redirect(`/teams/${req.params.divisionId}`)

    }
    catch(ex){
        next(ex)
    }
})

app.get('/', (req,res) => res.redirect('/divisions'))

app.get('/divisions', async (req, res, next) => {
    try{
        const divisions = await Division.findAll({ include: [ Team ] })
        const html = divisions.map(division => {
            return `
            <div> ${division.name} <a href='/teams/${division.id}'> teams>></a></div>
            `
        }).join('')

        res.send(`<html>
                    <head><title>NFL DIVISIONS</title>
                    </head>
                    <body>
                        <h1> NFL DIVISIONS</h1>
                        ${html}
                    </body>

                 </html>`)

    }
    catch(ex){
        next(ex)
    }
})

app.get('/teams/:teamId', async (req, res, next) => {
    try{
        const teams = await Team.findAll( {where: {divisionId: req.params.teamId}})
        const divisions = await Division.findByPk( req.params.teamId)
        const divisionList = await Division.findAll()

        const html = teams.map(team => {
            return `<div>
                        ${team.name}
                        <form method='POST' action='/teams/${team.id}?_method=delete'>
                            <button> Delete </button> 
                        </form>    
                    </div>`
        }).join('')
        res.send(`<html>
                    <head><title>${divisions.dataValues.name}</title></head>
                    <h1>${divisions.dataValues.name} TEAMS</h1>
                    <a href='/'> >>Back To Divisions </a>
                    <body>
                        <p>
                        ${html}
                        </p>
                        <form method='POST'>
                            <input name='name' placeholder='Enter Team Name' />
                            <select name='divisionId'>
                                ${divisionList.map(dList => {
                                    return `
                                        <option value='${dList.id}'> ${dList.name} </option>
                                    `
                                    }).join('')
                                }
                            </select>
                            <button> Create Team </button>
                        </form>
                            
                    </body>
                  </html>`)
    }
    catch(ex){
        next(ex)
    }
})


const init = async (req, res, next) => {
    try{
        await db.sync( {force: true} )
        console.log("db connected")
        const afcNorth = await Division.create({name: 'AFC_NORTH'})
        const afcSouth = await Division.create({name: 'AFC_SOUTH'})
        const afcEast = await Division.create({name: 'AFC_EAST'})
        const afcWest = await Division.create({name: 'AFC_WEST'})
        const nfcNorth = await Division.create({name: 'NFC_NORTH'})
        const nfcSouth = await Division.create({name: 'NFC_SOUTH'})
        const nfcEast = await Division.create({name: 'NFC_EAST'})
        const nfcWest = await Division.create({name: 'NFC_WEST'})
        await Team.create({name: 'Arizona Cardinals', divisionId: afcNorth.id})
        await Team.create({name: 'Cleveland Browns', divisionId: afcNorth.id})
        await Team.create({name: 'Atlanta Falcons', divisionId: nfcSouth.id})
        await Team.create({name: 'Indianapolis Colts', divisionId: nfcSouth.id})
        await Team.create({name: 'Dallas Cowboys', divisionId: nfcEast.id})
        await Team.create({name: 'New York Giants', divisionId: nfcEast.id})
        await Team.create({name: 'Los Angeles Rams', divisionId: nfcWest.id})
        await Team.create({name: 'Seattle Seahawks', divisionId: nfcWest.id})
        await Team.create({name: 'Minnesota Vikings', divisionId: nfcNorth.id})
        await Team.create({name: 'Baltimore Ravens', divisionId: nfcNorth.id})
        await Team.create({name: 'Buffalo Bills', divisionId: afcEast.id})
        await Team.create({name: 'Miami Dolphins', divisionId: afcEast.id})
        await Team.create({name: 'Denver Broncos', divisionId: afcWest.id})
        await Team.create({name: 'Kansas City Chiefs', divisionId: afcWest.id})
        await Team.create({name: 'Houston Texans', divisionId: afcSouth.id})
        await Team.create({name: 'Jacksonville Jaguars', divisionId: afcSouth.id})
    }
    catch(ex){
        next(ex)
    }
}

init()

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log('listening on port', PORT))