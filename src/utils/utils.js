import fs from "fs";
import Jimp from "jimp";
import path from "path";

const __dirname = process.cwd();
// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      const outpath = __dirname +
        "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      console.log("outpath = ", outpath);
      await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, (img) => {
          resolve(outpath);
        });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

// Get all files name inside img_dir (relative directory)
export function getAllFilesList(img_dir) {
  if (!img_dir) {
    console.log("Default directory would be /tmp/");
    img_dir = "/tmp/";
  } 

  // Full Path to the directory containing images
  let full_path = path.join(__dirname, img_dir);
  let files_name = [];

  try {
    files_name = fs.readdirSync(full_path).map(file => {
                    return full_path + file;
                  })
  } catch (err) {
    console.log(err);
    return null;
  }

  return files_name;
}