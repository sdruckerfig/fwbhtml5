// JavaScript Document
var FriendsWithBeerDB = {
    db: null,
    init: function() {
        var me = this;

        // allocate a 5mb database
        this.db = openDatabase('FriendsWithBeer', '1.0', 'Friends With Beer Cached Data', 5 * 1024 * 1024);

        // create the tables
        this.db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS beer (id INTEGER, name TEXT, type TEXT, country TEXT)', [], me.onSuccess, me.onError);
        });

        this.db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS friend (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, address TEXT, zipcode TEXT, email TEXT, phone TEXT, lat TEXT, lng TEXT, beerId INTEGER)', [], me.onSuccess, me.onError);
        });

        return this.db;
    },

    runQuery: function(sql, callback) {
        this.db.transaction(function(tx) {
            tx.executeSql(sql, [],
                function(tx, rs) {
                    var a = [];
                    for (var i = 0; i < rs.rows.length; i++) {
                        a[a.length] = rs.rows.item(i);
                    }
                    callback(a);
                },
                function() {
                    console.log('fail', arguments);
                }
            );
        });
    },

    writeRecord: function(tablename, id, fields, callback) {


        if (id === null || id === "") {
            // insert
            var aFields = [],
                aPlaceHolders = [],
                aValues = [];
            for (var i = 0; i < fields.length; i++) {
                aFields.push(fields[i].name);
                aValues.push(fields[i].value);
                aPlaceHolders.push('?');
            }
            var sql = 'INSERT INTO ' + tablename + ' (' + aFields.join(',') + ') VALUES (' + aPlaceHolders.join(',') + ')';

            this.db.transaction(function(tx) {
                tx.executeSql(sql,
                    aValues,
                    function() {

                        if (callback)
                            callback(arguments);
                    },
                    function() {

                        console.log('db insertion error', arguments);
                    }
                );
            });

        } else {
            var sql = "update " + tablename + " set ", aValues = [];
            for (var i = 0; i < fields.length; i++) {
                sql += fields[i].name + " = ?";
                aValues.push(fields[i].value);
                if (i < fields.length - 1)
                    sql += ', '
            }
            sql += ' where id = ?'
            aValues.push(id);
            this.db.transaction(function(tx) {
                tx.executeSql(
                    sql,
                    aValues,
                    function() {
                        callback(arguments);
                    },
                    function() {
                        console.log('db insertion error', arguments);
                    }
                )
            });


        }

    },

    importTable: function(tablename, aData) {

        this.db.transaction(function(tx) {
            tx.executeSql('delete from ' + tablename);
        });

        if (aData.length > 0) {

            // build SQL expression   
            var aFields = [],
                aPlaceHolders = [];
            for (var key in aData[0]) {
                aFields.push(key);
                aPlaceHolders.push('?');
            }
            var sql = 'INSERT INTO ' + tablename + ' (' + aFields.join(',') + ') VALUES (' + aPlaceHolders.join(',') + ')';

            // write data to db
            this.db.transaction(function(tx) {

                for (var i = 0; i < aData.length; i++) {
                    var aValues = [];

                    for (var key in aData[i]) {
                        aValues.push(aData[i][key]);
                    }

                    tx.executeSql(sql,
                        aValues,

                        function() {
                            console.log('inserted row');
                        },

                        function() {
                            console.log('failed', arguments);
                        });
                }
            });
        }
    },

    onError: function(tx, e) {
        alert("Error: " + e.message);
    },

    onSuccess: function(e) {
        console.log('dbsuccess', e);
    }
}

FriendsWithBeerDB.init();