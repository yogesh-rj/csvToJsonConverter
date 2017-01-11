var fs = require('fs');
var csv = require('csv');
var url = require('url');
var https = require('https');

var readData = function(res){
	var fn = function(err,data){
        if (err) {
            log.info('Error occurred while reading from file');
            err_and_exit(error);
        }else{
            csv.parse(data, function(error,data){
                if(error){
                    console.log('Error occurred while parsing the csv file');
                }else{
                    if(data.length > 0){
                        total_records = data.length;
                        var records = [];
                        var rec_json;
                        var values = [];
                        console.log(data.length);
                        var headings_array = data[0];
                        console.log("headings:"+headings_array.length); 
                        for(var j=0;j<headings_array.length;j++){
                            var values = [];                   
                            for(i=1;i<data.length;i++){
                                values.push(data[i][j]);
                            }
                            rec_json = {'key':headings_array[j],'values':values};
                            records.push(rec_json);
                        }
                        console.log("total-records:"+records.length);
                        res.json(records);
                    }
                }
            });
        }
    };
    return fn;
};

exports.convertToJson = function(req,res){
    // var options = {
    //     host: url.parse(req.query.q).host,
    //     port: 80,
    //     path: url.parse(req.query.q).pathname
    // };
    var file_name = url.parse(req.query.q).pathname.split('/').pop();
    var file = fs.createWriteStream("temp.csv");
    https.get(req.query.q,(response) => {
        console.log('statusCode:', response.statusCode);
        console.log('headers:', response.headers);
        response.on('data', function(data) {
            file.write(data);
        })
        .on('end',function(){
            fs.readFile('temp.csv','utf8',readData(res));
        })
        .on('erorr', function(e) {
           console.log(e); 
        });
    });
}