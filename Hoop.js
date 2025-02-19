let HoopTable = require('./HoopTable')

class Hoop {
    constructor(hoopDBPath) {
        this.openTables = []
        this.hoopDBPath = hoopDBPath
        this.token = null
        
        let _this = this

        this.connect = function(token) {
            _this.token = token
        }

        this.closeTable = function(table) {
            table.close(true)
            this.openTables = this.openTables.filter(function(value, index, arr) {
                return value != table
            })
        }

        this.close = function() {
            this.openTables.forEach(table => { table.close(true) })
        }

        this.getTable = function(name) {
            return new Promise(function(resolve, reject) {
                if (!_this.token)
                    reject('You are not logged-in')

                let usertable = null

                _this.openTables.forEach(table => {
                    if (table.name === name) resolve(table)
                })

                usertable = new HoopTable(name, hoopDBPath, _this.token)

                usertable.on('loaded', function() {
                    _this.openTables.push(usertable)
                    resolve(usertable)
                })

                usertable.on('load-error', function(err) {
                    reject(err)
                })
            })
        }
    }
}

module.exports = Hoop