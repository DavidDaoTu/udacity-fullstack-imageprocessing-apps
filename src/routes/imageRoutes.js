import express from "express";
import { deleteLocalFiles, filterImageFromURL, getAllFilesList } from "../utils/utils.js";
export const router = express.Router();

// router.post("/", uploadImage.single('file'), async (req, res) => {
//     if(req.file){
//         res.status(201).json({url: req.file.location});
//     } else {
//         console.error('S3 upload failed', req)
//         res.status(500).send('Image upload failed')
//     }
// });


// @TODO1 IMPLEMENT A RESTFUL ENDPOINT
// GET /filteredimage?image_url={{URL}}
// endpoint to filter an image from a public url.
// IT SHOULD
//    1. validate the image_url query
//    2. call filterImageFromURL(image_url) to filter the image
//    3. send the resulting file in the response
//    4. deletes any files on the server on finish of the response
// QUERY PARAMATERS
//    image_url: URL of a publicly accessible image
// RETURNS
//   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

/**************************************************************************** */
router.get("/", async(req, res) => {
    let {image_url} = req.query;
    let return_msg = "";
    let img_local_path = "";

    try {
        // 1. Validate image_url query string
        if (!image_url) {
            return_msg = "image_url is required! Can't be empty!";
            throw return_msg;
        }

        // 2. Call the filterImageFromURL(image_url) to filter the image
        img_local_path = await filterImageFromURL(image_url);

        // 3. Send the result response to the client
        res.status(200).sendFile(img_local_path, err_cb => {
            
            if (err_cb) { /* error */ 
                return_msg = "Failed to send the filtered image to the client!"
                throw return_msg;
            } else { /* success */
                // 4: Delete filtered images in tmp folder on local server
                let files_name = getAllFilesList();                
                if (files_name.length) {
                    deleteLocalFiles(files_name);
                }
            }
        });          
    } catch (error) {
        //  Catch any errors with HTTP status code
        if (!return_msg) {
            // Error with filterImageFromURL
            return_msg = `Check the accessibility of ${image_url}`;
            res.status(402);
        } else {
            // Otherwise
            res.status(400);
        }
        res.send(return_msg);
    }
    
});

//! END @TODO1

