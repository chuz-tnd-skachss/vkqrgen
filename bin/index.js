#! /usr/bin/env node
const yargs = require("yargs");
const vkQr = require("@vkontakte/vk-qr");

const fs = require("fs");
const path = require("node:path");

function showHelp() {
  console.log(usage);
  console.log("\nOptions:\r");
  console.log(
    "    -o, --output\t" +
      "      " +
      "QR SVG output filepath." +
      "\t\t" +
      "[string]\r"
  );
  console.log(
    "    -l, --withlogo\t" +
      "      " +
      "Use VK logo in QR. Default: true" +
      "\t\t" +
      "[boolean]\r"
  );
  console.log(
    "    -b, --withbackground\t" +
      "      " +
      "Use background in QR. Default: true" +
      "\t\t" +
      "[boolean]\r"
  );
  console.log(
    "    -bc, --backgroundcolor\t" +
      "      " +
      "Background HEX color in QR. Default: #FFFFFF" +
      "\t\t" +
      "[string]\r"
  );
  console.log(
    "    -fc, --foregroundcolor\t" +
      "      " +
      "Foreground HEX color in QR. Default: #000000" +
      "\t\t" +
      "[string]\r"
  );
  console.log(
    "    -lc, --logocolor\t" +
      "      " +
      "VK logo HEX color in QR. Default: #4680C2" +
      "\t\t" +
      "[string]\r"
  );
  console.log(
    "    -s, --qrsize\t" +
      "      " +
      "QR size. 128/256/512 etc. Default: 512." +
      "\t\t" +
      "[number]\r"
  );
  console.log(
    "\t--version\t      " + "Show version number." + "\t\t" + "[boolean]\r"
  );
  console.log("\t--help\t\t      " + "Show help." + "\t\t\t" + "[boolean]\n");
}

function cwd() {
  return process.cwd();
}

function makeDict(
  opts = {
    qrSize: 512,
    isShowLogo: true,
    isShowBackground: true,
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    logoColor: "#0077ff",
  }
) {
  let opt = {
    qrSize: 512,
    isShowLogo: true,
    isShowBackground: true,
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    logoColor: "#0077ff",
  };
  if (opts.qrSize && opt.qrSize != opts.qrSize) {
    opt.qrSize = opts.qrSize;
  }
  if (opts.isShowLogo && opt.isShowLogo != opts.isShowLogo) {
    opt.isShowLogo = opts.isShowLogo;
  }
  if (opts.isShowBackground && opt.isShowBackground != opts.isShowBackground) {
    opt.isShowBackground = opts.isShowBackground;
  }
  if (opts.backgroundColor && opt.backgroundColor != opts.backgroundColor) {
    opt.backgroundColor = opts.backgroundColor;
  }
  if (opts.foregroundColor && opt.foregroundColor != opts.foregroundColor) {
    opt.foregroundColor = opts.foregroundColor;
  }
  if (opts.logoColor && opt.logoColor != opts.logoColor) {
    opt.logoColor = opts.logoColor;
  }

  return opt;
}

function makeQR(
  text,
  options = {
    qrSize: 512,
    isShowLogo: true,
    isShowBackground: true,
    backgroundColor: "#ffffff",
    foregroundColor: "#000000",
    logoColor: "#4680c2",
  }
) {
  const qrSvg = vkQr.createQR(text, options);
  return qrSvg;
}

function saveQRFile(qrSvg, output = null) {
  let filepath;
  if (output) {
    filepath = output;
  } else {
    filepath = path.join(cwd(), "qr.svg");
  }

  fs.writeFile(filepath, qrSvg, function (err) {
    if (err) {
      return console.log("[!] Не могу сохранить SVG файл: ", err);
    }
    console.log("[+] Файл сохранён по пути: ", filepath);
  });
}


const usage = (
  "\nUsage: vkqrgen <text> - text/link for encoding in QR code."
);

const options = yargs
  .usage(usage)
  .option("text", {
    describe: "text/link to encode in QR.",
    type: "string",
    demandOption: true
  })
  .option("s", {
    alias: "qrsize",
    describe: "QR size. 128/256/512 etc.",
    type: "number",
    demandOption: false,
    default: 512
  })
  .option("o", {
    alias: "output",
    describe: "QR SVG output filepath.",
    type: "string",
    demandOption: false,
    default: path.join(cwd(), 'qr.svg')
  })
  .help(true).argv;


const qr_opts = makeDict(
    opts = {
        qrSize: yargs.argv.qrsize
    }
)
const svg = makeQR(yargs.argv.text, qr_opts);
saveQRFile(svg, yargs.argv.output)
