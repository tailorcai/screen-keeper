var exec = require("child_process").execSync;
var fs = require("fs");
// var crypto = require("crypto");
var os = require("os");
var moment = require("moment");
var path = require("path");
var config = {
    capture_console_only: false,
};

var root_path = function() {
    if (process.platform == "darwin")
        return "/Volumes/Screens/" + os.hostname()
    if (process.platform == "win32") 
        return "X:/user/screens/"+os.hostname()
}()

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

function capture() {
	if (process.platform == "darwin" && config.capture_console_only && exec("stat -f '%Su' /dev/console").toString().trim() != os.userInfo().username) throw "Not console";
	if (process.platform == "win32") {
		try {
			exec("query user", {windowsHide: true}); // fsr this exits with code 1 which node considers an error
		} catch(cp) {
			if (cp.stdout.toString().split('\n').find(x => x.startsWith('>')).substr(46, 4) == "Disc") throw "Inactive session"; // will capture black screen otherwise
		}
	}
	var filedate = new Date();
	var p1 = moment(filedate).format("mm-ss")
	var filename = `${p1}.jpg`
	var filepath = root_path + moment(filedate).format("/YYYY-MM-DD/HH/") + filename;
    // console.log( filepath )
    mkdirsSync( path.dirname(filepath)  )
    // filepath = filepath + '/' + filename
	if (process.platform == "darwin") {
		exec(`screencapture -x -C -t jpg "${filepath}"`);
	} else if (process.platform == "win32") {
		exec(`"${__dirname}/screenCapture.exe" "${filepath}"`, {windowsHide: true});
	} else {
		exec(`import -silent -window root "${filepath}"`);
	}

    console.log( `yes! ${filepath}`)
}

module.exports = capture;