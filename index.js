console.log('\nMacmillan site to PDF conversion\nCallum Mellor-Reed');

var args = require('system').args.slice(1);
args = parseArguments(args);
var defaults = {
  url: 'http://www.macmillan.org.uk/information-and-support/cervical-cancer/understanding-cancer/cervix.html',
  footer: 'Page %pageNum% out of %pageTotal%'
};

args.url = args.url || defaults.url;
args.footer = args.footer || defaults.footer;

console.log('\nBeginning conversion with settings:');
logSettings(args);

pdf(args);

///////////////////////////////////////////////////////////////////////

/**
 * The main work - converts the given page in to a PDF
 */
function pdf(settings) {
  var page = require('webpage').create();

  var paperSize = {
    format: 'A4',
    margin: {
      top: '22mm',
      bottom: '22mm',
      left: '10mm',
      right: '10mm'
    }
  };

  if (settings.header) {
    paperSize.margin.top = '7mm'; // make room for text
    paperSize.header = {
      height: '15mm',
      contents: phantom.callback(function(pageNum, numPages) {
                  return makeHeadFootText(settings.header, pageNum, numPages);
                })
    }
  }

  if (settings.footer) {
    paperSize.margin.bottom = '7mm'; // make room for text
    paperSize.footer = {
      height: '15mm',
      contents: phantom.callback(function(pageNum, numPages) {
                  return makeHeadFootText(settings.footer, pageNum, numPages);
                })
    }
  }


  page.paperSize = paperSize;

  try {
    page.open(settings.url, function() {
      page.render('result.pdf');
      phantom.exit();
    });
  } catch (ex) {
    console.error(ex.message);
    phantom.exit();
  }
}

function makeHeadFootText(text, pageNum, pageTotal) {
  text = text.replace(/%pageNum%/g, pageNum).replace(/%pageTotal%/g, pageTotal);
  return '<div style="text-align: right; padding-top: 10px; box-sizing: border-box;">' + text + '</div>';
}

/**
 * Utility to log out the settings beings used
 */
function logSettings(settings) {
  for (var key in settings) {
    if (settings.hasOwnProperty(key)) {
      console.log(key + ': ' + settings[key]);
    }
  }
}

/**
 * Parses array of arguments in to an object
 * eg. url=http://google.com ==> { url: 'http://google.com' }
 */
function parseArguments(args) {
  var newArgs = {};
  var badArgs = false;

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    var equalsIndex = arg.indexOf("=");

    if (equalsIndex > -1) {
      newArgs[arg.substr(0, equalsIndex)] = arg.substr(equalsIndex+1);
    } else {
      badArgs = true;
      console.log("BAD ARG: " + arg);
    }
  }

  // if there were bad arguments, don't contine
  if (badArgs) phantom.exit();

  return newArgs;
}
